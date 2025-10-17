import express from 'express';
import * as social from '../controllers/social.js';
import { requireNonAdmin } from '../middleware/auth.js';


export const socialRouter = express.Router();

socialRouter.get('/social', requireNonAdmin, social.show);
socialRouter.post('/social', requireNonAdmin, social.submit);
