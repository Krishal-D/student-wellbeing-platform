// Event controller
import * as eventdata from '../data/eventdata.js';

// For now, we'll use a hardcoded user ID until authentication is fully integrated
const USER_ID = 1;

// remove ticket then redirect to /my-events
export async function unbookEvent(req, res) {
  try {
    const { eventId } = req.params;
    await eventdata.unbookEvent(USER_ID, eventId);
    return res.redirect('/my-events?removed=1');
  } catch (error) {
    console.error('Error unbooking event:', error);
    return res.redirect('/my-events?error=1');
  }
}


// Get all events 
export async function getAllEvents() {
  return await eventdata.getAllEvents();
}

// Get event by ID 
export async function getEventById(id) {
  return await eventdata.getEventById(id);
}

// Search events (searches title, subtitle, description, type, location)
export async function searchEvents(filters) {
  return await eventdata.searchEvents(filters);
}

// Render individual event page 
export async function showEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await getEventById(eventId);
    
    if (!event) {
      return res.status(404).render('error', { 
        title: 'Event Not Found',
        message: 'The requested event could not be found.' 
      });
    }
    
    res.render('event', { 
      title: event.title,
      event: event
    });
  } catch (error) {
    console.error('Error showing event:', error);
    return res.status(500).render('error', {
      title: 'Server Error',
      message: 'An error occurred while loading the event.'
    });
  }
}

// Render events listing page
export async function listEvents(req, res, next) {
  try {
    const events = await getAllEvents();
    res.render('events', { 
      title: 'All Events',
      events: events
    });
  } catch (error) {
    console.error('Error listing events:', error);
    return res.status(500).render('error', {
      title: 'Server Error',
      message: 'An error occurred while loading events.'
    });
  }
}


// GET /events/:eventId/book  → add to "tickets" and redirect to /my-events
export async function bookEvent(req, res) {
  try {
    const { eventId } = req.params;
    const event = await getEventById(eventId);
    if (!event) return res.redirect('/my-events'); // silent

    const isAlreadyBooked = await eventdata.isEventBooked(USER_ID, eventId);
    if (isAlreadyBooked) {
      return res.redirect('/my-events?already=1');
    }
    
    await eventdata.bookEvent(USER_ID, eventId);
    return res.redirect('/my-events?joined=1');
  } catch (error) {
    console.error('Error booking event:', error);
    return res.redirect('/my-events?error=1');
  }
}

// GET /my-events → list booked events
export async function showMyEvents(req, res) {
  try {
    const myEvents = await eventdata.getUserBookedEvents(USER_ID);

    res.render('my-events', {
      title: 'My Event Tickets',
      events: myEvents,
      already: req.query.already === '1',
      joined: req.query.joined === '1',
      removed: req.query.removed === '1',
      error: req.query.error === '1'
    });
  } catch (error) {
    console.error('Error showing my events:', error);
    return res.status(500).render('error', {
      title: 'Server Error',
      message: 'An error occurred while loading your events.'
    });
  }
}