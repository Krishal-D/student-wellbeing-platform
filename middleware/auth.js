import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

function normalize(userLike) {
  if (!userLike) return null;
  // support either JWT payload fields or legacy cookie fields
  const userId = userLike.userId ?? userLike.id;
  const userName = userLike.userName ?? userLike.name;
  const userType = userLike.userType ?? userLike.role ?? 'user';
  const email = userLike.email;
  if (!userId || !userName) return null;
  return { userId, userName, userType, email };
}

function getUserFromCookies(req, res) {
  // Prefer JWT 'token' cookie
  const token = req.cookies.token;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      return normalize(payload);
    } catch (e) {
      // bad token, clear it
      res.clearCookie('token');
    }
  }
  // Fallback: legacy 'user' cookie
  const userCookie = req.cookies.user;
  if (userCookie) {
    try {
      const parsed = JSON.parse(userCookie);
      return normalize(parsed);
    } catch (e) {
      res.clearCookie('user');
    }
  }
  return null;
}

export function requireAuth(req, res, next) {
  const user = getUserFromCookies(req, res);

  // prevent caching of protected pages
  res.set('Cache-Control', 'no-store');

  if (!user) {
    res.clearCookie('user');
    return res.redirect('/login');
  }
  req.user = user;
  next();
}

export function requireAdmin(req, res, next) {
  const user = getUserFromCookies(req, res);

  // prevent caching for admin pages as well
  res.set('Cache-Control', 'no-store');

  if (!user || user.userType !== 'admin') {
    res.clearCookie('user');
    return res.status(403).send('Access denied. Admin privileges required.');
  }
  req.user = user;
  next();
}

export function addUserToViews(req, res, next) {
  const user = getUserFromCookies(req, res);
  res.locals.user = user;
  next();
}