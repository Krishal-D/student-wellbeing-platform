import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import { loginPost, logout } from '../controllers/auth.js';
import { pool } from '../config/db.js';

function makeRes() {
  return {
    render: mock.fn(),
    cookie: mock.fn(),
    redirect: mock.fn(),
    clearCookie: mock.fn(),
    status: mock.fn(() => ({ send: mock.fn() })),
  };
}

describe('Auth controller', () => {
  test('login success sets cookie and redirects', async () => {
    const req = { body: { email: 'user@example.com', password: 'secret' } };
    const res = makeRes();

    const orig = pool.query;
    pool.query = async () => ({ rows: [{ id: 1, name: 'Test User', email: 'user@example.com', password: 'secret' }] });

    await loginPost(req, res);

  assert.strictEqual(res.redirect.mock.callCount(), 1);
  const redirectCall = res.redirect.mock.calls[0];
  assert.strictEqual(redirectCall.arguments[0], '/');
  assert.strictEqual(res.cookie.mock.callCount() > 0, true);

    pool.query = orig;
  });

  test('invalid credentials renders login with error', async () => {
    const req = { body: { email: 'noone@example.com', password: 'bad' } };
    const res = makeRes();

    const orig = pool.query;
    pool.query = async () => ({ rows: [] });

    await loginPost(req, res);

  assert.strictEqual(res.render.mock.callCount(), 1);
  const renderCall = res.render.mock.calls[0];
  assert.strictEqual(renderCall.arguments[0], 'login');
  assert.strictEqual(renderCall.arguments[1].error, 'Invalid credentials');

    pool.query = orig;
  });

  test('login DB error renders server error', async () => {
    const req = { body: { email: 'err@example.com', password: 'x' } };
    const res = makeRes();

    const orig = pool.query;
    pool.query = async () => { throw new Error('db failure'); };

    await loginPost(req, res);

  assert.strictEqual(res.render.mock.callCount(), 1);
  assert.strictEqual(res.render.mock.calls[0].arguments[1].error, 'Server error');

    pool.query = orig;
  });

  test('logout clears cookie and redirects to /login', () => {
    const req = {};
    const res = makeRes();

    logout(req, res);

  assert.strictEqual(res.clearCookie.mock.callCount(), 1);
  assert.strictEqual(res.clearCookie.mock.calls[0].arguments[0], 'user');
  assert.strictEqual(res.redirect.mock.callCount(), 1);
  assert.strictEqual(res.redirect.mock.calls[0].arguments[0], '/login');
  });
});
