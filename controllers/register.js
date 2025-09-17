let users = []


export function showRegisterForm(req, res) {
  res.render('register', { title: 'Register' });
}


export function registerUser(req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).send('All fields are required')
  }

  const existingUser = users.find(u => u.email === email)
  if (existingUser) {
    return res.status(400).send('Email already registered')
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password 
  }

  users.push(newUser)

  console.log('Registered users:', users)

  res.redirect('/');
}