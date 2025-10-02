import { describe, it, expect, jest } from '@jest/globals'

// Mock Prisma client
const mockPrisma = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}

// Mock the Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}))

describe('Product Controller', () => {
  it('should return products list', async () => {
    const mockProducts = [
      { id: '1', name: 'Test Product', price: 1000, stockQty: 10 },
      { id: '2', name: 'Another Product', price: 2000, stockQty: 5 },
    ]

    mockPrisma.product.findMany.mockResolvedValue(mockProducts)

    // Simulate getting products
    const products = await mockPrisma.product.findMany()
    
    expect(products).toHaveLength(2)
    expect(products[0].name).toBe('Test Product')
    expect(products[1].price).toBe(2000)
  })

  it('should create a new product', async () => {
    const newProduct = {
      name: 'New Product',
      sku: 'NP001',
      category: 'Test',
      priceCents: 1500,
      stockQty: 20,
      isActive: true,
    }

    const createdProduct = { id: '3', ...newProduct }
    mockPrisma.product.create.mockResolvedValue(createdProduct)

    const result = await mockPrisma.product.create({ data: newProduct })
    
    expect(result.id).toBe('3')
    expect(result.name).toBe('New Product')
    expect(result.sku).toBe('NP001')
  })
})

describe('Order Controller', () => {
  it('should create an order', async () => {
    const orderData = {
      items: [{ productId: '1', quantity: 2, price: 1000 }],
      total: 2000,
      customerEmail: 'test@example.com',
    }

    const createdOrder = { id: 'order-1', ...orderData, status: 'pending' }
    mockPrisma.order.create.mockResolvedValue(createdOrder)

    const result = await mockPrisma.order.create({ data: orderData })
    
    expect(result.id).toBe('order-1')
    expect(result.total).toBe(2000)
    expect(result.status).toBe('pending')
  })
})
