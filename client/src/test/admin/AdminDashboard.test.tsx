/**
 * Admin Dashboard Component Tests
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard
 * Description: Comprehensive tests for admin dashboard functionality
 * Last Updated: 2025-10-22
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AdminDashboard } from '../../pages/admin/AdminDashboard'

// Mock fetch globally
global.fetch = vi.fn()

// Mock the admin components
vi.mock('../../components/admin/ProductTable', () => ({
  ProductTable: ({ products, onEdit, onRemove, onToggleActive }: any) => (
    <div data-testid="product-table">
      {products.map((product: any) => (
        <div key={product.id} data-testid={`product-${product.id}`}>
          <span>{product.name}</span>
          <button onClick={() => onEdit(product)}>Edit</button>
          <button onClick={() => onRemove(product.id)}>Remove</button>
          <button onClick={() => onToggleActive(product.id)}>Toggle</button>
        </div>
      ))}
    </div>
  )
}))

vi.mock('../../components/admin/ProductForm', () => ({
  ProductForm: ({ initialProduct, onSubmit, onCancel }: any) => (
    <div data-testid="product-form">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name: 'Test Product', sku: 'TEST001' }); }}>
        <input defaultValue={initialProduct?.name || ''} />
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  )
}))

vi.mock('../../components/admin/ConfirmDialog', () => ({
  ConfirmDialog: ({ isOpen, onConfirm, onCancel, message }: any) => 
    isOpen ? (
      <div data-testid="confirm-dialog">
        <p>{message}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null
}))

describe('AdminDashboard Component - F007', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock successful API responses
    const mockProducts = [
      { id: '1', name: 'Apple', sku: 'APP001', priceCents: 100, stockQty: 10, isActive: true },
      { id: '2', name: 'Banana', sku: 'BAN001', priceCents: 200, stockQty: 5, isActive: false }
    ]
    
    const mockAnalytics = {
      kpis: {
        revenueTotalCents: 10000,
        ordersCount: 25,
        avgOrderValueCents: 400
      },
      topProducts: [
        { productId: '1', name: 'Apple', qty: 15 }
      ]
    }

    ;(global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockProducts })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockAnalytics })
      })
  })

  it('renders admin dashboard without crashing', async () => {
    render(<AdminDashboard />)
    
    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    })
  })

  it('displays products after loading', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('product-table')).toBeInTheDocument()
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Banana')).toBeInTheDocument()
    })
  })

  it('shows add product button', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Add Product')).toBeInTheDocument()
    })
  })

  it('opens product form when add button is clicked', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Add Product')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Add Product'))
    
    expect(screen.getByTestId('product-form')).toBeInTheDocument()
  })

  it('handles product search', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('product-table')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search products...')
    fireEvent.change(searchInput, { target: { value: 'Apple' } })
    
    // Should filter products (this would be tested in integration)
    expect(searchInput).toHaveValue('Apple')
  })

  it('handles category filtering', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('product-table')).toBeInTheDocument()
    })
    
    const categorySelect = screen.getByDisplayValue('All Categories')
    fireEvent.change(categorySelect, { target: { value: 'Fruits' } })
    
    expect(categorySelect).toHaveValue('Fruits')
  })

  it('handles status filtering', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('product-table')).toBeInTheDocument()
    })
    
    const statusSelect = screen.getByDisplayValue('All Status')
    fireEvent.change(statusSelect, { target: { value: 'active' } })
    
    expect(statusSelect).toHaveValue('active')
  })

  it('displays pagination controls', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('product-table')).toBeInTheDocument()
    })
    
    // Should show pagination when there are many products
    expect(screen.getByText('Page')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    ;(global.fetch as any)
      .mockRejectedValueOnce(new Error('API Error'))
      .mockRejectedValueOnce(new Error('API Error'))

    render(<AdminDashboard />)
    
    // Should handle error without crashing
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    })
  })

  it('shows analytics data when available', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Sales Analytics')).toBeInTheDocument()
    })
  })

  it('handles product form submission', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Add Product')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Add Product'))
    
    const form = screen.getByTestId('product-form')
    expect(form).toBeInTheDocument()
    
    // Mock successful product creation
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        data: { id: '3', name: 'Test Product', sku: 'TEST001' } 
      })
    })
    
    fireEvent.click(screen.getByText('Save'))
    
    // Form should close after successful submission
    await waitFor(() => {
      expect(screen.queryByTestId('product-form')).not.toBeInTheDocument()
    })
  })

  it('handles product form cancellation', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Add Product')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Add Product'))
    
    expect(screen.getByTestId('product-form')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Cancel'))
    
    expect(screen.queryByTestId('product-form')).not.toBeInTheDocument()
  })
})

