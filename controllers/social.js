import {pool} from '../config/db.js';

let inboxMessages; // used in both show() and submit()

export async function show(req, res, next) {
  try {
    const user_id = req.user.userId;
    
    // get all messages that have been sent to the logged-in user
    const result = await pool.query(
      `SELECT users.name, message.message_text, message.created_at
      FROM message 
      JOIN users ON message.to_user_id = users.id 
      WHERE message.to_user_id = $1
      ORDER BY message.created_at DESC`,
      [user_id]
    );

    // convert to AU/Sydney timezone
    inboxMessages = result.rows.map((message) => {
      const localTime = new Date(message.created_at).toLocaleString('en-AU', {timeZone: 'Australia/Sydney'});
      return {...message, created_at: localTime};
    });


    res.render('social', { title: 'Social Networking', inboxMessages, errors : {}, success : false });

  } catch (err) {
      console.error('Database error when getting messages from DB for inbox', err);
      res.status(500).send('Database error when getting messages from DB for inbox');
  }

  
}

export async function submit(req, res, next) {

  const user_id = req.user.userId;
  const {to_user, message_text} = req.body;   // from form
  const errors = {};  //  errors in this will display under the form elements
  let userRow;

  // if username field is empty
  if (!to_user) {
    errors.to_user = 'No username entered.';
  } else { // check if the username exists in the database
    try {
      const result = await pool.query(
        `SELECT id, name FROM users WHERE name = $1`, [to_user]
      );
      userRow = result.rows; 

      if (userRow.length == 0) {
        errors.to_user = "User not found in database";
      }


    } catch (err) {
        console.error('Database error when reading from database', err);
        errors.to_user = 'The username does not exist.';
        return res.render('social', { title: 'Social Networking', inboxMessages, errors: errors, success : false });
    }
  }

  // if message field is empty
  if (!message_text) {
    errors.message_text = 'No message entered.';
  } else if (message_text.length > 1000) {
    errors.message_text = 'Message not exceed 1000 characters';
  }

  // if there are errors: render page with error messages under form elements
  // else: insert message into database
  if (Object.keys(errors).length > 0) {
    return res.render('social', { title: 'Social Networking', inboxMessages, errors: errors, success : false });
  } else { 
    try {
      await pool.query(
          `INSERT INTO message 
          (to_user_id, from_user_id, message_text) 
          VALUES ($1, $2, $3)`,
          [userRow[0].id, user_id, message_text]
          // ^ recipient, signed-in user, message content
      ); 

      console.log('message entered into the message table');

      return res.render('social', { title: 'Social Networking', inboxMessages, errors: errors, success: true });
      
    } catch (err) {
      console.error('Database error when entering message into database', err);
    }


  }
 
}

