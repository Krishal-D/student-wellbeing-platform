// routes/register.js
import express from 'express';
import { showRegisterForm,registerUser } from '../controllers/register.js';

export const registerRouter = express.Router();

// GET /register
registerRouter.get('/register', showRegisterForm);

//POST /register
registerRouter.post('/register', registerUser);
