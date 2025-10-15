import { searchEvents } from './event.js';

export async function show(req, res, next) {
  try {
    const { query = "", category = "", date = "", time = "", campus = "", type = "" } = req.query;

    // Get all search results
    const allResults = await searchEvents({ query, category, date, time, campus, type });
    
    // Show everything as events in the same format
    const results = {
      events: allResults, // All results go into events
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
  } catch (error) {
    console.error('Error in search:', error);
    return res.status(500).render('error', {
      title: 'Server Error',
      message: 'An error occurred while searching events.'
    });
  }
}