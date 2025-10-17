import express from 'express';
import { showUsers, editUserForm, updateUser, deleteUser } from '../controllers/users.js';
import { requireAdmin } from '../middleware/auth.js';

export const usersRouter = express.Router();

usersRouter.get('/users', requireAdmin, showUsers);
usersRouter.get('/users/:id/edit', requireAdmin, editUserForm);
usersRouter.post('/users/:id/edit', requireAdmin, updateUser);
usersRouter.post('/users/:id/delete', requireAdmin, deleteUser);
