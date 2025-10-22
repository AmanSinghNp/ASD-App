/**
 * Product Form Component - OPTIMIZED VERSION
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard
 * Description: Complete product form with validation and database integration
 * Last Updated: 2025-10-22
 */

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import type { Product } from '../../types/product';

interface ProductFormData {
  id: string;
  sku: string;
  name: string;
  category: string;
  priceCents: number;
  stockQty: number;
  imageUrl: string;
  isActive: boolean;
  description?: string;
}

interface ProductFormProps {
  product?: Product;
  onSave: (productData: ProductFormData) => void;
  onCancel: () => void;
  isOpen: boolean;
}

interface ValidationErrors {
  sku?: string;
  name?: string;
  category?: string;
  priceCents?: string;
  stockQty?: string;
  imageUrl?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    id: '',
    sku: '',
    name: '',
    category: '',
    priceCents: 0,
    stockQty: 0,
    imageUrl: '',
    isActive: true,
    description: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Categories for the dropdown
  const categories = [
    'Fruits',
    'Vegetables',
    'Dairy',
    'Meat',
    'Bakery',
    'Beverages',
    'Snacks',
    'Pantry',
    'Frozen',
    'Health'
  ];

  // Initialize form data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        priceCents: product.priceCents,
        stockQty: product.stockQty,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
        description: product.description || ''
      });
    } else {
      // Reset form for new product
      setFormData({
        id: '',
        sku: '',
        name: '',
        category: '',
        priceCents: 0,
        stockQty: 0,
        imageUrl: '',
        isActive: true,
        description: ''
      });
    }
    setErrors({});
    setSubmitStatus('idle');
  }, [product, isOpen]);

  // Generate SKU automatically from product name
  const generateSKU = (name: string, category: string): string => {
    if (!name || !category) return '';
    
    const categoryPrefix = category.substring(0, 3).toUpperCase();
    const nameWords = name.split(' ').map(word => word.substring(0, 3).toUpperCase());
    const namePrefix = nameWords.join('');
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${categoryPrefix}-${namePrefix}-${randomSuffix}`;
  };

  // Auto-generate SKU when name or category changes
  useEffect(() => {
    if (formData.name && formData.category && !product) {
      const generatedSKU = generateSKU(formData.name, formData.category);
      setFormData(prev => ({ ...prev, sku: generatedSKU }));
    }
  }, [formData.name, formData.category, product]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    } else if (formData.sku.length < 3) {
      newErrors.sku = 'SKU must be at least 3 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.priceCents <= 0) {
      newErrors.priceCents = 'Price must be greater than 0';
    }

    if (formData.stockQty < 0) {
      newErrors.stockQty = 'Stock quantity cannot be negative';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else {
      // Basic URL validation
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call the onSave function passed from parent
      onSave(formData);
      
      setSubmitStatus('success');
      
      // Close form after successful save
      setTimeout(() => {
        onCancel();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving product:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    
    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#111827' }}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px 24px' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Product Name */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
              {errors.name && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  marginTop: '4px', 
                  color: '#ef4444', 
                  fontSize: '14px' 
                }}>
                  <AlertCircle size={14} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* SKU */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Product SKU (auto-generated)"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${errors.sku ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: product ? 'white' : '#f9fafb'
                }}
                readOnly={!product} // Auto-generated for new products
              />
              {errors.sku && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  marginTop: '4px', 
                  color: '#ef4444', 
                  fontSize: '14px' 
                }}>
                  <AlertCircle size={14} />
                  {errors.sku}
                </div>
              )}
            </div>

            {/* Category and Price Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.category ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    marginTop: '4px', 
                    color: '#ef4444', 
                    fontSize: '14px' 
                  }}>
                    <AlertCircle size={14} />
                    {errors.category}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="priceCents"
                  value={formData.priceCents / 100}
                  onChange={(e) => {
                    const dollarValue = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, priceCents: Math.round(dollarValue * 100) }));
                  }}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.priceCents ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.priceCents && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    marginTop: '4px', 
                    color: '#ef4444', 
                    fontSize: '14px' 
                  }}>
                    <AlertCircle size={14} />
                    {errors.priceCents}
                  </div>
                )}
              </div>
            </div>

            {/* Stock Quantity and Active Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQty"
                  value={formData.stockQty}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.stockQty ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.stockQty && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    marginTop: '4px', 
                    color: '#ef4444', 
                    fontSize: '14px' 
                  }}>
                    <AlertCircle size={14} />
                    {errors.stockQty}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Status
                </label>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb'
                }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    style={{ margin: 0 }}
                  />
                  <span style={{ fontSize: '16px', color: '#374151' }}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Image URL *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${errors.imageUrl ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
              {errors.imageUrl && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  marginTop: '4px', 
                  color: '#ef4444', 
                  fontSize: '14px' 
                }}>
                  <AlertCircle size={14} />
                  {errors.imageUrl}
                </div>
              )}
              {formData.imageUrl && (
                <div style={{ marginTop: '8px' }}>
                  <img
                    src={formData.imageUrl}
                    alt="Product preview"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description (optional)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <CheckCircle size={16} />
              Product saved successfully!
            </div>
          )}

          {submitStatus === 'error' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <AlertCircle size={16} />
              Error saving product. Please try again.
            </div>
          )}

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                background: 'white',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                background: isSubmitting ? '#9ca3af' : '#493aecff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {product ? 'Update Product' : 'Save Product'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* CSS for spinner animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProductForm;