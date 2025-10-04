CREATE TABLE IF NOT EXISTS alert (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    handled BOOLEAN DEFAULT FALSE,   -- handled indicates wether staff has sent a message to the student
    created_at TIMESTAMP DEFAULT NOW()
);