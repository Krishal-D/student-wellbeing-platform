// controllers/users.js
import { pool } from '../config/db.js';

export async function showUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users ORDER BY id ASC'
    );
    const adminEmail = process.env.ADMIN_EMAIL;
    const users = adminEmail
      ? result.rows.filter(u => u.email !== adminEmail)
      : result.rows;

    res.render('users', { title: 'All Users', users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Server error');
  }
}
