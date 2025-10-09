import {test, describe, mock} from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../config/db.js';
import { submit, show } from '../controllers/social.js';

// mock database
mock.method(pool, 'query', async (sql, params) => {
    if (sql.startsWith('SELECT id, name FROM users WHERE name =')) {
        return { 
            rows: [],
        };
    }
    if (sql.startsWith('INSERT INTO message')) {
        return { rowCount: 1 };
    }
    return {rows: [] };
});

describe('show() function tests', () => {
    test('Should render the Social Networking Page', async() => { 
        const req = {} };
        const res = {render: mock.fn() };

        await show(req, res);

        assert.strictEqual(res.render.mock.callCount(), 1);

    });

});


describe('submit() function tests', () => {
    test('Blank to_user and message_text form fields results in res.render() with 2 error messages', async () => {
        const req = {body: { to_user: '', message_text: '' }, user: {userId: 1} };
        const res = {status: mock.fn(() => res), send: mock.fn() , render: mock.fn() };

        await submit(req, res);

        assert.strictEqual(res.render.mock.calls[0].arguments[1].errors.to_user, 'No username entered.');
        assert.strictEqual(res.render.mock.calls[0].arguments[1].errors.message_text, 'No message entered.');

    });


    test('empty table results in res.render() with User Not Found message', async () => {
        const req = {body: { to_user: 'John', message_text: 'msg' }, user: {userId: 1} };
        const res = {status: mock.fn(() => res), send: mock.fn() , render: mock.fn() };
        
        // mock database to return empty table (no user found)
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('SELECT id, name FROM users WHERE name =')) {
                return { rows: [] };
            }
        });

        await submit(req, res);
        
        assert.strictEqual(res.render.mock.calls[0].arguments[1].errors.to_user, 'User not found in database.');
        
    });

    test('no errors and user found results in res.render() call with \'success\'', async () => {
        const req = {body: { to_user: 'Testuser2', message_text: 'msg' }, user: {userId: 1} };
        const res = {status: mock.fn(() => res), send: mock.fn() , render: mock.fn() };
        
        // mock database to return table with 1 user (user found)
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('SELECT id, name FROM users WHERE name =')) {
                return { rows: [ { id: 2, name: 'Testuser2' } ] };
            }
        });

        await submit(req, res);

        // contains the errors. eg:   to_user: "User not found in database." 
        const errors = res.render.mock.calls[0].arguments[1].errors

        assert.strictEqual(Object.keys(errors).length, 0);  // errors is empty (no errors)
        assert.strictEqual(res.render.mock.calls[0].arguments[1].success, true);
    });
});