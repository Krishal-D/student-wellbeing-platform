// controllers/profile.js
export async function showProfile(req, res) {
  try {
    // Get user data from the cookie (set during login)
    const user = req.user;
    
    if (!user) {
      return res.redirect('/login');
    }
    
    res.render('profile', { 
      title: 'My Profile',
      user: user,
      studentName: user.userName,
      studentEmail: user.email
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).send('Server error');
  }
}