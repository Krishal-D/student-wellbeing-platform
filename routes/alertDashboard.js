import express from 'express';
import * as search from '../controllers/alertDashboard.js';
export const alertDashboardRouter = express.Router();
alertDashboardRouter.get('/alertDashboard', search.show);