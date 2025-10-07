import { pool } from '../config/db.js';

export function loginView(req, res) {
  res.render('login', { error: null, title: 'Login' });
}

export async function loginPost(req, res) {
  const { email, password } = req.body;
  
  try {
  // password validation
  // select only existing columns to avoid SQL errors on schemas without role/user_type
  const result = await pool.query('SELECT id, name, email, password FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || user.password !== password) {
      return res.render('login', { error: 'Invalid credentials', title: 'Login' });
    }
    
    // determine role: prefer DB columns if present (not selected here), otherwise fall back to ADMIN_EMAIL env
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const userRole = (user && user.email === adminEmail) ? 'admin' : 'user';
    
    const userData = {
      userId: user.id,
      userName: user.name,
      userType: userRole,
      email: user.email
    };
    
    // set cookie
    res.cookie('user', JSON.stringify(userData), { 
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true
    });
    
    // redirect to home
    return res.redirect('/');
    
  } catch (err) {
    console.error('Login error:', err);
    return res.render('login', { error: 'Server error', title: 'Login' });
  }
}

export function logout(req, res) {
  // clear cookie
  res.clearCookie('user');
  res.redirect('/login');
}