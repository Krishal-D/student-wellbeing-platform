import {test, describe, mock} from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../config/db.js';
import { submit, show } from '../controllers/alertDashboard.js';




describe('tests for the show() function', () => {
    // mock database
    mock.method(pool, 'query', async (sql, params) => {
        if (sql.startsWith('SELECT alert.id, alert.handled')) {
            return { rows: [], };
        }
    });

    test('Should render the Alert Dashboard Page', async() => { 
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

    test('messages from database get added to res.render() when its called', async() => {
        const req = {user: {userId: 1} } ;
        const res = {render: mock.fn() };
        
        // mock database to return 2 messages
        mock.method(pool, 'query', async (sql, params) => {
            if (sql.startsWith('SELECT users.name, message.message_text')) {
                return { 
                    rows: [ { name: "Testuser1", message_text: "msg1", created_at: new Date() } ]
                };
            }

        });

        await show(req, res);

        const name = res.render.mock.calls[0].arguments[1].inboxMessages[0].name;
        const message = res.render.mock.calls[0].arguments[1].inboxMessages[0].message_text;
        const date = res.render.mock.calls[0].arguments[1].inboxMessages[0].created_at;

        assert.strictEqual(name, 'Testuser1');
        assert.strictEqual(message, 'msg1');
        assert.notStrictEqual(date, 'Invalid Date');  
        // ^ Not having a date will result in "invalid date", not  empty like the others 


    });

});