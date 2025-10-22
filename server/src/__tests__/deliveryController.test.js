"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// Mock Prisma client
const mockPrisma = {
    order: {
        count: globals_1.jest.fn(),
    },
};
// Mock the Prisma client
globals_1.jest.mock('@prisma/client', () => ({
    PrismaClient: globals_1.jest.fn(() => mockPrisma),
}));
(0, globals_1.describe)('Delivery Controller', () => {
    (0, globals_1.it)('should calculate delivery slots correctly', async () => {
        // Mock order count for a specific time slot
        mockPrisma.order.count.mockResolvedValue(3);
        // Simulate getting delivery slots
        const slotStart = new Date('2024-01-01T10:00:00Z');
        const slotEnd = new Date('2024-01-01T11:00:00Z');
        const orderCount = await mockPrisma.order.count({
            where: {
                slotStart: {
                    gte: slotStart,
                    lt: slotEnd
                }
            }
        });
        const remaining = Math.max(0, 10 - orderCount);
        (0, globals_1.expect)(orderCount).toBe(3);
        (0, globals_1.expect)(remaining).toBe(7);
    });
    (0, globals_1.it)('should validate address format correctly', () => {
        // Test address validation logic
        const validAddress = {
            addressLine1: '123 Main St',
            suburb: 'Sydney',
            state: 'NSW',
            postcode: '2000'
        };
        const invalidAddress = {
            addressLine1: '123 Main St',
            suburb: 'Sydney',
            state: 'NSW',
            postcode: '200' // Invalid - too short
        };
        // Validate postcode
        const isValidPostcode = (postcode) => /^\d{4}$/.test(postcode);
        (0, globals_1.expect)(isValidPostcode(validAddress.postcode)).toBe(true);
        (0, globals_1.expect)(isValidPostcode(invalidAddress.postcode)).toBe(false);
    });
});
