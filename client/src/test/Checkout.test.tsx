import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Checkout from '../Checkout'

// Mock the useProductCatalogue hook
vi.mock('../hooks/useProductCatalogue', () => ({
  useProductCatalogue: () => ({
    products: [
      {
        id: '1',
        name: 'Test Product',
        price: 10.00,
        stock: 10
      }
    ],
    loading: false,
    error: null
  })
}))

describe('Checkout Component', () => {
  it('renders checkout form with required fields', () => {
    render(<Checkout />)

    // Check if form fields are present
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Street Address')).toBeInTheDocument()
  })

  it('allows user to input customer information', () => {
    render(<Checkout />)

    // Fill in form fields
    const firstNameInput = screen.getByPlaceholderText('First Name')
    const emailInput = screen.getByPlaceholderText('Email')
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })

    // Check if values are updated
    expect(firstNameInput).toHaveValue('John')
    expect(emailInput).toHaveValue('john@example.com')
  })
})
