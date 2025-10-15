import {pool} from '../config/db.js';

let alerts; // used in both show() and submit(). Holds alerts read from DB

export async function show(req, res, next) {
  try{
    // get all alerts from table
    // (I had to join with users table to display username
    //  instead of just userID, which is in a different table))
    const result = await pool.query(
      `SELECT alert.id, alert.handled, alert.created_at, users.name 
      FROM alert 
      JOIN users ON alert.user_id = users.id 
      ORDER BY alert.created_at DESC`
    );
    // convert to AU/Sydney timezone
    alerts = result.rows.map((alert) => {
      const localTime = new Date(alert.created_at).toLocaleString('en-AU', {timeZone: 'Australia/Sydney'});
      return {...alert, created_at: localTime};
    });

    res.render('alertDashboard', {title: 'Alert Dashboard', alerts, errors : {}, success : false});

  }  catch (err) {
    console.error('Database error: ', err);
    res.status(500).send('Database error when getting alerts from database.');
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
        errors.to_user = "User not found in database.";
      }

      // console.log("userRow: ", userRow);

    } catch (err) {
        console.error('Database error when reading from database', err);
        errors.to_user = 'The username does not exist.';
        return res.render('alertDashboard', { title: 'Alert Dashboard', alerts, errors: errors, success : false });
    }
  }

  // if message field is empty
  if (!message_text) {
    errors.message_text = 'No message entered.';
  } else if (message_text.length > 1000) {
    errors.message_text = 'Message must not exceed 1000 characters';
  }

  // if there are errors: render page with error messages under form elements
  // else: insert message into database
  if (Object.keys(errors).length > 0) {
    return res.render('alertDashboard', { title: 'Alert Dashboard', alerts, errors: errors, success : false });
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

 
      // Change alerts to "hannded=true" in the alert table
      await pool.query(
          `UPDATE alert
           SET handled = true
           WHERE user_id = $1 AND handled = FALSE`,
          [userRow[0].id]
      );

      console.log('handled attributes updated in the alert table');
 

      return res.render('alertDashboard', { title: 'Alert Dashboard', alerts, errors: errors, success : true });
      
    } catch (err) {
      console.log("#####################################");
      console.error('Database error when entering message into database, or when updated \'handled\' attribute of alert', err);
    }


  }
}