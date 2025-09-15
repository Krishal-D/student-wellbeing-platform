import express from 'express';
import * as alertDashboard from '../controllers/alertDashboard.js';

export const alertDashboardRouter = express.Router();

alertDashboardRouter.get('/alertDashboard', alertDashboard.show);