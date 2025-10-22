"use strict";
/**
 * Analytics Controller Unit Tests
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard
 * Description: Comprehensive tests for analytics and reporting functionality
 * Last Updated: 2025-10-22
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const analyticsController_1 = require("../../controllers/analyticsController");
// Mock Prisma client
const mockPrisma = {
    order: {
        findMany: globals_1.jest.fn(),
    },
};
globals_1.jest.mock('../../utils/database', () => ({
    __esModule: true,
    default: mockPrisma,
}));
(0, globals_1.describe)('Analytics Controller - F007 Admin Dashboard', () => {
    let mockReq;
    let mockRes;
    let mockJson;
    let mockStatus;
    (0, globals_1.beforeEach)(() => {
        mockJson = globals_1.jest.fn();
        mockStatus = globals_1.jest.fn().mockReturnValue({ json: mockJson });
        mockRes = {
            json: mockJson,
            status: mockStatus,
        };
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('getAnalytics', () => {
        (0, globals_1.it)('should calculate total revenue correctly', async () => {
            const mockOrders = [
                { totalCents: 1000, createdAt: new Date('2025-01-15'), items: [] },
                { totalCents: 2000, createdAt: new Date('2025-01-16'), items: [] },
                { totalCents: 1500, createdAt: new Date('2025-01-17'), items: [] }
            ];
            mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
            mockPrisma.order.findMany.mockResolvedValue(mockOrders);
            await (0, analyticsController_1.getAnalytics)(mockReq, mockRes);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                data: globals_1.expect.objectContaining({
                    kpis: globals_1.expect.objectContaining({
                        revenueTotalCents: 4500,
                        ordersCount: 3,
                        avgOrderValueCents: 1500
                    })
                })
            });
        });
        (0, globals_1.it)('should calculate order count', async () => {
            const mockOrders = [
                { totalCents: 1000, createdAt: new Date('2025-01-15'), items: [] },
                { totalCents: 2000, createdAt: new Date('2025-01-16'), items: [] }
            ];
            mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
            mockPrisma.order.findMany.mockResolvedValue(mockOrders);
            await (0, analyticsController_1.getAnalytics)(mockReq, mockRes);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                data: globals_1.expect.objectContaining({
                    kpis: globals_1.expect.objectContaining({
                        ordersCount: 2
                    })
                })
            });
        });
        (0, globals_1.it)('should calculate average order value correctly', async () => {
            const mockOrders = [
                { totalCents: 1000, createdAt: new Date('2025-01-15'), items: [] },
                { totalCents: 3000, createdAt: new Date('2025-01-16'), items: [] }
            ];
            mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
            mockPrisma.order.findMany.mockResolvedValue(mockOrders);
            await (0, analyticsController_1.getAnalytics)(mockReq, mockRes);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                data: globals_1.expect.objectContaining({
                    kpis: globals_1.expect.objectContaining({
                        avgOrderValueCents: 2000 // (1000 + 3000) / 2
                    })
                })
            });
        });
        (0, globals_1.it)('should handle zero orders gracefully', async () => {
            mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
            mockPrisma.order.findMany.mockResolvedValue([]);
            await (0, analyticsController_1.getAnalytics)(mockReq, mockRes);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                data: globals_1.expect.objectContaining({
                    kpis: globals_1.expect.objectContaining({
                        revenueTotalCents: 0,
                        ordersCount: 0,
                        avgOrderValueCents: 0
                    })
                })
            });
        });
        (0, globals_1.it)('should return top products by quantity', async () => {
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
            await (0, analyticsController_1.getAnalytics)(mockReq, mockRes);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                data: globals_1.expect.objectContaining({
                    topProducts: globals_1.expect.arrayContaining([
                        globals_1.expect.objectContaining({
                            productId: '1',
                            name: 'Apple',
                            qty: 7 // 5 + 2
                        }),
                        globals_1.expect.objectContaining({
                            productId: '3',
                            name: 'Orange',
                            qty: 4
                        }),
                        globals_1.expect.objectContaining({
                            productId: '2',
                            name: 'Banana',
                            qty: 3
                        })
                    ])
                })
            });
        });
        (0, globals_1.it)('should return revenue by day', async () => {
            const mockOrders = [
                { totalCents: 1000, createdAt: new Date('2025-01-15T10:00:00Z'), items: [] },
                { totalCents: 2000, createdAt: new Date('2025-01-15T14:00:00Z'), items: [] },
                { totalCents: 1500, createdAt: new Date('2025-01-16T10:00:00Z'), items: [] }
            ];
            mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
            mockPrisma.order.findMany.mockResolvedValue(mockOrders);
            await (0, analyticsController_1.getAnalytics)(mockReq, mockRes);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                data: globals_1.expect.objectContaining({
                    revenueByDay: globals_1.expect.arrayContaining([
                        { date: '2025-01-15', revenueCents: 3000 },
                        { date: '2025-01-16', revenueCents: 1500 }
                    ])
                })
            });
        });
        (0, globals_1.it)('should use default date range when no dates provided', async () => {
            mockReq = { query: {} };
            mockPrisma.order.findMany.mockResolvedValue([]);
            await (0, analyticsController_1.getAnalytics)(mockReq, mockRes);
            (0, globals_1.expect)(mockPrisma.order.findMany).toHaveBeenCalledWith({
                where: globals_1.expect.objectContaining({
                    createdAt: globals_1.expect.objectContaining({
                        gte: globals_1.expect.any(Date),
                        lte: globals_1.expect.any(Date)
                    })
                }),
                include: globals_1.expect.any(Object)
            });
        });
        (0, globals_1.it)('should handle database errors gracefully', async () => {
            mockReq = { query: { from: '2025-01-01', to: '2025-01-31' } };
            mockPrisma.order.findMany.mockRejectedValue(new Error('Database error'));
            await (0, analyticsController_1.getAnalytics)(mockReq, mockRes);
            (0, globals_1.expect)(mockStatus).toHaveBeenCalledWith(500);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({ error: 'Failed to fetch analytics' });
        });
    });
});
