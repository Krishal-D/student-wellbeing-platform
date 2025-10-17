import express from 'express';
import * as mood from '../controllers/mood.js';
import { requireNonAdmin } from '../middleware/auth.js';
export const moodRouter = express.Router();
// apply auth middleware before showing the mood page and submitting moods
moodRouter.get('/mood', requireNonAdmin, mood.show);
moodRouter.post('/mood', requireNonAdmin, mood.submit);