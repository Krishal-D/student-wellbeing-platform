

import { EVENTS } from '../data/items.js';


export function getAllEvents() {
  return EVENTS;
}


export function getEventById(id) {
  return EVENTS.find(event => event.id === id);
}



export function searchEvents(filters) {
  const { query = "", category = "", date = "", time = "", campus = "", type = "" } = filters;
  
  const q = query.trim().toLowerCase();
  
  return EVENTS.filter(event => {
    const matchesQuery = !q || 
      event.title.toLowerCase().includes(q) ||
      event.subtitle.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q);
    
    const matchesCategory = !category || event.category === category;
    const matchesDate = !date || event.date === date;
    const matchesTime = !time || event.time === time;
    const matchesCampus = !campus || event.campus === campus;
    const matchesType = !type || event.type === type;
    
    return matchesQuery && matchesCategory && matchesDate && matchesTime && matchesCampus && matchesType;
  });
}


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


export async function listEvents(req, res, next) {
  const events = getAllEvents();
  res.render('events', { 
    title: 'All Events',
    events: events
  });
}

