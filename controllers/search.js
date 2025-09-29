import { searchEvents } from './event.js';
import { ITEMS } from '../data/items.js';

export async function show(req, res, next) {
  const { query = "", category = "", date = "", time = "", campus = "", type = "" } = req.query;

  // Search both events and items
  const eventResults = searchEvents({ query, category, date, time, campus, type });
  
  // Search items with similar logic
  const q = query.trim().toLowerCase();
  const itemResults = ITEMS.filter(item => {
    const matchesQ =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.summary || "").toLowerCase().includes(q);

    const matchesCategory = !category || item.category === category;
    const matchesType = !type || item.type === type;
    const matchesDate = !date || item.date === date;
    const matchesLocation =
      !campus || (item.location || "").toLowerCase().includes(campus.toLowerCase());

    return matchesQ && matchesCategory && matchesType && matchesDate && matchesLocation;
  });

  // Combine results
  const allResults = {
    events: eventResults,
    items: itemResults,
    hasResults: eventResults.length > 0 || itemResults.length > 0
  };

  res.render('search', { 
    title: 'Search Page',
    query, 
    category, 
    date, 
    time, 
    campus, 
    type, 
    results: allResults 
  });
}