import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}


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

    const hashedPassword = await bcrypt.hash(password, 10);

    const insert = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    )

  const newUser = insert.rows[0];
  console.log('New user registered:', { name, email });

    // auto-login with JWT
  const adminEmail = process.env.ADMIN_EMAIL;
  const userRole = (adminEmail && newUser.email === adminEmail) ? 'admin' : 'user';
    const token = jwt.sign(
      { userId: newUser.id, userName: newUser.name, email: newUser.email, userType: userRole },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // mark new registration for welcome messaging
    res.cookie('welcome', 'new', { httpOnly: false, sameSite: 'lax' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    // mark as a brand-new signup for home welcome message
    res.cookie('welcome', 'new', { maxAge: 5 * 60 * 1000, sameSite: 'lax' });
    res.redirect('/');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
}