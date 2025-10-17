import express from 'express';
import * as alertDashboard from '../controllers/alertDashboard.js';
import { requireAdmin } from '../middleware/auth.js';

export const alertDashboardRouter = express.Router();

alertDashboardRouter.get('/alertDashboard', requireAdmin, alertDashboard.show);
alertDashboardRouter.post('/alertDashboard', requireAdmin, alertDashboard.submit);