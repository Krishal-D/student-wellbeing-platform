export function requireAuth(req, res, next) {
  const userCookie = req.cookies.user;
  let user = null;
  
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (err) {
      // invalid cookie, clear it
      res.clearCookie('user');
    }
  }
  
  // prevent caching of protected pages
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');

  if (!user) {
    res.clearCookie('user');
    return res.redirect('/login');
  }

  req.user = user;
  next();
}

export function requireAdmin(req, res, next) {
  const userCookie = req.cookies.user;
  let user = null;
  
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (err) {
      // invalid cookie, clear it
      res.clearCookie('user');
    }
  }
  
  // prevent caching for admin pages as well
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');

  if (!user || user.userType !== 'admin') {
    res.clearCookie('user');
    return res.status(403).send('Access denied. Admin privileges required.');
  }

  req.user = user;
  next();
}

export function addUserToViews(req, res, next) {
  const userCookie = req.cookies.user;
  let user = null;
  
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (err) {
      // invalid cookie, ignore error
      user = null;
    }
  }
  
  res.locals.user = user;
  next();
}