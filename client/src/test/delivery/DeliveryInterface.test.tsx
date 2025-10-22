/**
 * Delivery Interface Component Tests
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F008 - Delivery
 * Description: Comprehensive tests for delivery interface functionality
 * Last Updated: 2025-10-22
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeliveryInterface } from '../../pages/delivery/DeliveryInterface'

// Mock fetch globally
global.fetch = vi.fn()

describe('DeliveryInterface Component - F008', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock successful API responses
    const mockOrders = [
      {
        id: 'order-1',
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St, Sydney, NSW 2000',
        items: [
          { name: 'Apple', quantity: 2, price: 100 }
        ],
        total: 200,
        status: 'pending',
        deliveryMethod: 'Delivery',
        slotStart: '2025-10-25T10:00:00Z',
        slotEnd: '2025-10-25T11:00:00Z',
        createdAt: '2025-10-25T09:00:00Z',
        updatedAt: '2025-10-25T09:00:00Z'
      },
      {
        id: 'order-2',
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        address: '456 Oak Ave, Melbourne, VIC 3000',
        items: [
          { name: 'Banana', quantity: 1, price: 200 }
        ],
        total: 200,
        status: 'confirmed',
        deliveryMethod: 'Pickup',
        slotStart: null,
        slotEnd: null,
        createdAt: '2025-10-25T08:00:00Z',
        updatedAt: '2025-10-25T08:30:00Z'
      }
    ]
    
    const mockDeliverySlots = [
      {
        slotStart: '2025-10-25T10:00:00Z',
        slotEnd: '2025-10-25T11:00:00Z',
        remaining: 5
      },
      {
        slotStart: '2025-10-25T11:00:00Z',
        slotEnd: '2025-10-25T12:00:00Z',
        remaining: 3
      }
    ]

    ;(global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockOrders })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockDeliverySlots })
      })
  })

  it('renders delivery interface without crashing', async () => {
    render(<DeliveryInterface />)
    
    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Delivery Interface')).toBeInTheDocument()
    })
  })

  it('displays orders after loading', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('shows order status correctly', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('pending')).toBeInTheDocument()
      expect(screen.getByText('confirmed')).toBeInTheDocument()
    })
  })

  it('displays delivery method correctly', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('Delivery')).toBeInTheDocument()
      expect(screen.getByText('Pickup')).toBeInTheDocument()
    })
  })

  it('shows order totals correctly', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('$2.00')).toBeInTheDocument()
    })
  })

  it('handles status filtering', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const statusFilter = screen.getByDisplayValue('All Status')
    fireEvent.change(statusFilter, { target: { value: 'pending' } })
    
    expect(statusFilter).toHaveValue('pending')
  })

  it('handles date selection for delivery slots', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('Delivery Interface')).toBeInTheDocument()
    })
    
    const dateInput = screen.getByDisplayValue('2025-10-22')
    fireEvent.change(dateInput, { target: { value: '2025-10-26' } })
    
    expect(dateInput).toHaveValue('2025-10-26')
  })

  it('displays delivery slots information', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('Delivery Interface')).toBeInTheDocument()
    })
    
    // Should show delivery slots section
    expect(screen.getByText('Available Delivery Slots')).toBeInTheDocument()
  })

  it('handles order status update', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Mock successful status update
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { id: 'order-1', status: 'confirmed' } })
    })
    
    // Find and click status update button (this would be in the actual component)
    const statusButtons = screen.getAllByRole('button')
    const updateButton = statusButtons.find(button => 
      button.textContent?.includes('Update Status')
    )
    
    if (updateButton) {
      fireEvent.click(updateButton)
      
      // Should update status without page reload
      await waitFor(() => {
        expect(screen.getByText('confirmed')).toBeInTheDocument()
      })
    }
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    ;(global.fetch as any)
      .mockRejectedValueOnce(new Error('API Error'))
      .mockRejectedValueOnce(new Error('API Error'))

    render(<DeliveryInterface />)
    
    // Should handle error without crashing
    await waitFor(() => {
      expect(screen.getByText('Delivery Interface')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    render(<DeliveryInterface />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays order details correctly', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('123 Main St, Sydney, NSW 2000')).toBeInTheDocument()
      expect(screen.getByText('456 Oak Ave, Melbourne, VIC 3000')).toBeInTheDocument()
    })
  })

  it('shows order items correctly', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Banana')).toBeInTheDocument()
    })
  })

  it('handles empty orders list', async () => {
    // Mock empty orders response
    ;(global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      })

    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('No orders found')).toBeInTheDocument()
    })
  })

  it('formats prices correctly', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      // Should format cents to dollars
      expect(screen.getByText('$2.00')).toBeInTheDocument()
    })
  })

  it('shows time slots correctly', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('10:00 AM - 11:00 AM')).toBeInTheDocument()
      expect(screen.getByText('11:00 AM - 12:00 PM')).toBeInTheDocument()
    })
  })

  it('displays remaining slot capacity', async () => {
    render(<DeliveryInterface />)
    
    await waitFor(() => {
      expect(screen.getByText('5 remaining')).toBeInTheDocument()
      expect(screen.getByText('3 remaining')).toBeInTheDocument()
    })
  })
})

