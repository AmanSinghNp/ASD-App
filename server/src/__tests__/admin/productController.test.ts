/**
 * Product Controller Unit Tests
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard
 * Description: Comprehensive tests for product management functionality
 * Last Updated: 2025-10-22
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { createProduct, updateProduct, hideProduct, getProducts } from '../../controllers/productController';

// Mock Prisma client
const mockPrisma = {
  product: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
};

jest.mock('../../utils/database', () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe('Product Controller - F007 Admin Dashboard', () => {
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

  describe('createProduct', () => {
    it('should create product with valid data', async () => {
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

      await createProduct(mockReq as Request, mockRes as Response);

      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: validProduct
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({ data: createdProduct });
    });

    it('should reject duplicate SKU', async () => {
      const duplicateProduct = {
        name: 'Another Apple',
        sku: 'EXISTING_SKU',
        category: 'Fruits',
        priceCents: 299,
        stockQty: 100
      };

      mockReq = { body: duplicateProduct };
      mockPrisma.product.create.mockRejectedValue({ code: 'P2002' });

      await createProduct(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'SKU already exists' });
    });

    it('should reject negative price', async () => {
      const invalidProduct = {
        name: 'Invalid Apple',
        sku: 'INV001',
        category: 'Fruits',
        priceCents: -100,
        stockQty: 50
      };

      mockReq = { body: invalidProduct };

      await createProduct(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'priceCents must be a non-negative integer' 
      });
    });

    it('should reject invalid name length', async () => {
      const invalidProduct = {
        name: '', // Too short
        sku: 'INV002',
        category: 'Fruits',
        priceCents: 299,
        stockQty: 50
      };

      mockReq = { body: invalidProduct };

      await createProduct(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'Name must be 1-120 characters' 
      });
    });

    it('should reject negative stock quantity', async () => {
      const invalidProduct = {
        name: 'Test Product',
        sku: 'INV003',
        category: 'Fruits',
        priceCents: 299,
        stockQty: -10
      };

      mockReq = { body: invalidProduct };

      await createProduct(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'stockQty must be a non-negative integer' 
      });
    });
  });

  describe('updateProduct', () => {
    it('should update price and stock successfully', async () => {
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

      await updateProduct(mockReq as Request, mockRes as Response);

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: updates
      });
      expect(mockJson).toHaveBeenCalledWith({ data: updatedProduct });
    });

    it('should return error for non-existent product', async () => {
      const updates = { priceCents: 100 };
      const productId = '99999';

      mockReq = { 
        params: { id: productId },
        body: updates 
      };
      mockPrisma.product.update.mockRejectedValue({ code: 'P2025' });

      await updateProduct(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should validate price on update', async () => {
      const invalidUpdates = { priceCents: -50 };
      const productId = '1';

      mockReq = { 
        params: { id: productId },
        body: invalidUpdates 
      };

      await updateProduct(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'priceCents must be a non-negative integer' 
      });
    });
  });

  describe('hideProduct', () => {
    it('should soft delete product (isActive = false)', async () => {
      const productId = '1';
      const hiddenProduct = { id: productId, isActive: false };

      mockReq = { params: { id: productId } };
      mockPrisma.product.update.mockResolvedValue(hiddenProduct);

      await hideProduct(mockReq as Request, mockRes as Response);

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { isActive: false }
      });
      expect(mockJson).toHaveBeenCalledWith({ data: hiddenProduct });
    });

    it('should return error for non-existent product', async () => {
      const productId = '99999';

      mockReq = { params: { id: productId } };
      mockPrisma.product.update.mockRejectedValue({ code: 'P2025' });

      await hideProduct(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('getProducts', () => {
    it('should return all products when includeHidden=true', async () => {
      const products = [
        { id: '1', name: 'Apple', isActive: true },
        { id: '2', name: 'Banana', isActive: false }
      ];

      mockReq = { query: { includeHidden: 'true' } };
      mockPrisma.product.findMany.mockResolvedValue(products);

      await getProducts(mockReq as Request, mockRes as Response);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' }
      });
      expect(mockJson).toHaveBeenCalledWith({ data: products });
    });

    it('should return only active products when includeHidden=false', async () => {
      const activeProducts = [
        { id: '1', name: 'Apple', isActive: true }
      ];

      mockReq = { query: { includeHidden: 'false' } };
      mockPrisma.product.findMany.mockResolvedValue(activeProducts);

      await getProducts(mockReq as Request, mockRes as Response);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
      expect(mockJson).toHaveBeenCalledWith({ data: activeProducts });
    });
  });
});

