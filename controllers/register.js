// controllers/register.js
/**
 * Render the registration form
 */
export function showRegisterForm(req, res) {
  res.render('register', { title: 'Register' });
}
