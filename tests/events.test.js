import { test, describe } from 'node:test';
import assert from 'node:assert';
import * as eventdata from '../data/eventdata.js';

describe('Events Database Functionality Tests', () => {
  
  describe('Basic Event Operations', () => {
    test('should retrieve all events from database', async () => {
      const allEvents = await eventdata.getAllEvents();
      assert.ok(Array.isArray(allEvents));
      assert.ok(allEvents.length > 0);
      assert.strictEqual(allEvents.length, 9); // We know we have 9 events
    });

    test('should retrieve specific event by ID', async () => {
      const event = await eventdata.getEventById('morning-yoga');
      assert.ok(event);
      assert.strictEqual(event.id, 'morning-yoga');
      assert.strictEqual(event.title, 'Morning Yoga');
      assert.strictEqual(event.category, 'fitness');
    });

    test('should return null for non-existent event', async () => {
      const event = await eventdata.getEventById('non-existent-event');
      assert.strictEqual(event, null);
    });
  });

  describe('Search Functionality', () => {
    test('should filter events by fitness category', async () => {
      const fitnessEvents = await eventdata.searchEvents({ category: 'fitness' });
      assert.ok(fitnessEvents.length > 0);
      assert.ok(fitnessEvents.every(event => event.category === 'fitness'));
    });

    test('should filter events by counselling category', async () => {
      const counsellingEvents = await eventdata.searchEvents({ category: 'counselling' });
      assert.ok(counsellingEvents.length > 0);
      assert.ok(counsellingEvents.every(event => event.category === 'counselling'));
    });

    test('should filter events by social network category', async () => {
      const socialEvents = await eventdata.searchEvents({ category: 'socialnetwork' });
      assert.ok(socialEvents.length > 0);
      assert.ok(socialEvents.every(event => event.category === 'socialnetwork'));
    });

    test('should search events by text query', async () => {
      const yogaEvents = await eventdata.searchEvents({ query: 'yoga' });
      assert.ok(yogaEvents.length > 0);
      assert.ok(yogaEvents.some(event => 
        event.title.toLowerCase().includes('yoga') ||
        event.description.toLowerCase().includes('yoga')
      ));
    });

    test('should combine multiple filters', async () => {
      const combinedSearch = await eventdata.searchEvents({ 
        category: 'fitness', 
        query: 'yoga'
      });
      
      assert.ok(combinedSearch.length > 0);
      combinedSearch.forEach(event => {
        assert.strictEqual(event.category, 'fitness');
        assert.ok(
          event.title.toLowerCase().includes('yoga') ||
          event.description.toLowerCase().includes('yoga') ||
          event.subtitle.toLowerCase().includes('yoga')
        );
      });
    });
  });

  describe('Event Booking System', () => {
    const testUserId = 1;
    const testEventId = 'morning-yoga';

    test('should book an event for a user', async () => {
      // First unbook if already booked
      await eventdata.unbookEvent(testUserId, testEventId);
      
      const booking = await eventdata.bookEvent(testUserId, testEventId);
      assert.ok(booking);
      assert.strictEqual(booking.user_id, testUserId);
      assert.strictEqual(booking.event_id, testEventId);
    });

    test('should check if event is booked', async () => {
      const isBooked = await eventdata.isEventBooked(testUserId, testEventId);
      assert.strictEqual(isBooked, true);
    });

    test('should retrieve user booked events', async () => {
      const userEvents = await eventdata.getUserBookedEvents(testUserId);
      assert.ok(Array.isArray(userEvents));
      assert.ok(userEvents.length > 0);
      assert.ok(userEvents.some(event => event.id === testEventId));
    });

    test('should unbook an event', async () => {
      const unbooking = await eventdata.unbookEvent(testUserId, testEventId);
      assert.ok(unbooking);
      assert.strictEqual(unbooking.user_id, testUserId);
      assert.strictEqual(unbooking.event_id, testEventId);
    });

    test('should handle duplicate booking attempts', async () => {
      // Book the event
      const firstBooking = await eventdata.bookEvent(testUserId, testEventId);
      assert.ok(firstBooking); // Should return the booking
      
      // Try to book again - should not create duplicate (returns undefined)
      const duplicateBooking = await eventdata.bookEvent(testUserId, testEventId);
      assert.strictEqual(duplicateBooking, undefined); // Should return undefined for duplicate
      
      // Verify only one booking exists
      const isBooked = await eventdata.isEventBooked(testUserId, testEventId);
      assert.strictEqual(isBooked, true);
      
      // Clean up
      await eventdata.unbookEvent(testUserId, testEventId);
    });
  });

  describe('Data Validation', () => {
    test('should have valid event data structure', async () => {
      const events = await eventdata.getAllEvents();
      const event = events[0];
      
      assert.ok(event.id);
      assert.ok(event.title);
      assert.ok(event.category);
      assert.ok(event.date);
      assert.ok(event.time);
      assert.ok(event.location);
      assert.ok(event.type);
      assert.ok(event.description);
      assert.ok(Array.isArray(event.details));
    });

    test('should have unique event IDs', async () => {
      const events = await eventdata.getAllEvents();
      const ids = events.map(event => event.id);
      const uniqueIds = new Set(ids);
      assert.strictEqual(ids.length, uniqueIds.size);
    });
  });
});
