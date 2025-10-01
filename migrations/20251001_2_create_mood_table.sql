-- I copied this sql from krishal's original "migrate.js" file

CREATE TABLE IF NOT EXISTS mood (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    mood_score INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);