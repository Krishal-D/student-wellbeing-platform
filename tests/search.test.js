import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import { searchEvents } from '../controllers/event.js';
import { show } from '../controllers/search.js';

describe('Search Feature Tests', () => {
  // Test the core search functionality
  describe('searchEvents function', () => {
    test('should return all events when no filters provided', () => {
      const results = searchEvents({});
      assert.ok(Array.isArray(results));
      assert.ok(results.length > 0);
    });

    test('should filter events by query string', () => {
      const results = searchEvents({ query: 'yoga' });
      assert.ok(results.length > 0);
      assert.ok(results.some(event => 
        event.title.toLowerCase().includes('yoga') ||
        event.description.toLowerCase().includes('yoga')
      ));
    });

    test('should filter events by category', () => {
      const results = searchEvents({ category: 'fitness' });
      assert.ok(results.length > 0);
      assert.ok(results.every(event => event.category === 'fitness'));
    });

    test('should handle case-insensitive search', () => {
      const lowerResults = searchEvents({ query: 'yoga' });
      const upperResults = searchEvents({ query: 'YOGA' });
      assert.deepStrictEqual(lowerResults, upperResults);
    });

    test('should return empty array when no matches found', () => {
      const results = searchEvents({ query: 'nonexistentEvent12345' });
      assert.strictEqual(results.length, 0);
    });

    test('should combine multiple filters', () => {
      const results = searchEvents({ 
        category: 'fitness',
        query: 'yoga'
      });
      
      results.forEach(event => {
        assert.strictEqual(event.category, 'fitness');
        assert.ok(
          event.title.toLowerCase().includes('yoga') ||
          event.description.toLowerCase().includes('yoga') ||
          event.subtitle.toLowerCase().includes('yoga')
        );
      });
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

  // Basic data validation tests
  describe('data validation', () => {
    test('should have valid event data structure', () => {
      const results = searchEvents({});
      const event = results[0];
      
      assert.ok(event.id);
      assert.ok(event.title);
      assert.ok(event.category);
      assert.ok(event.date);
      assert.ok(event.time);
      assert.ok(event.location);
      assert.ok(event.type);
      assert.ok(event.description);
    });

    test('should have unique event IDs', () => {
      const results = searchEvents({});
      const ids = results.map(event => event.id);
      const uniqueIds = new Set(ids);
      assert.strictEqual(ids.length, uniqueIds.size);
    });
  });
});