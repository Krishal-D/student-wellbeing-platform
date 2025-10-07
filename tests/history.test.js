import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import { pool } from '../config/db.js';
import { show } from '../controllers/history.js';

// mock the database
mock.method(pool, 'query', async (sql, params) => {
    if (sql.startsWith('SELECT')) {
        return { 
            rows: [ 
                { id: 1, mood_score: 1, notes: 'Feeling exhuasted', created_at: new Date() },
                { id: 1, mood_score: 2, notes: 'Not feeling well', created_at: new Date() },
                { id: 1, mood_score: 3, notes: 'Feeling alright', created_at: new Date() },
                { id: 1, mood_score: 4, notes: 'Good day hehehe', created_at: new Date() },
                { id: 1, mood_score: 5, notes: 'Feeling joyful', created_at: new Date() },
            ],
        };
    }
    return {rows: [] };
});

// test controller for show method
describe('History Feature Tests', () => {
    describe('Should render Mood History Page', async () => {
        const req ={user: {userId: 8} };
        const res = { render: mock.fn() };

        await show(req, res);

        assert.strictEqual(res.render.mock.callCount(), 1);
        const renderCall = res.render.mock.calls[0];
        assert.strictEqual(renderCall.arguments[0], 'history');

        const data = renderCall.arguments[1];
        assert.strictEqual(data.title, 'Mood History Page');
        assert.ok(Array.isArray(data.moods));
        assert.ok(data.moods.length > 0);
    });
    
    test('Should handle the database errors gracefully', async () => {
        const req ={user: {userId: 9} };
        const res = { status: mock.fn(() => res), send: mock.fn() };

        // test error handling with a mock DB failure
        pool.query.mock.mockImplementationOnce(async () => { throw new Error('Database Error'); });

        await show(req, res);

        assert.strictEqual(res.status.mock.callCount(), 1);
        assert.strictEqual(res.send.mock.callCount(), 1);
        assert.strictEqual(res.status.mock.calls[0].arguments[0], 500);
        assert.strictEqual(res.send.mock.calls[0].arguments[0], 'Server error');
    });
});

// database mock validation
describe('Database mock validation', () => {
    test('Should return a several mood entries', async () => {
        const result = await pool.query('SELECT * From mood WHERE user_id = 10');
            
        assert.ok(Array.isArray(result.rows));
        assert.ok(result.rows.length > 0);
    });
});
