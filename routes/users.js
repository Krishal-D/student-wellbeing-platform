// routes/users.js
import express from 'express';
import { showUsers } from '../controllers/users.js';

export const usersRouter = express.Router();

// GET /users → show all users
usersRouter.get('/users', showUsers);
