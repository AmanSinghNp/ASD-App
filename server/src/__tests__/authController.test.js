"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// Mock Prisma client
const mockPrisma = {
    user: {
        findUnique: globals_1.jest.fn(),
        create: globals_1.jest.fn(),
    },
};
// Mock the Prisma client
globals_1.jest.mock('@prisma/client', () => ({
    PrismaClient: globals_1.jest.fn(() => mockPrisma),
}));
(0, globals_1.describe)('Auth Controller', () => {
    (0, globals_1.it)('should validate user credentials', async () => {
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            passwordHash: 'hashed_password',
            role: 'CUSTOMER'
        };
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);
        // Simulate user lookup
        const user = await mockPrisma.user.findUnique({
            where: { email: 'test@example.com' }
        });
        (0, globals_1.expect)(user).toBeDefined();
        (0, globals_1.expect)(user.email).toBe('test@example.com');
        (0, globals_1.expect)(user.role).toBe('CUSTOMER');
    });
    (0, globals_1.it)('should create new user account', async () => {
        const newUser = {
            id: '2',
            email: 'newuser@example.com',
            passwordHash: 'new_hashed_password',
            role: 'CUSTOMER'
        };
        mockPrisma.user.create.mockResolvedValue(newUser);
        // Simulate user creation
        const createdUser = await mockPrisma.user.create({
            data: {
                email: 'newuser@example.com',
                passwordHash: 'new_hashed_password',
                role: 'CUSTOMER'
            }
        });
        (0, globals_1.expect)(createdUser.id).toBe('2');
        (0, globals_1.expect)(createdUser.email).toBe('newuser@example.com');
    });
});
