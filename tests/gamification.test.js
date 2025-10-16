import {test, describe, mock} from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../config/db.js';
import { show } from '../controllers/gamification.js';

// mock database
mock.method(pool, 'query', async (sql, params) => {
    if (sql.startsWith('SELECT COALESCE')) {
        return { rows: [{ sum_points: 150 }] };
    }

    if (sql.startsWith('SELECT id, points')) {
        return { 
            rows: [ 
                { id: 1, points: 10, date_earned: new Date() },
                { id: 2, points: 20, date_earned: new Date() },
                { id: 3, points: 30, date_earned: new Date() },
                { id: 4, points: 40, date_earned: new Date() },
                { id: 5, points: 50, date_earned: new Date() },
            ],
        };
    }
    return {rows: [] };
});

// main test suite
describe ('Gamification Feature Tests', () => {

    // test gamification controller for show methods
    describe('gamification.show controller', () => {
        test('Should render the Gamification Page correctly', async() => { 
            const req ={ user: {userId: 1 } };
            const res = { render: mock.fn() };

            await show(req, res);

            // validate rendering
            assert.strictEqual(res.render.mock.callCount(), 1);
            const renderCall = res.render.mock.calls[0];
            assert.strictEqual(renderCall.arguments[0], 'gamification');

            const data = renderCall.arguments[1];
            assert.strictEqual(data.title, 'Gamification Page');
            assert.strictEqual(data.totalPoints, 150);
            assert.strictEqual(data.badge_name, 'Bronze Achiever');
            assert.strictEqual(data.icon, '🥉');
            assert.ok(Array.isArray(data.progress));

        });
    });



    // badge level validation
    describe('Gamification badge logic validation', () => {

        test('Should display "Keep Going!" for total points below 100', async () => {
            pool.query.mock.mockImplementationOnce(async (sql) => {
                if (sql.startsWith('SELECT COALESCE')) return { rows: [{ sum_points: 60 }] };
                if (sql.startsWith('SELECT id, points')) return { rows: [{ id: 1, points: 10, date_earned: new Date() }] };
            });
            
            const req = { user: { userId: 2 } };
            const res = { render: mock.fn() };

            await show(req, res);
            const data = res.render.mock.calls[0].arguments[1];
            assert.strictEqual(data.badge_name, 'Keep Going!');
            assert.strictEqual(data.icon, '🏅');
        });

        test('Should display "Bronze Achiever" for total points between 100-199', async () => {
            pool.query.mock.mockImplementationOnce(async(sql) => {
                if (sql.startsWith('SELECT COALESCE')) return { rows: [{ sum_points: 150 }] };
                if (sql.startsWith('SELECT id, points')) return { rows: [{ id: 1, points: 20, date_earned: new Date() }] };
        });

            const req = { user: { userId: 3 } };
            const res = { render: mock.fn() };

            await show(req, res);
            const data = res.render.mock.calls[0].arguments[1];
            assert.strictEqual(data.badge_name, 'Bronze Achiever');
            assert.strictEqual(data.icon, '🥉');

        });

        test('Should display "Silver Achiever" for total points between 200-299', async () => {
            pool.query.mock.mockImplementationOnce(async(sql) => {
                if (sql.startsWith('SELECT COALESCE')) return { rows: [{ sum_points: 250 }] };
                if (sql.startsWith('SELECT id, points')) return { rows: [{ id: 1, points: 25, date_earned: new Date() }] };
        });

            const req = { user: { userId: 4 } };
            const res = { render: mock.fn() };

            await show(req, res);
            const data = res.render.mock.calls[0].arguments[1];
            assert.strictEqual(data.badge_name, 'Silver Achiever');
            assert.strictEqual(data.icon, '🥈');

        });

        test('Should display "Gold Achiever" for total points between 300+', async () => {
            pool.query.mock.mockImplementationOnce(async(sql) => {
                if (sql.startsWith('SELECT COALESCE')) return { rows: [{ sum_points: 310 }] };
                if (sql.startsWith('SELECT id, points')) return { rows: [{ id: 1, points: 30, date_earned: new Date() }] };
        });

            const req = { user: { userId: 5 } };
            const res = { render: mock.fn() };

            await show(req, res);
            const data = res.render.mock.calls[0].arguments[1];
            assert.strictEqual(data.badge_name, 'Gold Achiever');
            assert.strictEqual(data.icon, '🥇');

        });
    });


    // database validation

    describe('Gamification database mock validation', () => {
    test('Should return valid gamification records', async () => {
        const result = await pool.query('SELECT id, points, date_earned FROM gamification');
        const record = result.rows[0];

        assert.ok(record.id);
        assert.ok(record.points);
        assert.ok(record.date_earned);
    });
});

    // error handling
    describe('Gamification error handling', () => {
    test('Should handle database error gracefully', async () => {
        pool.query.mock.mockImplementationOnce(async() => {
            throw new Error('DB Error');
        });
            const req = { user: { userId: 6 } };
            const res = { status: mock.fn(() => res), send: mock.fn() };

            await show(req, res);


            assert.strictEqual(res.status.mock.callCount(), 1);
            assert.strictEqual(res.send.mock.callCount(), 1);
            assert.strictEqual(res.status.mock.calls[0].arguments[0], 500);
            assert.strictEqual(res.send.mock.calls[0].arguments[0], 'Server error');
        });
    
    // booundary conditions for badges
    test('Should assign correct badge exactly at boundary points', async() => { 
        
        const thresholds = [
            {points: 100, badge: 'Bronze Achiever', icon: '🥉'},
            {points: 200, badge: 'Silver Achiever', icon: '🥈'},
            {points: 300, badge: 'Gold Achiever', icon: '🥇'},
        ];
        
        for (const { points, badge, icon} of thresholds) {
            pool.query.mock.mockImplementation(async (sql) => {
                if (sql.startsWith('SELECT COALESCE')) return { rows: [{ sum_points: points }] };
                if (sql.startsWith('SELECT id, points')) return { rows: [{ id: 1, points: 10, date_earned: new Date() }] };
            });
            
            const req ={ user: {userId: 7 } };
            const res = { render: mock.fn() };
            
            await show(req, res);
            const data = res.render.mock.calls[0].arguments[1];

            assert.strictEqual(data.badge_name, badge);
            assert.strictEqual(data.icon, icon);

        }
        });

    // test rendering with multiple records
    test('Should handle multiple progress records correctly', async() => { 
        
        const thresholds = [
            {points: 100, badge: 'Bronze Achiever', icon: '🥉'},
            {points: 200, badge: 'Silver Achiever', icon: '🥈'},
            {points: 300, badge: 'Gold Achiever', icon: '🥇'},
        ];
        
        for (const { points, badge, icon} of thresholds) {
            pool.query.mock.mockImplementation(async (sql) => {
                if (sql.startsWith('SELECT COALESCE')) return { rows: [{ sum_points: 150 }] };
                if (sql.startsWith('SELECT id, points')) {
                    
                    return {
                        rows: [
                            { id: 1, points: 10, date_earned: new Date() },
                            { id: 2, points: 20, date_earned: new Date() },
                            { id: 3, points: 30, date_earned: new Date() },
                            { id: 4, points: 40, date_earned: new Date() },
                            { id: 5, points: 50, date_earned: new Date() },
                        ],
                    };
                    
                }
            });
            
            const req ={ user: {userId: 8 } };
            const res = { render: mock.fn() };
            
            await show(req, res);
            const data = res.render.mock.calls[0].arguments[1];

            assert.ok(Array.isArray(data.progress));
            assert.strictEqual(data.progress.length, 5);

        }
        });
    });
});
