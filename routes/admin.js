import express from 'express';
import { requireAdmin } from '../middleware/auth.js';

export const adminRouter = express.Router();

adminRouter.get('/admin', requireAdmin, (req, res) => {
  res.render('admin', { title: 'Admin Dashboard' });
});