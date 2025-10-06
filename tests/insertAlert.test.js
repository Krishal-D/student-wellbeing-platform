import {alertCheck, insertAlert} from '../controllers/mood.js';
import {suite, test, beforeEach, mock} from 'node:test';
import assert from 'node:assert';




suite('alertCheck() unit tests', () => {

    test('Should not call insertAlert if less than 3 moods', async () => {
        let insertAlertCalled = false;

        mock.method('../controllers/mood.js', 'insertAlert', async () => { insertAlertCalled = true; });


        const mockPool = { query: async () => ({rows: [{mood_score: 2}, {mood_score: 2}]}) };

        await alertCheck({pool: mockPool}, {}, 1);

        assert.strictEqual(insertAlertCalled, false, 'insertAlert should NOT be called for less than 3 moods');
    
    });

});
