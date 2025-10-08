CREATE TABLE IF NOT EXISTS message (
    id SERIAL PRIMARY KEY,
    to_user_id INTEGER REFERENCES users(id),
    from_user_id INTEGER REFERENCES users(id),
    message_text VARCHAR(5000),
    created_at TIMESTAMPTZ DEFAULT NOW()
);