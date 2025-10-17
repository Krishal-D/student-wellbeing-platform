import express from 'express';
import * as history from '../controllers/history.js';
import { requireNonAdmin } from '../middleware/auth.js';
export const historyRouter = express.Router();
// apply auth middleware before showing the histrory page
historyRouter.get('/history', requireNonAdmin, history.show);