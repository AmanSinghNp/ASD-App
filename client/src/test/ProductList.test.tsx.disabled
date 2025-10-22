import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductList from '../components/ProductList'

// Mock the useProductCatalogue hook
vi.mock('../hooks/useProductCatalogue', () => ({
  useProductCatalogue: () => ({
    products: [
      {
        id: '1',
        name: 'Test Product 1',
        price: 10.00,
        stock: 10,
        category: 'Electronics',
        description: 'Test product 1',
        imageUrl: 'test1.jpg',
        sku: 'TEST1',
        isActive: true
      },
      {
        id: '2',
        name: 'Test Product 2',
        price: 20.00,
        stock: 5,
        category: 'Clothing',
        description: 'Test product 2',
        imageUrl: 'test2.jpg',
        sku: 'TEST2',
        isActive: true
      }
    ],
    categories: [
      { id: 'electronics', name: 'Electronics' },
      { id: 'clothing', name: 'Clothing' }
    ],
    selectedCategory: 'all',
    setSelectedCategory: vi.fn(),
    sortOption: { by: 'name', ascending: true },
    setSortOption: vi.fn(),
    searchQuery: '',
    setSearchQuery: vi.fn()
  })
}))

// Mock ProductCard component
vi.mock('../components/ProductCard', () => ({
  default: ({ product }: any) => (
    <div data-testid={`product-${product.id}`}>
      {product.name} - ${product.price}
    </div>
  )
}))

describe('ProductList Component', () => {
  it('renders product list with products', () => {
    render(<ProductList />)

    // Check if products are displayed
    expect(screen.getByTestId('product-1')).toBeInTheDocument()
    expect(screen.getByTestId('product-2')).toBeInTheDocument()
    expect(screen.getByText('Test Product 1 - $10')).toBeInTheDocument()
    expect(screen.getByText('Test Product 2 - $20')).toBeInTheDocument()
  })

  it('renders filter controls', () => {
    render(<ProductList />)

    // Check if filter controls are present
    expect(screen.getByText('All Categories')).toBeInTheDocument()
    expect(screen.getByText('Sort by:')).toBeInTheDocument()
  })
})
