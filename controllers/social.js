import {pool} from '../config/db.js';

export async function show(req, res, next) {
  res.render('social', { title: 'Social Networking', errors : {} });
}

export async function submit(req, res, next) {

  const user_id = req.user.userId;
  const {to_user, message_text} = req.body;
  const errors = {};
  let userRow;

  // if username field is empty
  if (!to_user) {
    errors.to_user = 'No username entered.';
  }
  // if message field is empty
  if (!message_text) {
    errors.message_text = 'No message entered.';
  } else if (message_text.length > 5000) {
    errors.message_text = 'Message not exceed 5000 characters';
  }

  // check if the username exists in the database
  try {
    const result = await pool.query(
      `SELECT id, name FROM users WHERE name = $1`, [to_user]
    );
    userRow = result.rows; 
    console.log('userRow: ', userRow);
  } catch (err) {
      console.error('Database error when reading from database', err);
      errors.to_user = 'The username does not exist.';
      return res.render('social', { title: 'Social Networking', errors: errors });
  }

  // if there are errors, render page with error messages under form elements
  if (Object.keys(errors).length > 0) {
    return res.render('social', { title: 'Social Networking', errors: errors });
  } else { // insert message into database
    try {
      await pool.query(
          `INSERT INTO message 
          (to_user_id, from_user_id, message_text) 
          VALUES ($1, $2, $3)`,
          [userRow[0].id, user_id, message_text]
          // ^ recipitent, signed-in user, message content
      ); 


      console.log('message entered into the message table');
    } catch (err) {
      console.error('Database error when entering message into database', err);
    }
  }
 

  


}

