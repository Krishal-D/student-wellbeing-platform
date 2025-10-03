import express from 'express';
import * as eventController from '../controllers/event.js';

export const eventRouter = express.Router();

// Single route pattern - everything is an event now!
eventRouter.get('/events/:eventId', eventController.showEvent);

// Route for events listing page
eventRouter.get('/events', eventController.listEvents);

eventRouter.get('/events/:eventId/book', eventController.bookEvent);
eventRouter.get('/events/:eventId/unbook', eventController.unbookEvent);
eventRouter.get('/my-events', eventController.showMyEvents);
