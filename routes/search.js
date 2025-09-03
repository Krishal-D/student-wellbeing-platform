import express from 'express';
import * as search from '../controllers/search.js';
export const searchRouter = express.Router();
searchRouter.get('/search', search.show);