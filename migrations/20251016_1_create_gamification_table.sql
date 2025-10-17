CREATE TABLE IF NOT EXISTS gamification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    points INTEGER DEFAULT 0,
    badge_name VARCHAR(100),
    icon VARCHAR(100),
    date_earned TIMESTAMPTZ DEFAULT NOW()
);