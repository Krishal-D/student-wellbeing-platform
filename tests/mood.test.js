import {test, describe, mock} from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../config/db.js';
import { submit, show } from '../controllers/mood.js';

// mock database
mock.method(pool, 'query', async (sql, params) => {
    if (sql.startsWith('INSERT INTO mood')) {
        return { rowCount: 1 };
    }
    if (sql.startsWith('SELECT')) {
        return { 
            rows: [ 
                { id: 1, mood_score: 5, notes: "Feeling excited for summer", created_at: new Date() },
                { id: 2, mood_score: 4, notes: "Feeling happy", created_at: new Date() },
                { id: 3, mood_score: 3, notes: "Feeling okay", created_at: new Date() },
                { id: 4, mood_score: 2, notes: "Did not do well on the exam", created_at: new Date() },
                { id: 5, mood_score: 1, notes: "Feeling weak", created_at: new Date() },
            ],
        };
    }
    return {rows: [] };
});

// test mood controller for both GET and POST methods
describe ('Mood Feature Tests', () => {

    // POST method
    describe('mood.show controller', () => {
        test('Should render the Mood Track Page', async() => { 
            const req ={};
            const res = { render: mock.fn() };

            await show(req, res);

            assert.strictEqual(res.render.mock.callCount(), 1);
            const renderCall = res.render.mock.calls[0];
            assert.strictEqual(renderCall.arguments[0], 'mood');

            const data = renderCall.arguments[1];
            assert.strictEqual(data.title, 'Mood Track Page');
        });
    });

    // GET method
    describe('mood.submit controller', () => {
        test('Should reject the invalid mood score', async () => {
            const req = {body: { mood_score: 6, notes: '' }, user: {userId: 6} };
            const res = {status: mock.fn(() => res), send: mock.fn() };

            await submit(req, res);

            assert.strictEqual(res.status.mock.callCount(), 1);
            assert.strictEqual(res.send.mock.callCount(), 1);
            assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
            assert.strictEqual(res.send.mock.calls[0].arguments[0], 'Invalid mood score');
        });

        test('Should render the feedback for valid mood', async() => {
            const req = { body: { mood_score: 3, notes: 'Neutral' }, user: {userId: 7} };
            const res = { render: mock.fn() };

            await submit(req, res);

            assert.strictEqual(res.render.mock.callCount(), 1);
            const renderCall = res.render.mock.calls[0];
            assert.strictEqual(renderCall.arguments[0], 'moodFeedback');

            const data = renderCall.arguments[1];
            assert.strictEqual(data.title, 'Mood Submitted Page');
            assert.ok(
                data.message.includes('😢') || 
                data.message.includes('🙁') || 
                data.message.includes('😐') || 
                data.message.includes('😀') || 
                data.message.includes('😄'))
        });
    });

    // basic validation
    describe('Mood database mock validation', () => {
        test('Should return a valid mood record', async () => {
            const result = await pool.query('SELECT * From mood');
            const mood = result.rows[0];

            assert.ok(mood.id);
            assert.ok(mood.mood_score);
            assert.ok(mood.notes);
            assert.ok(mood.created_at);
        });
    });
});