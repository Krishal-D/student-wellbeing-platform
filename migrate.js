import { pool } from './config/db.js';

async function migrate() {
  try {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;

    const createMoodTable = `
      CREATE TABLE IF NOT EXISTS mood (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        mood_score INTEGER NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createUsersTable);
    await pool.query(createMoodTable);

    console.log(' Tables created successfully!');
  } catch (err) {
    console.error(' Error creating tables:', err);
  } finally {
    await pool.end();
  }
}

migrate();
