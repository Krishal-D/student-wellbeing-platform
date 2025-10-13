import express from 'express';
import * as social from '../controllers/social.js';
import { requireAuth } from '../middleware/auth.js';


export const socialRouter = express.Router();

socialRouter.get('/social', requireAuth, social.show);
socialRouter.post('/social', requireAuth, social.submit);
