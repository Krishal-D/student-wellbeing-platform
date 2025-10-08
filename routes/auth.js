import express from 'express';
import { loginView, loginPost, logout } from '../controllers/auth.js';

export const authRouter = express.Router();

authRouter.get('/login', loginView);
authRouter.post('/login', loginPost);
authRouter.post('/logout', logout);
authRouter.get('/logout', logout);