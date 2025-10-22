/**
 * Product Form Test
 * Tests the ProductForm component functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductForm from '../components/admin/ProductForm';

// Mock the AdminController
vi.mock('../controllers/AdminController', () => ({
  AdminController: vi.fn().mockImplementation(() => ({
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
  })),
}));

describe('ProductForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form for new product', () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isOpen={true}
      />
    );

    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByLabelText('Product Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('SKU *')).toBeInTheDocument();
    expect(screen.getByLabelText('Category *')).toBeInTheDocument();
    expect(screen.getByLabelText('Price ($) *')).toBeInTheDocument();
    expect(screen.getByLabelText('Stock Quantity *')).toBeInTheDocument();
    expect(screen.getByLabelText('Image URL *')).toBeInTheDocument();
  });

  it('renders form for editing existing product', () => {
    const existingProduct = {
      id: 'PROD-TEST-001',
      sku: 'TEST-001',
      name: 'Test Product',
      category: 'Fruits',
      priceCents: 500,
      stockQty: 10,
      imageUrl: 'https://example.com/image.jpg',
      isActive: true,
      description: 'Test description',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    };

    render(
      <ProductForm
        product={existingProduct}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isOpen={true}
      />
    );

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TEST-001')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isOpen={true}
      />
    );

    const saveButton = screen.getByText('Save Product');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Product name is required')).toBeInTheDocument();
      expect(screen.getByText('Category is required')).toBeInTheDocument();
      expect(screen.getByText('Price must be greater than 0')).toBeInTheDocument();
      expect(screen.getByText('Image URL is required')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onSave with correct data when form is valid', async () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isOpen={true}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Product Name *'), {
      target: { value: 'New Product' }
    });
    fireEvent.change(screen.getByLabelText('Category *'), {
      target: { value: 'Fruits' }
    });
    fireEvent.change(screen.getByLabelText('Price ($) *'), {
      target: { value: '5.99' }
    });
    fireEvent.change(screen.getByLabelText('Stock Quantity *'), {
      target: { value: '20' }
    });
    fireEvent.change(screen.getByLabelText('Image URL *'), {
      target: { value: 'https://example.com/image.jpg' }
    });

    const saveButton = screen.getByText('Save Product');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        id: '',
        sku: expect.stringMatching(/^FRU-NEWPRO-.*/),
        name: 'New Product',
        category: 'Fruits',
        priceCents: 599,
        stockQty: 20,
        imageUrl: 'https://example.com/image.jpg',
        isActive: true,
        description: ''
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isOpen={true}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('auto-generates SKU from product name and category', async () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isOpen={true}
      />
    );

    fireEvent.change(screen.getByLabelText('Product Name *'), {
      target: { value: 'Apple Gala' }
    });
    fireEvent.change(screen.getByLabelText('Category *'), {
      target: { value: 'Fruits' }
    });

    await waitFor(() => {
      const skuInput = screen.getByLabelText('SKU *') as HTMLInputElement;
      expect(skuInput.value).toMatch(/^FRU-APPGAL-.*/);
    });
  });

  it('does not render when isOpen is false', () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isOpen={false}
      />
    );

    expect(screen.queryByText('Add New Product')).not.toBeInTheDocument();
  });
});
