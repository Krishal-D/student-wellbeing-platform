import { pool } from "../config/db.js";


export function showRegisterForm(req, res) {
  res.render('register', { title: 'Register' });
}


export async function registerUser(req, res) {
  const { name, email, password, confirmPassword } = req.body

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).send('All fields are required')
  }

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).send('Email already registered');
    }

    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, password] // i will use bycrypt later
    )

    console.log('✅ New user registered:', { name, email });
    res.redirect('/');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
}