import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export function loginView(req, res) {
  res.render('login', { error: null, title: 'Login' });
}

export async function loginPost(req, res) {
  const { email, password } = req.body;
  
  try {
  // password validation
    const result = await pool.query('SELECT id, name, email, password FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.render('login', { error: 'Invalid credentials', title: 'Login' });
    }
    
    // check password (supports hashed and legacy)
    let isValid = false;
    try {
      isValid = await bcrypt.compare(password, user.password);
    } catch {}
    if (!isValid && user.password === password) {
      isValid = true;
    }

    if (!isValid) {
      return res.render('login', { error: 'Invalid credentials', title: 'Login' });
    }
    
  const adminEmail = process.env.ADMIN_EMAIL;
  const userRole = (adminEmail && user && user.email === adminEmail) ? 'admin' : 'user';
    
    // set JWT cookie
    const token = jwt.sign(
      { userId: user.id, userName: user.name, email: user.email, userType: userRole },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
  // redirect to home
    return res.redirect('/');
    
  } catch (err) {
    console.error('Login error:', err);
    return res.render('login', { error: 'Server error', title: 'Login' });
  }
}

export function logout(req, res) {
  // clear cookies
  res.clearCookie('token');
  res.clearCookie('user'); // legacy cookie
  res.redirect('/login');
}