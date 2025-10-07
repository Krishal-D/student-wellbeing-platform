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
  
  if (!user) {
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
  
  if (!user || user.userType !== 'admin') {
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