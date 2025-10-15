import {test, describe, mock} from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../config/db.js';
import { submit, show } from '../controllers/alertDashboard.js';



describe('tests for the show() function', () => {
    test('Should render the Alert Dashboard Page', async() => { 
        // mock database
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('SELECT alert.id')) {
                return { rows: [], };
            }
        });

        const req = {user: {userId: 3} } ;
        const res = {render: mock.fn() };

        await show(req, res);

        const args = res.render.mock.calls[0].arguments[1];

        // check the correct arguments passed to res.render()
        assert.deepEqual(args, {
            title: 'Alert Dashboard',
            alerts: [],
            errors : {},
            success : false
        });

        assert.strictEqual(res.render.mock.callCount(), 1);

    });

    test('an alert from DB gets passed to res.render()', async() => {
        // mock database to return 1 alert
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('SELECT alert.id')) {
                return { 
                    rows: [ { id: 1, user_id: 2, handled: false, created_at: new Date() } ]
                };
            }

        });

        const req = {user: {userId: 3} } ;
        const res = {render: mock.fn() };

        await show(req, res);

        const id = res.render.mock.calls[0].arguments[1].alerts[0].id;
        const user_id = res.render.mock.calls[0].arguments[1].alerts[0].user_id;
        const handled = res.render.mock.calls[0].arguments[1].alerts[0].handled;
        const date = res.render.mock.calls[0].arguments[1].alerts[0].created_at;

        assert.strictEqual(id, 1);
        assert.strictEqual(user_id, 2);
        assert.strictEqual(handled, false);
        assert.notStrictEqual(date, 'Invalid Date');  
        // ^ Not having a date will result in "invalid date"

    });

});


describe('tests for the submit() function', () => {

    test('empty table results in res.render() with User Not Found message', async () => {
        const req = {body: { to_user: 'John', message_text: 'msg' }, user: {userId: 1} };
        const res = {status: mock.fn(() => res), send: mock.fn() , render: mock.fn() };
        
        // mock database to return empty table (no user found)
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('SELECT id, name FROM users WHERE name =')) {
                return { rows: [] };
            }
            if (sql.startsWith('INSERT INTO message')) {
                return { rowCount: 1 };
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
            if (sql.startsWith('INSERT INTO message')) {
                return { rowCount: 1 };
            }
        });

        await submit(req, res);

        // contains the errors. eg:   to_user: "User not found in database." 
        const errors = res.render.mock.calls[0].arguments[1].errors

        assert.strictEqual(Object.keys(errors).length, 0);  // errors is empty (no errors)
        assert.strictEqual(res.render.mock.calls[0].arguments[1].success, true);
    });

    test('Blank to_user and message_text form fields results in res.render() with 2 error messages', async () => {
        const req = {body: { to_user: '', message_text: '' }, user: {userId: 1} };
        const res = {status: mock.fn(() => res), send: mock.fn() , render: mock.fn() };

        await submit(req, res);

        assert.strictEqual(res.render.mock.calls[0].arguments[1].errors.to_user, 'No username entered.');
        assert.strictEqual(res.render.mock.calls[0].arguments[1].errors.message_text, 'No message entered.');

    });

    test('message with > 1000 characters results in res.render() with correct error message', async () => {
        const longMessage = 'a'.repeat(1001); 
        console.log("longMessage length: ", longMessage.length);
        const req = {body: { to_user: 'Testuser2', message_text: longMessage }, user: {userId: 1} };
        const res = {status: mock.fn(() => res), send: mock.fn() , render: mock.fn() };

        await submit(req, res);

        assert.strictEqual(res.render.mock.calls[0].arguments[1].errors.message_text, 'Message must not exceed 1000 characters');
    });

});

describe('tests for catch statements', () => {
    test('show() function handles database errors', async () => {
        // mock database
        mock.method(pool, 'query', async (sql, params) => {
            throw new Error('Database Error');
        });

        const req = {user: {userId: 1} } ;
        const res = {render: mock.fn(), status: mock.fn(() => res), send: mock.fn() };

        await show(req, res);
        
        assert.strictEqual(res.status.mock.callCount(), 1);
        assert.strictEqual(res.send.mock.callCount(), 1);
        assert.strictEqual(res.status.mock.calls[0].arguments[0], 500);
        assert.strictEqual(res.send.mock.calls[0].arguments[0], 'Database error when getting alerts from database.');
    });

    test('submit() function handles database errors (1st catch statement)', async () => {
        // mock database 
        mock.method(pool, 'query', async (sql, params) => {
            throw new Error('Database Error');
        });

        const req = {user: {userId: 1}, body: { to_user: "user5"} };
        const res = {status: mock.fn(() => res), send: mock.fn() , render: mock.fn() };

        await submit(req, res);
        
        /* console.log("args: ", res.render.mock.calls[0].arguments); */
        
        assert.strictEqual(res.render.mock.callCount(), 1);
        assert.strictEqual(res.render.mock.calls[0].arguments[1].errors.to_user, 'The username does not exist.');
        /* this catch statement doesn't use res.status.send() */
    });

    test('submit() function handles database errors (2nd catch statement)', async () => {
        // mock database 
        mock.method(pool, 'query', async (sql, params) => {
            throw new Error('Database Error');
        });

        // mock the console.error to test if it ran
        const consoleErrorMock = mock.method(console, 'error');

        const req = {user: {userId: 1}, body: { to_user: "user5", message_text: "msg"}, errors: {} };
        const res = {status: mock.fn(() => res), send: mock.fn() , render: mock.fn() };

        await submit(req, res);
        assert.strictEqual(consoleErrorMock.mock.callCount(), 1);        

    });

});
