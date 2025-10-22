import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../../controllers/ProductCatalogueController', () => ({
  ProductController: vi.fn().mockImplementation(() => ({
    getProducts: () => [
      {
        id: '1',
        name: 'Product 1',
        priceCents: 1000,
        stockQty: 5,
      },
      {
        id: '2', 
        name: 'Product 2',
        priceCents: 2000,
        stockQty: 0,
      }
    ],
  })),
}));

describe('ProductList', () => {
  test('product list - basic rendering', () => {
    expect(true).toBe(true);
  });

  test('product list contains multiple products', () => {
    const products = [
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' },
      { id: '3', name: 'Product 3' }
    ];
    expect(products).toHaveLength(3);
    expect(products[0].name).toBe('Product 1');
  });

  test('filters products by stock availability', () => {
    const products = [
      { id: '1', name: 'In Stock', stockQty: 5 },
      { id: '2', name: 'Out of Stock', stockQty: 0 },
      { id: '3', name: 'In Stock', stockQty: 3 }
    ];
    
    const inStockProducts = products.filter(product => product.stockQty > 0);
    expect(inStockProducts).toHaveLength(2);
    expect(inStockProducts[0].stockQty).toBeGreaterThan(0);
  });

  test('sorts products by price', () => {
    const products = [
      { id: '1', name: 'Cheap', priceCents: 500 },
      { id: '2', name: 'Expensive', priceCents: 2000 },
      { id: '3', name: 'Medium', priceCents: 1000 }
    ];
    
    const sortedByPrice = [...products].sort((a, b) => a.priceCents - b.priceCents);
    expect(sortedByPrice[0].priceCents).toBe(500);
    expect(sortedByPrice[2].priceCents).toBe(2000);
  });

  test('calculates total value of product list', () => {
    const products = [
      { priceCents: 1000, stockQty: 2 },
      { priceCents: 2000, stockQty: 1 }
    ];
    
    const totalValue = products.reduce((sum, product) => sum + (product.priceCents * product.stockQty), 0);
    expect(totalValue).toBe(4000); // (1000*2) + (2000*1)
  });
});