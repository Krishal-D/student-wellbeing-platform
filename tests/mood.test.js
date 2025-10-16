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

describe('Different mood scores result in different messages passed to res.render()', () => {
    test('mood score 1', async () => {
        const req = { body: { mood_score: 1, notes: 'note' }, user: {userId: 1} };
        const res = { render: mock.fn() };

        await submit(req, res);

        const message = res.render.mock.calls[0].arguments[1].message;
        assert.strictEqual(message, "😢 It seems like you are feeling a bit off today. Reach out to someone close might bring some comfort.");
    });

    test('mood score 2', async () => {
        const req = { body: { mood_score: 2, notes: 'note' }, user: {userId: 1} };
        const res = { render: mock.fn() };

        await submit(req, res);

        const message = res.render.mock.calls[0].arguments[1].message;
        assert.strictEqual(message, "🙁 It seems like you are feeling a little low today. Step back and spend time doing something that help lift up your mood.");
    });

    test('mood score 3', async () => {
        const req = { body: { mood_score: 3, notes: 'note' }, user: {userId: 1} };
        const res = { render: mock.fn() };

        await submit(req, res);

        const message = res.render.mock.calls[0].arguments[1].message;
        assert.strictEqual(message, "😐 Feeling neutral today - hold onto that balance and move gently through your moments.");
    });

    test('mood score 4', async () => {
        const req = { body: { mood_score: 4, notes: 'note' }, user: {userId: 1} };
        const res = { render: mock.fn() };

        await submit(req, res);

        const message = res.render.mock.calls[0].arguments[1].message;
        assert.strictEqual(message, "😀 It is lovely to see you in such a good mood today. Keep holding onto that positive energy.");
    });

    test('mood score 5', async () => {
        const req = { body: { mood_score: 5, notes: 'note' }, user: {userId: 1} };
        const res = { render: mock.fn() };

        await submit(req, res);

        const message = res.render.mock.calls[0].arguments[1].message;
        assert.strictEqual(message, "😄 It is wonderful to see you in such high spirits today. Keep that joy flowing.");
    });

});
