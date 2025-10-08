import {alertCheck} from '../controllers/mood.js';
import {test, describe, mock} from 'node:test';
import assert from 'node:assert';
import { pool } from '../config/db.js';

let alertInserted = false;

describe ('Alert insert tests', () => {

    test('alert is added when last 3 moods are negative', async () => {
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('INSERT INTO alert')) {
                alertInserted = true;
            }
            if (sql.startsWith('SELECT')) {
                return { 
                    rows: [ 
                        { id: 5, mood_score: 1, notes: "note", created_at: new Date() },
                        { id: 5, mood_score: 2, notes: "note", created_at: new Date() },
                        { id: 5, mood_score: 1, notes: "note", created_at: new Date() },
                        { id: 5, mood_score: 5, notes: "note", created_at: new Date() },
                    ],
                };
            }
        });

        alertInserted = false;

        await alertCheck({}, {}, {});

        assert.strictEqual(alertInserted, true, 'Alert should have been inserted into the database');
    });

    test('alert is NOT added when 3 negative scores exist, but they arent the last 3', async () => {
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('INSERT INTO alert')) {
                alertInserted = true;
            }
            if (sql.startsWith('SELECT')) {
                return { 
                    rows: [ 
                        { id: 5, mood_score: 4, notes: "note", created_at: new Date() },
                        { id: 5, mood_score: 1, notes: "note", created_at: new Date() },
                        { id: 5, mood_score: 2, notes: "note", created_at: new Date() },
                        { id: 5, mood_score: 1, notes: "note", created_at: new Date() },
                    ],
                };
            }
        });

        alertInserted = false;

        await alertCheck({}, {}, {});

        assert.strictEqual(alertInserted, false, 'Alert should have been inserted into the database');
    });

    test('alert is NOT added when no moods have been entered', async () => {
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('INSERT INTO alert')) {
                alertInserted = true;
            }
            if (sql.startsWith('SELECT')) {
                return { 
                    rows: [],
                };
            }
        });

        alertInserted = false;

        await alertCheck({}, {}, {});

        assert.strictEqual(alertInserted, false, 'Alert should have been inserted into the database');
    });

});
