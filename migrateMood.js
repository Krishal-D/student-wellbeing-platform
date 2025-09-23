import { pool } from './config/db.js';

async function migrateMood() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS mood_tracking (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        mood_score INT NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await pool.query(createTableQuery);
    console.log('Mood tracking table created successfully!');
  } catch (err) {
    console.error('Error creating mood tracking table:', err);
  } finally {
    await pool.end();
  }
}

migrateMood();
