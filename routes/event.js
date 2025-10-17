import express from 'express';
import * as eventController from '../controllers/event.js';
import { requireNonAdmin } from '../middleware/auth.js';

export const eventRouter = express.Router();

// Single route pattern - everything is an event now!
eventRouter.get('/events/:eventId', requireNonAdmin, eventController.showEvent);

// Route for events listing page
eventRouter.get('/events', requireNonAdmin, eventController.listEvents);

eventRouter.get('/events/:eventId/book', requireNonAdmin, eventController.bookEvent);
eventRouter.get('/events/:eventId/unbook', requireNonAdmin, eventController.unbookEvent);
eventRouter.get('/my-events', requireNonAdmin, eventController.showMyEvents);
