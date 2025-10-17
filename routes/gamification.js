import express from 'express';
import * as gamification from '../controllers/gamification.js';
import { requireAuth } from '../middleware/auth.js';
export const gamificationRouter = express.Router();

// apply auth middleware before showing the gamification page
gamificationRouter.get('/gamification', requireAuth, gamification.show);