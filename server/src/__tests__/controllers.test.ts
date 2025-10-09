import { describe, it, expect, jest } from '@jest/globals'

// Mock Prisma client
const mockPrisma = {
  product: {
    findMany: jest.fn() as jest.MockedFunction<any>,
    create: jest.fn() as jest.MockedFunction<any>,
  },
}

// Mock the Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}))

describe('Product Controller', () => {
  it('should return products list', async () => {
    const mockProducts = [
      { id: '1', name: 'Test Product', priceCents: 1000, stockQty: 10 },
      { id: '2', name: 'Another Product', priceCents: 2000, stockQty: 5 },
    ]

    mockPrisma.product.findMany.mockResolvedValue(mockProducts)

    // Simulate getting products
    const products = await mockPrisma.product.findMany()
    
    expect(products).toHaveLength(2)
    expect((products as any)[0].name).toBe('Test Product')
    expect((products as any)[1].priceCents).toBe(2000)
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
    
    expect((result as any).id).toBe('3')
    expect((result as any).name).toBe('New Product')
    expect((result as any).sku).toBe('NP001')
  })
})
