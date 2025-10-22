"use strict";
/**
 * Product Controller Unit Tests
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard
 * Description: Comprehensive tests for product management functionality
 * Last Updated: 2025-10-22
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const productController_1 = require("../../controllers/productController");
// Mock Prisma client
const mockPrisma = {
    product: {
        findMany: globals_1.jest.fn(),
        create: globals_1.jest.fn(),
        update: globals_1.jest.fn(),
        findUnique: globals_1.jest.fn(),
    },
};
globals_1.jest.mock('../../utils/database', () => ({
    __esModule: true,
    default: mockPrisma,
}));
(0, globals_1.describe)('Product Controller - F007 Admin Dashboard', () => {
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
    (0, globals_1.describe)('createProduct', () => {
        (0, globals_1.it)('should create product with valid data', async () => {
            const validProduct = {
                name: 'Test Apple',
                sku: 'TEST001',
                category: 'Fruits',
                priceCents: 299,
                stockQty: 100,
                imageUrl: 'https://example.com/apple.jpg'
            };
            mockReq = { body: validProduct };
            const createdProduct = { id: '1', ...validProduct };
            mockPrisma.product.create.mockResolvedValue(createdProduct);
            await (0, productController_1.createProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockPrisma.product.create).toHaveBeenCalledWith({
                data: validProduct
            });
            (0, globals_1.expect)(mockStatus).toHaveBeenCalledWith(201);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({ data: createdProduct });
        });
        (0, globals_1.it)('should reject duplicate SKU', async () => {
            const duplicateProduct = {
                name: 'Another Apple',
                sku: 'EXISTING_SKU',
                category: 'Fruits',
                priceCents: 299,
                stockQty: 100
            };
            mockReq = { body: duplicateProduct };
            mockPrisma.product.create.mockRejectedValue({ code: 'P2002' });
            await (0, productController_1.createProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockStatus).toHaveBeenCalledWith(400);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({ error: 'SKU already exists' });
        });
        (0, globals_1.it)('should reject negative price', async () => {
            const invalidProduct = {
                name: 'Invalid Apple',
                sku: 'INV001',
                category: 'Fruits',
                priceCents: -100,
                stockQty: 50
            };
            mockReq = { body: invalidProduct };
            await (0, productController_1.createProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockStatus).toHaveBeenCalledWith(400);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                error: 'priceCents must be a non-negative integer'
            });
        });
        (0, globals_1.it)('should reject invalid name length', async () => {
            const invalidProduct = {
                name: '', // Too short
                sku: 'INV002',
                category: 'Fruits',
                priceCents: 299,
                stockQty: 50
            };
            mockReq = { body: invalidProduct };
            await (0, productController_1.createProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockStatus).toHaveBeenCalledWith(400);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                error: 'Name must be 1-120 characters'
            });
        });
        (0, globals_1.it)('should reject negative stock quantity', async () => {
            const invalidProduct = {
                name: 'Test Product',
                sku: 'INV003',
                category: 'Fruits',
                priceCents: 299,
                stockQty: -10
            };
            mockReq = { body: invalidProduct };
            await (0, productController_1.createProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockStatus).toHaveBeenCalledWith(400);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                error: 'stockQty must be a non-negative integer'
            });
        });
    });
    (0, globals_1.describe)('updateProduct', () => {
        (0, globals_1.it)('should update price and stock successfully', async () => {
            const updates = {
                priceCents: 399,
                stockQty: 75
            };
            const productId = '1';
            const updatedProduct = { id: productId, ...updates };
            mockReq = {
                params: { id: productId },
                body: updates
            };
            mockPrisma.product.update.mockResolvedValue(updatedProduct);
            await (0, productController_1.updateProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockPrisma.product.update).toHaveBeenCalledWith({
                where: { id: productId },
                data: updates
            });
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({ data: updatedProduct });
        });
        (0, globals_1.it)('should return error for non-existent product', async () => {
            const updates = { priceCents: 100 };
            const productId = '99999';
            mockReq = {
                params: { id: productId },
                body: updates
            };
            mockPrisma.product.update.mockRejectedValue({ code: 'P2025' });
            await (0, productController_1.updateProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockStatus).toHaveBeenCalledWith(404);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({ error: 'Product not found' });
        });
        (0, globals_1.it)('should validate price on update', async () => {
            const invalidUpdates = { priceCents: -50 };
            const productId = '1';
            mockReq = {
                params: { id: productId },
                body: invalidUpdates
            };
            await (0, productController_1.updateProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockStatus).toHaveBeenCalledWith(400);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({
                error: 'priceCents must be a non-negative integer'
            });
        });
    });
    (0, globals_1.describe)('hideProduct', () => {
        (0, globals_1.it)('should soft delete product (isActive = false)', async () => {
            const productId = '1';
            const hiddenProduct = { id: productId, isActive: false };
            mockReq = { params: { id: productId } };
            mockPrisma.product.update.mockResolvedValue(hiddenProduct);
            await (0, productController_1.hideProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockPrisma.product.update).toHaveBeenCalledWith({
                where: { id: productId },
                data: { isActive: false }
            });
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({ data: hiddenProduct });
        });
        (0, globals_1.it)('should return error for non-existent product', async () => {
            const productId = '99999';
            mockReq = { params: { id: productId } };
            mockPrisma.product.update.mockRejectedValue({ code: 'P2025' });
            await (0, productController_1.hideProduct)(mockReq, mockRes);
            (0, globals_1.expect)(mockStatus).toHaveBeenCalledWith(404);
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({ error: 'Product not found' });
        });
    });
    (0, globals_1.describe)('getProducts', () => {
        (0, globals_1.it)('should return all products when includeHidden=true', async () => {
            const products = [
                { id: '1', name: 'Apple', isActive: true },
                { id: '2', name: 'Banana', isActive: false }
            ];
            mockReq = { query: { includeHidden: 'true' } };
            mockPrisma.product.findMany.mockResolvedValue(products);
            await (0, productController_1.getProducts)(mockReq, mockRes);
            (0, globals_1.expect)(mockPrisma.product.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: { createdAt: 'desc' }
            });
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({ data: products });
        });
        (0, globals_1.it)('should return only active products when includeHidden=false', async () => {
            const activeProducts = [
                { id: '1', name: 'Apple', isActive: true }
            ];
            mockReq = { query: { includeHidden: 'false' } };
            mockPrisma.product.findMany.mockResolvedValue(activeProducts);
            await (0, productController_1.getProducts)(mockReq, mockRes);
            (0, globals_1.expect)(mockPrisma.product.findMany).toHaveBeenCalledWith({
                where: { isActive: true },
                orderBy: { createdAt: 'desc' }
            });
            (0, globals_1.expect)(mockJson).toHaveBeenCalledWith({ data: activeProducts });
        });
    });
});
