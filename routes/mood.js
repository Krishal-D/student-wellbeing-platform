import express from 'express';
import * as mood from '../controllers/mood.js';
import { requireAuth } from '../middleware/auth.js';
export const moodRouter = express.Router();

// apply auth middleware before showing the mood page and submitting moods
moodRouter.get('/mood', requireAuth, mood.show);
moodRouter.post('/mood', requireAuth, mood.submit);