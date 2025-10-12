import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import { searchEvents } from '../controllers/event.js';
import { show } from '../controllers/search.js';

describe('Search Feature Tests', () => {
  // Test the core search functionality
  describe('searchEvents function', () => {
    test('should return all events when no filters provided', async () => {
      const results = await searchEvents({});
      assert.ok(Array.isArray(results));
      assert.ok(results.length > 0);
    });

    test('should handle case-insensitive search', async () => {
      const lowerResults = await searchEvents({ query: 'yoga' });
      const upperResults = await searchEvents({ query: 'YOGA' });
      assert.deepStrictEqual(lowerResults, upperResults);
    });

    test('should return empty array when no matches found', async () => {
      const results = await searchEvents({ query: 'nonexistentEvent12345' });
      assert.strictEqual(results.length, 0);
    });

    test('should filter by location/campus', async () => {
      const results = await searchEvents({ campus: 'parramatta' });
      assert.ok(results.length > 0);
      assert.ok(results.every(event => 
        event.location.toLowerCase().includes('parramatta')
      ));
    });

    test('should filter by date', async () => {
      const results = await searchEvents({ date: '18-09-2025' });
      assert.ok(results.length > 0);
      assert.ok(results.every(event => event.date === '18-09-2025'));
    });

    test('should filter by event type', async () => {
      const results = await searchEvents({ type: 'workshop' });
      assert.ok(results.length > 0);
      assert.ok(results.every(event => event.type === 'workshop'));
    });
  });

  // Test the search controller
  describe('search controller', () => {
    test('should render search page with default parameters', async () => {
      const req = { query: {} };
      const res = { render: mock.fn() };
      
      await show(req, res);
      
      assert.strictEqual(res.render.mock.callCount(), 1);
      const renderCall = res.render.mock.calls[0];
      assert.strictEqual(renderCall.arguments[0], 'search');
      
      const data = renderCall.arguments[1];
      assert.strictEqual(data.title, 'Search Page');
      assert.strictEqual(data.query, '');
      assert.ok(data.results);
      assert.ok(Array.isArray(data.results.events));
    });

    test('should handle query parameters', async () => {
      const req = {
        query: {
          query: 'yoga',
          category: 'fitness'
        }
      };
      const res = { render: mock.fn() };
      
      await show(req, res);
      
      const renderCall = res.render.mock.calls[0];
      const data = renderCall.arguments[1];
      
      assert.strictEqual(data.query, 'yoga');
      assert.strictEqual(data.category, 'fitness');
    });

    test('should set hasResults correctly', async () => {
      // Test with results
      const reqWithResults = { query: { query: 'yoga' } };
      const resWithResults = { render: mock.fn() };
      
      await show(reqWithResults, resWithResults);
      
      const dataWithResults = resWithResults.render.mock.calls[0].arguments[1];
      if (dataWithResults.results.events.length > 0) {
        assert.strictEqual(dataWithResults.results.hasResults, true);
      }

      // Test without results
      const reqNoResults = { query: { query: 'nonexistentEvent12345' } };
      const resNoResults = { render: mock.fn() };
      
      await show(reqNoResults, resNoResults);
      
      const dataNoResults = resNoResults.render.mock.calls[0].arguments[1];
      assert.strictEqual(dataNoResults.results.events.length, 0);
      assert.strictEqual(dataNoResults.results.hasResults, false);
    });
  });

});