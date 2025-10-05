import express from 'express';
import * as social from '../controllers/social.js';

export const socialRouter = express.Router();

socialRouter.get('/social', social.show);