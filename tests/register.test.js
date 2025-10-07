import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import { registerUser } from '../controllers/register.js';
import { pool } from '../config/db.js';

function makeRes() {
  return {
    cookie: mock.fn(),
    redirect: mock.fn(),
    status: mock.fn(() => ({ send: mock.fn() })),
  };
}

describe('Register controller', () => {
  test('missing fields returns 400', async () => {
    const req = { body: { name: 'A', email: '', password: 'p', confirmPassword: 'p' } };
    const res = makeRes();

    await registerUser(req, res);

  assert.strictEqual(res.status.mock.callCount(), 1);
  assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
  });

  test('password mismatch returns 400', async () => {
    const req = { body: { name: 'A', email: 'a@b.com', password: 'p1', confirmPassword: 'p2' } };
    const res = makeRes();

    await registerUser(req, res);

  assert.strictEqual(res.status.mock.callCount(), 1);
  assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
  });

  test('email already registered returns 400', async () => {
    const req = { body: { name: 'A', email: 'a@b.com', password: 'p', confirmPassword: 'p' } };
    const res = makeRes();

    const orig = pool.query;
    pool.query = async (sql, params) => {
      if (sql.startsWith('SELECT')) return { rows: [{ id: 1 }] };
      return { rows: [] };
    };

    await registerUser(req, res);

  assert.strictEqual(res.status.mock.callCount(), 1);
  assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);

    pool.query = orig;
  });

  test('successful register sets cookie and redirects', async () => {
    const req = { body: { name: 'New', email: 'new@b.com', password: 'p', confirmPassword: 'p' } };
    const res = makeRes();

    const orig = pool.query;
    let step = 0;
    pool.query = async (sql, params) => {
      step++;
      if (step === 1) return { rows: [] }; // email check
      return { rows: [{ id: 42, name: 'New', email: 'new@b.com' }] }; // insert
    };

    await registerUser(req, res);

  assert.strictEqual(res.redirect.mock.callCount(), 1);
  assert.strictEqual(res.redirect.mock.calls[0].arguments[0], '/');
  assert.strictEqual(res.cookie.mock.callCount() > 0, true);

    pool.query = orig;
  });
});
