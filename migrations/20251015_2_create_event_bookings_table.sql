-- Create event_bookings table to track user event registrations
CREATE TABLE IF NOT EXISTS event_bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, event_id) -- Prevent duplicate bookings
);
