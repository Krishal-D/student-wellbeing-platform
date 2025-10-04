CREATE TABLE IF NOT EXISTS alert (
    alert_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);