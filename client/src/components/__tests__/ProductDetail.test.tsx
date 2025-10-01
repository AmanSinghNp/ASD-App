import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ProductDetail from '../ProductDetail';
import { MemoryRouter } from 'react-router-dom';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ productId: '1' }),
  useNavigate: () => jest.fn(),
}));

// Mock ProductController
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

// Mock CartContext
jest.mock('../../context/CartContext', () => ({
  useCartContext: () => ({ addToCart: jest.fn() })
}));

describe('ProductDetail', () => {
  it('renders loading state', () => {
    // Render with loading true
    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );
    expect(screen.queryByText(/loading/i)).not.toBeNull();
  });

  it('renders product details', async () => {
    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText(/in stock/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
  });
});
