// Database queries for events
import { pool } from '../config/db.js';

// Get all events
export async function getAllEvents() {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date, time');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
}

// Get event by ID
export async function getEventById(id) {
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
}

// Search events with filters
export async function searchEvents(filters) {
  try {
    const { query = "", category = "", date = "", time = "", campus = "", type = "" } = filters;
    
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (query.trim()) {
      paramCount++;
      sql += ` AND (LOWER(title) LIKE LOWER($${paramCount}) OR LOWER(subtitle) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}) OR LOWER(type) LIKE LOWER($${paramCount}) OR LOWER(location) LIKE LOWER($${paramCount}))`;
      params.push(`%${query.trim()}%`);
    }

    if (category) {
      paramCount++;
      sql += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (date) {
      paramCount++;
      sql += ` AND date = $${paramCount}`;
      params.push(date);
    }

    if (time) {
      paramCount++;
      sql += ` AND time = $${paramCount}`;
      params.push(time);
    }

    if (campus) {
      paramCount++;
      sql += ` AND LOWER(location) LIKE LOWER($${paramCount})`;
      params.push(`%${campus}%`);
    }

    if (type) {
      paramCount++;
      sql += ` AND type = $${paramCount}`;
      params.push(type);
    }

    sql += ' ORDER BY date, time';

    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
}

// Get user's booked events
export async function getUserBookedEvents(userId) {
  try {
    const result = await pool.query(`
      SELECT e.*, eb.booked_at 
      FROM events e 
      INNER JOIN event_bookings eb ON e.id = eb.event_id 
      WHERE eb.user_id = $1 
      ORDER BY e.date, e.time
    `, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching user booked events:', error);
    throw error;
  }
}

// Book an event for a user
export async function bookEvent(userId, eventId) {
  try {
    const result = await pool.query(`
      INSERT INTO event_bookings (user_id, event_id) 
      VALUES ($1, $2) 
      ON CONFLICT (user_id, event_id) DO NOTHING
      RETURNING *
    `, [userId, eventId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error booking event:', error);
    throw error;
  }
}

// Unbook an event for a user
export async function unbookEvent(userId, eventId) {
  try {
    const result = await pool.query(`
      DELETE FROM event_bookings 
      WHERE user_id = $1 AND event_id = $2
      RETURNING *
    `, [userId, eventId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error unbooking event:', error);
    throw error;
  }
}

// Check if user has booked an event
export async function isEventBooked(userId, eventId) {
  try {
    const result = await pool.query(`
      SELECT 1 FROM event_bookings 
      WHERE user_id = $1 AND event_id = $2
    `, [userId, eventId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking if event is booked:', error);
    throw error;
  }
}
