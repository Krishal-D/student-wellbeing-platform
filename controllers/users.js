// controllers/users.js
import { pool } from '../config/db.js';

export async function showUsers(req, res) {
  try {
    const result = await pool.query("SELECT id, name, email FROM users WHERE role <> 'admin' ORDER BY id ASC");
    return res.render('users', { title: 'All Users', users: result.rows });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Server error');
  }
}
