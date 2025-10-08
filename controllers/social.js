import {pool} from '../config/db.js';

export async function show(req, res, next) {
  res.render('social', { title: 'Social Networking' });
}

export async function submit(req, res, next) {
  try {
    const user_id = req.user.userId;

    const {to_user, message_text} = req.body;

    // Check message is not to long
    if (message_text.length > 5000) {
      return res.status(400).send('Message is too long');
    }

  } catch (err) {
      console.error('Database error: ', err);
      res.status(500).send('Server error');
  } 
}

