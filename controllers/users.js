import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export async function showUsers(req, res) {
  try {
    const result = await pool.query("SELECT id, name, email FROM users WHERE role <> 'admin' ORDER BY id ASC");
    const msg = req.query.msg || null;
    const err = req.query.err || null;
    return res.render('users', { title: 'All Users', users: result.rows, msg, err });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Server error');
  }
}

export async function editUserForm(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT id, name, email FROM users WHERE id = $1 AND role <> 'admin'", [id]);
    const user = rows[0];
    if (!user) return res.redirect('/users?err=User not found or not editable');
    return res.render('users_edit', { title: 'Edit User', user });
  } catch (e) {
    console.error('Error loading user:', e);
    return res.redirect('/users?err=Server error');
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, password, confirmPassword } = req.body;
  if (!name) return res.redirect('/users?err=Name is required');
  if (password && password !== confirmPassword) {
    return res.redirect(`/users/${id}/edit?err=Passwords do not match`);
  }
  try {
    const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
    if (rows.length === 0 || rows[0].role === 'admin') {
      return res.redirect('/users?err=Cannot edit this user');
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET name = $1, password = $2 WHERE id = $3', [name, hash, id]);
    } else {
      await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, id]);
    }
    return res.redirect('/users?msg=User updated');
  } catch (e) {
    console.error('Error updating user:', e);
    return res.redirect('/users?err=Server error');
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
    if (rows.length === 0) return res.redirect('/users?err=User not found');
    if (rows[0].role === 'admin') return res.redirect('/users?err=Cannot delete admin user');

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return res.redirect('/users?msg=User deleted');
  } catch (e) {
    if (e && e.code === '23503') {
      return res.redirect('/users?err=Cannot delete user with related data');
    }
    console.error('Error deleting user:', e);
    return res.redirect('/users?err=Server error');
  }
}
