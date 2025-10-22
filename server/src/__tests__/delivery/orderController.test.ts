/**
 * Order Controller Unit Tests
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F008 - Delivery
 * Description: Comprehensive tests for order management and status updates
 * Last Updated: 2025-10-22
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { createOrder, updateOrderStatus, getOrders } from '../../controllers/orderController';

// Mock Prisma client
const mockPrisma = {
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  orderItem: {
    createMany: jest.fn(),
  },
  orderStatusHistory: {
    create: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  stockHistory: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

jest.mock('../../utils/database', () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe('Order Controller - F008 Delivery', () => {
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

  describe('createOrder', () => {
    it('should create order with valid delivery data', async () => {
      const validOrder = {
        items: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 }
        ],
        deliveryMethod: 'Delivery',
        address: {
          addressLine1: '123 Main St',
          suburb: 'Sydney',
          state: 'NSW',
          postcode: '2000'
        },
        slotStart: '2025-10-25T10:00:00Z',
        slotEnd: '2025-10-25T11:00:00Z',
        paymentMethod: 'card'
      };

      const mockProducts = [
        { id: '1', name: 'Apple', priceCents: 100, stockQty: 10 },
        { id: '2', name: 'Banana', priceCents: 200, stockQty: 5 }
      ];

      const mockOrder = {
        id: 'order-1',
        status: 'Processing',
        paymentMethod: 'card',
        paymentStatus: 'pending'
      };

      mockReq = { body: validOrder };
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          product: {
            findUnique: jest.fn()
              .mockResolvedValueOnce(mockProducts[0])
              .mockResolvedValueOnce(mockProducts[1])
              .mockResolvedValueOnce(mockProducts[0])
              .mockResolvedValueOnce(mockProducts[1])
          },
          order: {
            create: jest.fn().mockResolvedValue(mockOrder)
          },
          orderItem: {
            createMany: jest.fn()
          },
          orderStatusHistory: {
            create: jest.fn()
          },
          product: {
            update: jest.fn()
          },
          stockHistory: {
            create: jest.fn()
          }
        });
      });

      await createOrder(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        data: expect.objectContaining({
          orderId: 'order-1',
          status: 'Processing',
          paymentMethod: 'card',
          paymentStatus: 'pending'
        })
      });
    });

    it('should create order with pickup method', async () => {
      const pickupOrder = {
        items: [{ productId: '1', quantity: 1 }],
        deliveryMethod: 'Pickup',
        paymentMethod: 'cash_on_delivery'
      };

      const mockProduct = { id: '1', name: 'Apple', priceCents: 100, stockQty: 10 };
      const mockOrder = { id: 'order-2', status: 'Processing' };

      mockReq = { body: pickupOrder };
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          product: {
            findUnique: jest.fn().mockResolvedValue(mockProduct)
          },
          order: {
            create: jest.fn().mockResolvedValue(mockOrder)
          },
          orderItem: {
            createMany: jest.fn()
          },
          orderStatusHistory: {
            create: jest.fn()
          },
          product: {
            update: jest.fn()
          },
          stockHistory: {
            create: jest.fn()
          }
        });
      });

      await createOrder(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
    });

    it('should reject order with invalid delivery method', async () => {
      const invalidOrder = {
        items: [{ productId: '1', quantity: 1 }],
        deliveryMethod: 'InvalidMethod'
      };

      mockReq = { body: invalidOrder };

      await createOrder(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid delivery method' });
    });

    it('should reject delivery order without address', async () => {
      const invalidOrder = {
        items: [{ productId: '1', quantity: 1 }],
        deliveryMethod: 'Delivery'
        // Missing address
      };

      mockReq = { body: invalidOrder };

      await createOrder(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Address required for delivery' });
    });

    it('should reject delivery order without time slot', async () => {
      const invalidOrder = {
        items: [{ productId: '1', quantity: 1 }],
        deliveryMethod: 'Delivery',
        address: { addressLine1: '123 Main St', suburb: 'Sydney', state: 'NSW', postcode: '2000' }
        // Missing slotStart and slotEnd
      };

      mockReq = { body: invalidOrder };

      await createOrder(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Delivery slot required' });
    });

    it('should reject order with non-existent product', async () => {
      const orderWithInvalidProduct = {
        items: [{ productId: '999', quantity: 1 }],
        deliveryMethod: 'Pickup'
      };

      mockReq = { body: orderWithInvalidProduct };
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          product: {
            findUnique: jest.fn().mockResolvedValue(null) // Product not found
          }
        });
      });

      await createOrder(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Product 999 not found' });
    });

    it('should reject order with insufficient stock', async () => {
      const orderWithInsufficientStock = {
        items: [{ productId: '1', quantity: 100 }], // Requesting 100 but only 10 available
        deliveryMethod: 'Pickup'
      };

      const mockProduct = { id: '1', name: 'Apple', priceCents: 100, stockQty: 10 };

      mockReq = { body: orderWithInsufficientStock };
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          product: {
            findUnique: jest.fn().mockResolvedValue(mockProduct)
          }
        });
      });

      await createOrder(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Insufficient stock for Apple' });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update status to valid value', async () => {
      const orderId = 'order-1';
      const newStatus = 'preparing';
      const mockOrder = { id: orderId, status: 'Processing' };
      const updatedOrder = { id: orderId, status: 'Packed' };

      mockReq = { 
        params: { id: orderId },
        body: { status: newStatus }
      };

      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            update: jest.fn().mockResolvedValue(updatedOrder)
          },
          orderStatusHistory: {
            create: jest.fn()
          }
        });
      });

      await updateOrderStatus(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: orderId,
          status: 'preparing',
          updatedAt: expect.any(String)
        })
      });
    });

    it('should reject invalid status value', async () => {
      const orderId = 'order-1';
      const invalidStatus = 'invalid_status';

      mockReq = { 
        params: { id: orderId },
        body: { status: invalidStatus }
      };

      await updateOrderStatus(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid status' });
    });

    it('should reject update for non-existent order', async () => {
      const orderId = '999';

      mockReq = { 
        params: { id: orderId },
        body: { status: 'preparing' }
      };

      mockPrisma.order.findUnique.mockResolvedValue(null);

      await updateOrderStatus(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Order not found' });
    });

    it('should log status change in history', async () => {
      const orderId = 'order-1';
      const newStatus = 'delivered';
      const mockOrder = { id: orderId, status: 'Processing' };

      mockReq = { 
        params: { id: orderId },
        body: { status: newStatus, notes: 'Delivered successfully' }
      };

      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            update: jest.fn().mockResolvedValue({ id: orderId, status: 'Delivered' })
          },
          orderStatusHistory: {
            create: jest.fn()
          }
        });
      });

      await updateOrderStatus(mockReq as Request, mockRes as Response);

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('getOrders', () => {
    it('should return all orders with proper formatting', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          user: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
          items: [
            { nameAtPurchase: 'Apple', quantity: 2, priceCents: 100 }
          ],
          status: 'Processing',
          deliveryMethod: 'Delivery',
          addressLine1: '123 Main St',
          suburb: 'Sydney',
          state: 'NSW',
          postcode: '2000',
          totalCents: 200,
          paymentMethod: 'card',
          paymentStatus: 'pending',
          slotStart: new Date('2025-10-25T10:00:00Z'),
          slotEnd: new Date('2025-10-25T11:00:00Z'),
          statusHistory: [
            { id: '1', status: 'Processing', notes: 'Order created', createdAt: new Date() }
          ],
          createdAt: new Date('2025-10-25T09:00:00Z'),
          updatedAt: new Date('2025-10-25T09:00:00Z')
        }
      ];

      mockReq = {};
      mockPrisma.order.findMany.mockResolvedValue(mockOrders);

      await getOrders(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 'order-1',
            customerName: 'John Doe',
            email: 'john@example.com',
            address: '123 Main St, Sydney, NSW 2000',
            items: expect.arrayContaining([
              expect.objectContaining({
                name: 'Apple',
                quantity: 2,
                price: 100
              })
            ]),
            total: 200,
            status: 'pending',
            deliveryMethod: 'Delivery',
            slotStart: '2025-10-25T10:00:00.000Z',
            slotEnd: '2025-10-25T11:00:00.000Z'
          })
        ])
      });
    });

    it('should handle orders without user (guest orders)', async () => {
      const mockOrders = [
        {
          id: 'order-2',
          user: null,
          items: [],
          status: 'Processing',
          deliveryMethod: 'Pickup',
          addressLine1: null,
          suburb: null,
          state: null,
          postcode: null,
          totalCents: 100,
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          slotStart: null,
          slotEnd: null,
          statusHistory: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockReq = {};
      mockPrisma.order.findMany.mockResolvedValue(mockOrders);

      await getOrders(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 'order-2',
            customerName: 'Guest Customer',
            email: 'guest@example.com',
            address: 'Store Pickup'
          })
        ])
      });
    });
  });
});

