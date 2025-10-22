import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product } from '../models/ProductCatalogueModel';

// Mock the useNavigate hook from React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('ProductCard Component', () => {
   // Prepare mock product data
  const mockProduct: Product = {
    id: '1',
    name: 'Organic Gala Apples',
    brand: 'FarmFresh',
    price: 4.99,
    description: 'A crisp, sweet apple.',
    category: 'fruits',
    imageUrl: '/images/apples.jpg',
    stock: 50,
    rating: 4.5
  };

  it('should render product name, price, and brand correctly', () => {
    // Render the component
    render(
      <Router>
        <ProductCard product={mockProduct} />
      </Router>
    );

     // Check if the product name, brand, and price are displayed correctly on the screen
    expect(screen.getByText('Organic Gala Apples')).toBeInTheDocument();
    expect(screen.getByText('FarmFresh')).toBeInTheDocument();
    expect(screen.getByText('$4.99')).toBeInTheDocument();
  });
});