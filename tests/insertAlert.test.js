import {alertCheck} from '../controllers/mood.js';
import {test, describe, mock} from 'node:test';
import assert from 'node:assert';
import { pool } from '../config/db.js';

let alertInserted = false;

describe ('Alert insert tests', () => {

    test('alert is added when last 3 scores are negative', async () => {
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('INSERT INTO alert')) {
                alertInserted = true;
            }
            if (sql.startsWith('SELECT')) {
                return { 
                    rows: [ 
                        { mood_score: 1 },
                        { mood_score: 2 },
                        { mood_score: 1 },
                    ],
                };
            }
        });

        alertInserted = false;

        await alertCheck({}, {}, 1);

        assert.strictEqual(alertInserted, true, 'Alert should have been inserted into the database');
    });

    test('alert is NOT added when 3 negative scores exist, but 3 most recent are positive', async () => {
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('INSERT INTO alert')) {
                alertInserted = true;
            }
            if (sql.startsWith('SELECT')) {
                return { 
                    rows: [ 
                        { mood_score: 3 },
                        { mood_score: 1 },
                        { mood_score: 2 },
                        { mood_score: 2 },
                    ],
                };
            }
        });

        alertInserted = false;

        await alertCheck({}, {}, 1);

        assert.strictEqual(alertInserted, false, 'Alert should have been inserted into the database');
    });

});
