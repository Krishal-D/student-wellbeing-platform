import express from 'express';
import * as history from '../controllers/history.js';
export const historyRouter = express.Router();
historyRouter.get('/history', history.show);