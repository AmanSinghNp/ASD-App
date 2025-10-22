import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AdminDashboard } from '../pages/admin/AdminDashboard'

// Mock the components to avoid complex dependencies
vi.mock('../../components/admin/ProductTable', () => ({
  ProductTable: () => <div data-testid="product-table">Product Table</div>
}))

vi.mock('../../components/admin/ProductForm', () => ({
  ProductForm: () => <div data-testid="product-form">Product Form</div>
}))

vi.mock('../../components/admin/ConfirmDialog', () => ({
  ConfirmDialog: () => <div data-testid="confirm-dialog">Confirm Dialog</div>
}))

describe('AdminDashboard Component', () => {
  it('renders admin dashboard without crashing', () => {
    render(<AdminDashboard />)

    // Check if the component renders (shows loading initially)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders admin dashboard component successfully', () => {
    const { container } = render(<AdminDashboard />)
    
    // Check if the component renders without throwing errors
    expect(container).toBeInTheDocument()
  })
})
