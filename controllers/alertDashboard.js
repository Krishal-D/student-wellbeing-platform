import {pool} from '../config/db.js';

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
    const alerts = result.rows.map((alert) => {
      const localTime = new Date(alert.created_at).toLocaleString('en-AU', {timeZone: 'Australia/Sydney'});
      return {...alert, created_at: localTime};
    });

    res.render('alertDashboard', {title: 'Alert Dashboard', alerts});

  }  catch (err) {
    console.error('Database error: ', err);
    res.status(500).send('Server error');
  }  
}