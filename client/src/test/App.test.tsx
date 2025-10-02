import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

// Mock the components to avoid complex dependencies
vi.mock('../pages/admin/AdminDashboard', () => ({
  AdminDashboard: () => <div data-testid="admin-dashboard">Admin Dashboard</div>
}))

vi.mock('../pages/delivery/DeliveryInterface', () => ({
  DeliveryInterface: () => <div data-testid="delivery-interface">Delivery Interface</div>
}))

vi.mock('../ProductCatalogue', () => ({
  default: () => <div data-testid="product-catalogue">Product Catalogue</div>
}))

vi.mock('../Checkout', () => ({
  default: () => <div data-testid="checkout">Checkout</div>
}))

describe('App Component', () => {
  it('renders navigation with all links', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Check if navigation links are present
    expect(screen.getByText('ASD App')).toBeInTheDocument()
    expect(screen.getByText('Product Catalogue')).toBeInTheDocument()
    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByText('Admin Dashboard (F007)')).toBeInTheDocument()
    expect(screen.getByText('Delivery Interface (F008)')).toBeInTheDocument()
  })

  it('renders product catalogue by default', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByTestId('product-catalogue')).toBeInTheDocument()
  })
})
