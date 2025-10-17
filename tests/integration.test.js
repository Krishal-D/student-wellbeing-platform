import { test, describe, mock } from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../config/db.js';

// Import key controllers
import { show as alertShow } from '../controllers/alertDashboard.js';
import { loginPost } from '../controllers/auth.js';
import { show as gamificationShow } from '../controllers/gamification.js';
import { show as historyShow } from '../controllers/history.js';
import { submit as moodSubmit } from '../controllers/mood.js';
import { registerUser } from '../controllers/register.js';
import { show as searchShow } from '../controllers/search.js';
import { show as socialShow } from '../controllers/social.js';

// Helper function
function makeRes() {
  return {
    render: mock.fn(),
    cookie: mock.fn(),
    redirect: mock.fn(),
    status: mock.fn(function() { return this; }),
    send: mock.fn(),
  };
}

// =============================================================================
// SIMPLIFIED INTEGRATION TESTS - CORE FEATURES ONLY
// =============================================================================

describe('Core Integration Tests', () => {

  // =============================================================================
  // AUTHENTICATION TEST
  // =============================================================================
  test('Login with valid credentials should redirect to home', async () => {
    const req = { body: { email: 'user@example.com', password: 'secret' } };
    const res = makeRes();

    const originalQuery = pool.query;
    pool.query = async () => ({ 
      rows: [{ id: 1, name: 'Test User', email: 'user@example.com', password: 'secret' }] 
    });

    await loginPost(req, res);

    assert.strictEqual(res.redirect.mock.callCount(), 1);
    assert.strictEqual(res.redirect.mock.calls[0].arguments[0], '/');
    
    pool.query = originalQuery;
  });

  // =============================================================================
  // USER REGISTRATION TEST
  // =============================================================================
  test('User registration with valid data should succeed', async () => {
    const req = { 
      body: { name: 'New User', email: 'new@test.com', password: 'pass123', confirmPassword: 'pass123' } 
    };
    const res = makeRes();

    const originalQuery = pool.query;
    let step = 0;
    pool.query = async (sql, params) => {
      step++;
      if (step === 1) return { rows: [] }; // Email check - not found
      return { rows: [{ id: 42, name: 'New User', email: 'new@test.com' }] }; // Insert success
    };

    await registerUser(req, res);

    assert.strictEqual(res.redirect.mock.callCount(), 1);
    assert.strictEqual(res.redirect.mock.calls[0].arguments[0], '/');
    
    pool.query = originalQuery;
  });

  // =============================================================================
  // MOOD TRACKING TEST
  // =============================================================================
  test('Valid mood submission should render feedback page', async () => {
    const req = { body: { mood_score: 4, notes: 'Feeling good today' }, user: { userId: 1 } };
    const res = makeRes();

    const originalQuery = pool.query;
    pool.query = mock.fn(async (sql, params) => {
      if (sql.startsWith('INSERT INTO mood')) {
        return { rowCount: 1 };
      }
      if (sql.startsWith('SELECT')) {
        return { rows: [] }; // No previous moods for alert check
      }
      return { rows: [] };
    });

    await moodSubmit(req, res);

    assert.strictEqual(res.render.mock.callCount(), 1);
    assert.strictEqual(res.render.mock.calls[0].arguments[0], 'moodFeedback');
    
    pool.query = originalQuery;
  });

  // =============================================================================
  // MOOD HISTORY TEST
  // =============================================================================
  test('Mood history page should display user moods', async () => {
    const req = { user: { userId: 1 } };
    const res = makeRes();

    const originalQuery = pool.query;
    pool.query = mock.fn(async (sql, params) => {
      return { 
        rows: [ 
          { id: 1, mood_score: 4, notes: 'Good day', created_at: new Date() },
          { id: 2, mood_score: 3, notes: 'Okay day', created_at: new Date() }
        ]
      };
    });

    await historyShow(req, res);

    assert.strictEqual(res.render.mock.callCount(), 1);
    assert.strictEqual(res.render.mock.calls[0].arguments[0], 'history');
    
    const data = res.render.mock.calls[0].arguments[1];
    assert.strictEqual(data.title, 'Mood History Page');
    assert.ok(Array.isArray(data.moods));
    assert.strictEqual(data.moods.length, 2);
    
    pool.query = originalQuery;
  });

  // =============================================================================
  // ALERT DASHBOARD TEST
  // =============================================================================
  test('Alert dashboard should display user alerts', async () => {
    const req = { user: { userId: 1 } };
    const res = makeRes();

    const originalQuery = pool.query;
    pool.query = mock.fn(async (sql, params) => {
      return { 
        rows: [
          { id: 1, user_id: 1, handled: false, created_at: new Date() }
        ]
      };
    });

    await alertShow(req, res);

    assert.strictEqual(res.render.mock.callCount(), 1);
    const data = res.render.mock.calls[0].arguments[1];
    assert.strictEqual(data.title, 'Alert Dashboard');
    assert.ok(Array.isArray(data.alerts));
    assert.strictEqual(data.alerts.length, 1);
    
    pool.query = originalQuery;
  });

  // =============================================================================
  // SEARCH FUNCTIONALITY TEST
  // =============================================================================
  test('Search page should render with results', async () => {
    const req = { query: { query: 'yoga' } };
    const res = makeRes();

    const originalQuery = pool.query;
    pool.query = mock.fn(async (sql, params) => {
      return {
        rows: [
          { id: 'yoga-class', title: 'Morning Yoga', category: 'fitness' }
        ]
      };
    });

    await searchShow(req, res);

    assert.strictEqual(res.render.mock.callCount(), 1);
    assert.strictEqual(res.render.mock.calls[0].arguments[0], 'search');
    
    const data = res.render.mock.calls[0].arguments[1];
    assert.strictEqual(data.title, 'Search Page');
    assert.strictEqual(data.query, 'yoga');
    assert.ok(data.results.events.length > 0);
    
    pool.query = originalQuery;
  });

  // =============================================================================
  // SOCIAL NETWORKING TEST
  // =============================================================================
  test('Social page should display inbox messages', async () => {
    const req = { user: { userId: 1 } };
    const res = makeRes();

    const originalQuery = pool.query;
    pool.query = mock.fn(async (sql, params) => {
      if (sql.startsWith('SELECT users.name, message.message_text')) {
        return { 
          rows: [
            { name: "Friend", message_text: "Hello there!", created_at: new Date() }
          ]
        };
      }
      return { rows: [] };
    });

    await socialShow(req, res);

    assert.strictEqual(res.render.mock.callCount(), 1);
    const data = res.render.mock.calls[0].arguments[1];
    assert.strictEqual(data.title, 'Social Networking');
    assert.ok(Array.isArray(data.inboxMessages));
    assert.strictEqual(data.inboxMessages.length, 1);
    assert.strictEqual(data.inboxMessages[0].name, 'Friend');
    
    pool.query = originalQuery;
  });

  // =============================================================================
  // GAMIFICATION TESTS
  // =============================================================================
  test('Gamification page should display user points and badge correctly', async () => {
    const req = { user: { userId: 1 } };
    const res = makeRes();

    const originalQuery = pool.query;
    pool.query = async (sql, params) => {
      if (sql.includes('SELECT COALESCE(SUM(points), 0) AS sum_points')) {
        // Return total points for Bronze badge (150 points)
        return { rows: [{ sum_points: 150 }] };
      }
      if (sql.includes('SELECT id, points, badge_name, icon, date_earned')) {
        // Return gamification history
        return { 
          rows: [
            { id: 1, points: 50, badge_name: 'Bronze Achiever', icon: '🥉', date_earned: new Date('2024-01-01') },
            { id: 2, points: 100, badge_name: 'Bronze Achiever', icon: '🥉', date_earned: new Date('2024-01-02') }
          ]
        };
      }
      return { rows: [] };
    };

    await gamificationShow(req, res);

    assert.strictEqual(res.render.mock.callCount(), 1);
    assert.strictEqual(res.render.mock.calls[0].arguments[0], 'gamification');
    
    const data = res.render.mock.calls[0].arguments[1];
    assert.strictEqual(data.title, 'Gamification Page');
    assert.strictEqual(data.totalPoints, 150);
    assert.strictEqual(data.badge_name, 'Bronze Achiever');
    assert.strictEqual(data.icon, '🥉');
    assert.ok(Array.isArray(data.progress));
    assert.strictEqual(data.progress.length, 2);
    
    pool.query = originalQuery;
  });


  test('Gamification badge logic should handle different point thresholds', async () => {
      const req = { user: { userId: 2 } };
      const res = makeRes();

      const originalQuery = pool.query;
      pool.query = async (sql, params) => {
        if (sql.includes('SELECT COALESCE(SUM(points), 0) AS sum_points')) {
          // Return points for Gold badge (350 points)
          return { rows: [{ sum_points: 350 }] };
        }
        if (sql.includes('SELECT id, points, badge_name, icon, date_earned')) {
          return { 
            rows: [
              { id: 1, points: 350, badge_name: 'Gold Achiever', icon: '🥇', date_earned: new Date('2024-01-01') }
            ]
          };
        }
        return { rows: [] };
      };

      await gamificationShow(req, res);

      assert.strictEqual(res.render.mock.callCount(), 1);
      const data = res.render.mock.calls[0].arguments[1];
      assert.strictEqual(data.totalPoints, 350);
      assert.strictEqual(data.badge_name, 'Gold Achiever');
      assert.strictEqual(data.icon, '🥇');
      
      pool.query = originalQuery;
    });


  // =============================================================================
  // ERROR HANDLING TEST
  // =============================================================================
  test('Database errors should be handled gracefully', async () => {
    const req = { user: { userId: 1 } };
    const res = makeRes();

    const originalQuery = pool.query;
    pool.query = mock.fn(async () => { 
      throw new Error('Database Connection Failed'); 
    });

    await historyShow(req, res);

    assert.strictEqual(res.status.mock.callCount(), 1);
    assert.strictEqual(res.status.mock.calls[0].arguments[0], 500);
    assert.strictEqual(res.send.mock.calls[0].arguments[0], 'Server error');
    
    pool.query = originalQuery;
  });
});