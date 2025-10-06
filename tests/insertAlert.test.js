import {alertCheck, insertAlert} from './mood.js';
import {suite, test} from 'node:test';
import assert from 'node:assert';

let pool;
let insertAlertCalled;

suite('alertCheck() Tests', () => {
    beforeEach(() => {
        pool = { query: async () => ({ rows: [] }) };
        
        // Helper to track calls
        insertAlertCalled = false;
        moodModule.insertAlert = async () => { insertAlertCalled = true; };
    });

    test('Should not call insertAlert if less than 3 moods', async () => {
        pool.query = async () => ({rows: [{mood_score: 2}, {mood_score: 2}]});

        await alertCheck({}, {}, 1);

        assert.strictEqual(insertAlertCalled, false, 'insertAlert should NOT be called for less than 3 moods');
    });

});