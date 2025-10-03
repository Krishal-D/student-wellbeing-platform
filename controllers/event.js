// Event controller
import { ALL_EVENTS } from '../data/items.js';

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