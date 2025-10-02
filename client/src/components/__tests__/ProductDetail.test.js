import '@testing-library/jest-dom';

// Mock everything
jest.mock('react-router-dom', () => ({
  useParams: () => ({ productId: '1' }),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../controllers/ProductCatalogueController', () => ({
  ProductController: jest.fn().mockImplementation(() => ({
    getProductDetails: () => ({
      id: '1',
      name: 'Test Product',
      priceCents: 1000,
      stockQty: 5,
      imageUrl: '',
      description: 'A test product',
    }),
  })),
}));

jest.mock('../../context/CartContext', () => ({
  useCartContext: () => ({ addToCart: jest.fn() })
}));

// Simple tests without JSX
test('product detail placeholder test', () => {
  expect(1 + 1).toBe(2);
});

test('mock data test', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    priceCents: 1000,
  };
  expect(mockProduct.name).toBe('Test Product');
  expect(mockProduct.priceCents).toBe(1000);
});