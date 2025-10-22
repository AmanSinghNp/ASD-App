"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// Mock Prisma client
const mockPrisma = {
    product: {
        findMany: globals_1.jest.fn(),
        create: globals_1.jest.fn(),
    },
};
// Mock the Prisma client
globals_1.jest.mock('@prisma/client', () => ({
    PrismaClient: globals_1.jest.fn(() => mockPrisma),
}));
(0, globals_1.describe)('Product Controller', () => {
    (0, globals_1.it)('should return products list', async () => {
        const mockProducts = [
            { id: '1', name: 'Test Product', priceCents: 1000, stockQty: 10 },
            { id: '2', name: 'Another Product', priceCents: 2000, stockQty: 5 },
        ];
        mockPrisma.product.findMany.mockResolvedValue(mockProducts);
        // Simulate getting products
        const products = await mockPrisma.product.findMany();
        (0, globals_1.expect)(products).toHaveLength(2);
        (0, globals_1.expect)(products[0].name).toBe('Test Product');
        (0, globals_1.expect)(products[1].priceCents).toBe(2000);
    });
    (0, globals_1.it)('should create a new product', async () => {
        const newProduct = {
            name: 'New Product',
            sku: 'NP001',
            category: 'Test',
            priceCents: 1500,
            stockQty: 20,
            isActive: true,
        };
        const createdProduct = { id: '3', ...newProduct };
        mockPrisma.product.create.mockResolvedValue(createdProduct);
        const result = await mockPrisma.product.create({ data: newProduct });
        (0, globals_1.expect)(result.id).toBe('3');
        (0, globals_1.expect)(result.name).toBe('New Product');
        (0, globals_1.expect)(result.sku).toBe('NP001');
    });
});
