import express from 'express';
import * as mood from '../controllers/mood.js';
export const moodRouter = express.Router();
moodRouter.get('/mood', mood.show);
moodRouter.post('/mood', mood.submit);