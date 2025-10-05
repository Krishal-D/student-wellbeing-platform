// Event controller
import { ALL_EVENTS } from '../data/items.js';

const BOOKED_BY_USER = new Map(); 
// auth user id for later.
const USER_ID = 'user-1';

function getUserTickets(userId = USER_ID) {
  if (!BOOKED_BY_USER.has(userId)) BOOKED_BY_USER.set(userId, new Set());
  return BOOKED_BY_USER.get(userId);
}

// remove ticket then redirect to /my-events
export function unbookEvent(req, res) {
  const { eventId } = req.params;
  const tickets = getUserTickets(); // DEMO_USER_ID for now
  tickets.delete(eventId); // idempotent: OK if it wasn't there
  return res.redirect('/my-events?removed=1');
}


// Get all events 
export function getAllEvents() {
  return ALL_EVENTS;
}

// Get event by ID 
export function getEventById(id) {
  return ALL_EVENTS.find(event => event.id === id);
}

// Search events (searches title, subtitle, description, type, location)
export function searchEvents(filters) {
  const { query = "", category = "", date = "", time = "", campus = "", type = "" } = filters;
  
  const q = query.trim().toLowerCase();
  
  return ALL_EVENTS.filter(event => {
    const matchesQuery = !q || 
      event.title.toLowerCase().includes(q) ||
      event.subtitle.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q) ||
      event.type.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q);
    
    const matchesCategory = !category || event.category === category;
    const matchesDate = !date || event.date === date;
    const matchesTime = !time || event.time === time;
    const matchesCampus = !campus || event.location.toLowerCase().includes(campus.toLowerCase());
    const matchesType = !type || event.type === type;
    
    return matchesQuery && matchesCategory && matchesDate && matchesTime && matchesCampus && matchesType;
  });
}

// Render individual event page 
export async function showEvent(req, res, next) {
  const { eventId } = req.params;
  const event = getEventById(eventId);
  
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
}

// Render events listing page
export async function listEvents(req, res, next) {
  const events = getAllEvents();
  res.render('events', { 
    title: 'All Events',
    events: events
  });
}


// GET /events/:eventId/book  → add to "tickets" and redirect to /my-events
export function bookEvent(req, res) {
  const { eventId } = req.params;
  const event = getEventById(eventId);
  if (!event) return res.redirect('/my-events'); // silent

  const tickets = getUserTickets();
  if (tickets.has(eventId)) {
    return res.redirect('/my-events?already=1');
  }
  tickets.add(eventId);
  return res.redirect('/my-events?joined=1');
}

// GET /my-events → list booked events
export function showMyEvents(req, res) {
  const tickets = Array.from(getUserTickets());
  const all = getAllEvents();
  const myEvents = all.filter(ev => tickets.includes(ev.id));

  res.render('my-events', {
    title: 'My Event Tickets',
    events: myEvents,
    
    
   already: req.query.already === '1'     
    
  });
}