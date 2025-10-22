/**
 * Analytics Controller Unit Tests
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard
 * Description: Comprehensive tests for analytics and reporting functionality
 * Last Updated: 2025-10-22
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { getAnalytics } from '../../controllers/analyticsController';

// Mock Prisma client
const mockPrisma = {
  order: {
    findMany: jest.fn(),
  },
};

jest.mock('../../utils/database', () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe('Analytics Controller - F007 Admin Dashboard', () => {
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

  describe('getAnalytics', () => {
    it('should calculate total revenue correctly', async () => {
      const mockOrders = [
        { totalCents: 1000, createdAt: new Date('2025-01-15'), items: [] },
        { totalCents: 2000, createdAt: new Date('2025-01-16'), items: [] },
        { totalCents: 1500, createdAt: new Date('2025-01-17'), items: [] }
      ];

      mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
      mockPrisma.order.findMany.mockResolvedValue(mockOrders);

      await getAnalytics(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.objectContaining({
          kpis: expect.objectContaining({
            revenueTotalCents: 4500,
            ordersCount: 3,
            avgOrderValueCents: 1500
          })
        })
      });
    });

    it('should calculate order count', async () => {
      const mockOrders = [
        { totalCents: 1000, createdAt: new Date('2025-01-15'), items: [] },
        { totalCents: 2000, createdAt: new Date('2025-01-16'), items: [] }
      ];

      mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
      mockPrisma.order.findMany.mockResolvedValue(mockOrders);

      await getAnalytics(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.objectContaining({
          kpis: expect.objectContaining({
            ordersCount: 2
          })
        })
      });
    });

    it('should calculate average order value correctly', async () => {
      const mockOrders = [
        { totalCents: 1000, createdAt: new Date('2025-01-15'), items: [] },
        { totalCents: 3000, createdAt: new Date('2025-01-16'), items: [] }
      ];

      mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
      mockPrisma.order.findMany.mockResolvedValue(mockOrders);

      await getAnalytics(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.objectContaining({
          kpis: expect.objectContaining({
            avgOrderValueCents: 2000 // (1000 + 3000) / 2
          })
        })
      });
    });

    it('should handle zero orders gracefully', async () => {
      mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
      mockPrisma.order.findMany.mockResolvedValue([]);

      await getAnalytics(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.objectContaining({
          kpis: expect.objectContaining({
            revenueTotalCents: 0,
            ordersCount: 0,
            avgOrderValueCents: 0
          })
        })
      });
    });

    it('should return top products by quantity', async () => {
      const mockOrders = [
        {
          totalCents: 1000,
          createdAt: new Date('2025-01-15'),
          items: [
            { productId: '1', nameAtPurchase: 'Apple', quantity: 5 },
            { productId: '2', nameAtPurchase: 'Banana', quantity: 3 }
          ]
        },
        {
          totalCents: 2000,
          createdAt: new Date('2025-01-16'),
          items: [
            { productId: '1', nameAtPurchase: 'Apple', quantity: 2 },
            { productId: '3', nameAtPurchase: 'Orange', quantity: 4 }
          ]
        }
      ];

      mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
      mockPrisma.order.findMany.mockResolvedValue(mockOrders);

      await getAnalytics(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.objectContaining({
          topProducts: expect.arrayContaining([
            expect.objectContaining({
              productId: '1',
              name: 'Apple',
              qty: 7 // 5 + 2
            }),
            expect.objectContaining({
              productId: '3',
              name: 'Orange',
              qty: 4
            }),
            expect.objectContaining({
              productId: '2',
              name: 'Banana',
              qty: 3
            })
          ])
        })
      });
    });

    it('should return revenue by day', async () => {
      const mockOrders = [
        { totalCents: 1000, createdAt: new Date('2025-01-15T10:00:00Z'), items: [] },
        { totalCents: 2000, createdAt: new Date('2025-01-15T14:00:00Z'), items: [] },
        { totalCents: 1500, createdAt: new Date('2025-01-16T10:00:00Z'), items: [] }
      ];

      mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
      mockPrisma.order.findMany.mockResolvedValue(mockOrders);

      await getAnalytics(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.objectContaining({
          revenueByDay: expect.arrayContaining([
            { date: '2025-01-15', revenueCents: 3000 },
            { date: '2025-01-16', revenueCents: 1500 }
          ])
        })
      });
    });

    it('should use default date range when no dates provided', async () => {
      mockReq = { query: {} };
      mockPrisma.order.findMany.mockResolvedValue([]);

      await getAnalytics(mockReq as Request, mockRes as Response);

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date)
          })
        }),
        include: expect.any(Object)
      });
    });

    it('should handle database errors gracefully', async () => {
      mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
      mockPrisma.order.findMany.mockRejectedValue(new Error('Database error'));

      await getAnalytics(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to fetch analytics' });
    });
  });
});

