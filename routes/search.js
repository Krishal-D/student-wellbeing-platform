import express from 'express';
import * as search from '../controllers/search.js';

export const searchRouter = express.Router();

// Search route - handles both GET requests for search form and search results
searchRouter.get('/search', search.show);
