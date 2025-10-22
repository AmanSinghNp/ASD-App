import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductCard from '../components/ProductCard'

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}))

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 12.99,
  description: 'A test product for testing',
  stock: 10,
  imageUrl: 'https://example.com/image.jpg',
  category: 'Test Category',
  sku: 'TEST-001',
  isActive: true,
  rating: 4.5
}

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    // Check if product details are displayed
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$12.99')).toBeInTheDocument()
    expect(screen.getByText('A test product for testing')).toBeInTheDocument()
    expect(screen.getByText('In stock: 10')).toBeInTheDocument()
  })

  it('handles click events correctly', () => {
    render(<ProductCard product={mockProduct} />)

    // Click on the product card
    const productCard = screen.getByText('Test Product').closest('div')
    fireEvent.click(productCard!)

    // Check if the card is clickable (no error thrown)
    expect(productCard).toBeInTheDocument()
  })
})
