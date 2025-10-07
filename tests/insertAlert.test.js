import {alertCheck, insertAlert} from '../controllers/mood.js';
import {suite, test, beforeEach} from 'node:test';
import assert from 'node:assert';

/* Ing's test, for mood.js
mock.method(pool, 'query', async () => {
    return { 
        rows: [ 
            { id: 1, mood_score: 2, notes: "Feeling excited for summer", created_at: new Date() },
            { id: 2, mood_score: 1, notes: "Feeling happy", created_at: new Date() },
            { id: 3, mood_score: 2, notes: "Feeling okay", created_at: new Date() },
            { id: 4, mood_score: 2, notes: "Did not do well on the exam", created_at: new Date() },
            { id: 5, mood_score: 1, notes: "Feeling weak", created_at: new Date() },
        ],
    };
});


suite('alertCheck() Tests', () => {
    test('Should not call insertAlert if less than 3 moods', async () => {
            const result = await pool.query('SELECT * From mood');
            const mood = result.rows[0];

            assert.ok(mood.id);
            assert.ok(mood.mood_score);
            assert.ok(mood.notes);
            assert.ok(mood.created_at);
    });

});
*/