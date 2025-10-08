import {pool} from '../config/db.js';

export async function show(req, res, next) {
  res.render('social', { title: 'Social Networking', errors : {} });
}

export async function submit(req, res, next) {

  const user_id = req.user.userId;
  const {to_user, message_text} = req.body;
  const errors = {};

  // if username field is empty
  if (!to_user) {
    errors.to_user = 'No username entered.';
  }
  // if message field is empty
  if (!message_text) {
    errors.message_text = 'No message entered.';
  }

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE name = $1', [to_user]
    );
    const userRow = result.rows; 
    console.log("User row: ", userRow);
    console.log("User row length: ", userRow.length);

  } catch (err) {
      console.error('Database error: ', err);
      res.status(500).send('Database error');
  } 

  if (Object.keys(errors).length > 0) {
    return res.render('social', { title: 'Social Networking', errors: errors });
  }


}

