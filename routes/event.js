import express from 'express';
import * as eventController from '../controllers/event.js';

export const eventRouter = express.Router();

// Route for individual event pages
eventRouter.get('/events/:eventId', eventController.showEvent);

// Route for events listing page
eventRouter.get('/events', eventController.listEvents);


