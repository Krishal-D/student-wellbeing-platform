// routes/profile.js
import express from 'express';
import { showProfile } from '../controllers/profile.js';

export const profileRouter = express.Router();

// GET /profile → show user profile
profileRouter.get('/profile', showProfile);