import { pool } from './db.js';
import bcrypt from 'bcrypt';

export async function ensureAdminFromEnv() {
  const email = process.env.ADMIN_EMAIL;
  const name = process.env.ADMIN_NAME || 'Admin User';
  const hashFromEnv = process.env.ADMIN_PASSWORD_HASH || null;
  const plaintext = process.env.ADMIN_PASSWORD || null;

  if (!email) return; // nothing to ensure

  let passwordHash = hashFromEnv;
  try {
    if (!passwordHash && plaintext) {
      passwordHash = await bcrypt.hash(plaintext, 10);
    }
  } catch {}

  if (!passwordHash) return; // cannot proceed without a password hash

  try {
    const existing = await pool.query('SELECT id, password FROM users WHERE email = $1', [email]);
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        [name, email, passwordHash]
      );
      return;
    }
    const current = existing.rows[0];
    if (current.password !== passwordHash) {
      await pool.query('UPDATE users SET password = $1 WHERE email = $2', [passwordHash, email]);
    }
  } catch (e) {
    console.error('ensureAdminFromEnv error:', e);
  }
}
