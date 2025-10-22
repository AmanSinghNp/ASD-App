/**
 * Delivery Controller Unit Tests
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F008 - Delivery
 * Description: Comprehensive tests for delivery functionality including address validation and slot management
 * Last Updated: 2025-10-22
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { validateAddress, getDeliverySlots } from '../../controllers/deliveryController';

// Mock Prisma client
const mockPrisma = {
  order: {
    count: jest.fn(),
  },
};

jest.mock('../../utils/database', () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe('Delivery Controller - F008 Delivery', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      json: mockJson,
      status: mockStatus,
    };
    jest.clearAllMocks();
  });

  describe('validateAddress', () => {
    it('should accept valid Australian address', async () => {
      const validAddress = {
        addressLine1: '123 George Street',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '2000'
      };

      mockReq = { body: validAddress };

      await validateAddress(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({ valid: true });
    });

    it('should reject invalid postcode format', async () => {
      const invalidAddress = {
        addressLine1: '123 George Street',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: 'ABC1' // Invalid - not 4 digits
      };

      mockReq = { body: invalidAddress };

      await validateAddress(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({ 
        valid: false, 
        error: 'Postcode must be 4 digits' 
      });
    });

    it('should reject postcode that is too short', async () => {
      const invalidAddress = {
        addressLine1: '123 George Street',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '200' // Too short
      };

      mockReq = { body: invalidAddress };

      await validateAddress(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({ 
        valid: false, 
        error: 'Postcode must be 4 digits' 
      });
    });

    it('should reject postcode that is too long', async () => {
      const invalidAddress = {
        addressLine1: '123 George Street',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '20000' // Too long
      };

      mockReq = { body: invalidAddress };

      await validateAddress(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({ 
        valid: false, 
        error: 'Postcode must be 4 digits' 
      });
    });

    it('should reject invalid Australian state', async () => {
      const invalidAddress = {
        addressLine1: '123 Main St',
        suburb: 'Sydney',
        state: 'XX', // Invalid state
        postcode: '2000'
      };

      mockReq = { body: invalidAddress };

      await validateAddress(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({ 
        valid: false, 
        error: 'Invalid state' 
      });
    });

    it('should accept all valid Australian states', async () => {
      const validStates = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];
      
      for (const state of validStates) {
        const address = {
          addressLine1: '123 Main St',
          suburb: 'Test City',
          state: state,
          postcode: '2000'
        };

        mockReq = { body: address };
        jest.clearAllMocks();

        await validateAddress(mockReq as Request, mockRes as Response);

        expect(mockJson).toHaveBeenCalledWith({ valid: true });
      }
    });

    it('should reject empty required fields', async () => {
      const incompleteAddress = {
        addressLine1: '',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '2000'
      };

      mockReq = { body: incompleteAddress };

      await validateAddress(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({ 
        valid: false, 
        error: 'Address line 1 and suburb required' 
      });
    });

    it('should reject missing suburb', async () => {
      const incompleteAddress = {
        addressLine1: '123 Main St',
        suburb: '',
        state: 'NSW',
        postcode: '2000'
      };

      mockReq = { body: incompleteAddress };

      await validateAddress(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({ 
        valid: false, 
        error: 'Address line 1 and suburb required' 
      });
    });

    it('should handle database errors gracefully', async () => {
      const validAddress = {
        addressLine1: '123 George Street',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '2000'
      };

      mockReq = { body: validAddress };
      mockPrisma.order.count.mockRejectedValue(new Error('Database error'));

      await validateAddress(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to validate address' });
    });
  });

  describe('getDeliverySlots', () => {
    it('should return only available time slots', async () => {
      const targetDate = '2025-10-25';
      mockReq = { query: { date: targetDate } };
      
      // Mock that some slots are partially booked
      mockPrisma.order.count
        .mockResolvedValueOnce(3) // 10am slot: 3 booked
        .mockResolvedValueOnce(7) // 11am slot: 7 booked
        .mockResolvedValueOnce(10) // 12pm slot: fully booked
        .mockResolvedValueOnce(2) // 1pm slot: 2 booked
        .mockResolvedValueOnce(5) // 2pm slot: 5 booked
        .mockResolvedValueOnce(8) // 3pm slot: 8 booked
        .mockResolvedValueOnce(1) // 4pm slot: 1 booked
        .mockResolvedValueOnce(0); // 5pm slot: empty

      await getDeliverySlots(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            slotStart: expect.any(String),
            slotEnd: expect.any(String),
            remaining: 7 // 10 - 3
          }),
          expect.objectContaining({
            remaining: 3 // 10 - 7
          }),
          expect.objectContaining({
            remaining: 8 // 10 - 2
          }),
          expect.objectContaining({
            remaining: 5 // 10 - 5
          }),
          expect.objectContaining({
            remaining: 2 // 10 - 8
          }),
          expect.objectContaining({
            remaining: 9 // 10 - 1
          }),
          expect.objectContaining({
            remaining: 10 // 10 - 0
          })
        ])
      });

      // Should not include fully booked slots (12pm slot with 10 booked)
      const responseData = mockJson.mock.calls[0][0].data;
      const fullyBookedSlots = responseData.filter((slot: any) => slot.remaining === 0);
      expect(fullyBookedSlots).toHaveLength(0);
    });

    it('should generate 8 hourly slots from 10am to 6pm', async () => {
      const targetDate = '2025-10-25';
      mockReq = { query: { date: targetDate } };
      
      // Mock all slots as available
      mockPrisma.order.count.mockResolvedValue(0);

      await getDeliverySlots(mockReq as Request, mockRes as Response);

      const responseData = mockJson.mock.calls[0][0].data;
      expect(responseData).toHaveLength(8); // 10am, 11am, 12pm, 1pm, 2pm, 3pm, 4pm, 5pm

      // Check time slots are correct
      const expectedHours = [10, 11, 12, 13, 14, 15, 16, 17];
      responseData.forEach((slot: any, index: number) => {
        const slotStart = new Date(slot.slotStart);
        expect(slotStart.getHours()).toBe(expectedHours[index]);
      });
    });

    it('should calculate remaining capacity correctly', async () => {
      const targetDate = '2025-10-25';
      mockReq = { query: { date: targetDate } };
      
      // Mock different booking levels
      mockPrisma.order.count
        .mockResolvedValueOnce(0)  // 10am: 0 booked -> 10 remaining
        .mockResolvedValueOnce(5)  // 11am: 5 booked -> 5 remaining
        .mockResolvedValueOnce(10) // 12pm: 10 booked -> 0 remaining (excluded)
        .mockResolvedValueOnce(15) // 1pm: 15 booked -> 0 remaining (capped at 0)
        .mockResolvedValueOnce(3)  // 2pm: 3 booked -> 7 remaining
        .mockResolvedValueOnce(8)  // 3pm: 8 booked -> 2 remaining
        .mockResolvedValueOnce(1)  // 4pm: 1 booked -> 9 remaining
        .mockResolvedValueOnce(0); // 5pm: 0 booked -> 10 remaining

      await getDeliverySlots(mockReq as Request, mockRes as Response);

      const responseData = mockJson.mock.calls[0][0].data;
      const remainingCounts = responseData.map((slot: any) => slot.remaining);
      
      expect(remainingCounts).toContain(10); // 10am and 5pm
      expect(remainingCounts).toContain(5);  // 11am
      expect(remainingCounts).toContain(7);  // 2pm
      expect(remainingCounts).toContain(2);  // 3pm
      expect(remainingCounts).toContain(9);  // 4pm
      expect(remainingCounts).not.toContain(0); // No fully booked slots should be returned
    });

    it('should require date parameter', async () => {
      mockReq = { query: {} };

      await getDeliverySlots(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Date parameter required' });
    });

    it('should reject invalid date format', async () => {
      mockReq = { query: { date: 'invalid-date' } };

      await getDeliverySlots(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid date format' });
    });

    it('should handle database errors gracefully', async () => {
      const targetDate = '2025-10-25';
      mockReq = { query: { date: targetDate } };
      mockPrisma.order.count.mockRejectedValue(new Error('Database error'));

      await getDeliverySlots(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to fetch delivery slots' });
    });
  });
});

