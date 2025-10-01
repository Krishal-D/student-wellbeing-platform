import { searchEvents } from './event.js';

export async function show(req, res, next) {
  const { query = "", category = "", date = "", time = "", campus = "", type = "" } = req.query;

  // Get all search results
  const allResults = searchEvents({ query, category, date, time, campus, type });
  
  // Show everything as resources in the same format
  const results = {
    items: allResults, // All results go into items (resources format)
    hasResults: allResults.length > 0
  };

  res.render('search', { 
    title: 'Search Page',
    query, 
    category, 
    date, 
    time, 
    campus, 
    type, 
    results: results 
  });
}