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

    const insert = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password] // TODO: hash password with bcrypt
    )

  const newUser = insert.rows[0];
  console.log('✅ New user registered:', { name, email });

    // Auto-login: set auth cookie for the new user
    const userData = {
      userId: newUser.id,
      userName: newUser.name,
      userType: 'user',
      email: newUser.email
    };

    res.cookie('user', JSON.stringify(userData), {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true
    });

    res.redirect('/');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
}