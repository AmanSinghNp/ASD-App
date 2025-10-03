import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ProductFormProps, ProductFormData } from '../../types/product';
interface ValidationErrors {
  name?: string;
  sku?: string;
  category?: string;
  priceCents?: string;
  stockQty?: string;
  imageUrl?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    category: '',
    priceCents: 0,
    stockQty: 0,
    imageUrl: '',
    isActive: true
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        sku: initialProduct.sku,
        category: initialProduct.category,
    priceCents: initialProduct.priceCents,
    stockQty: initialProduct.stockQty,
        imageUrl: initialProduct.imageUrl || '',
        isActive: initialProduct.isActive
      });
    }
  }, [initialProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    // const allTouched = Object.keys(formData).reduce((acc, field) => {
    //   acc[field] = true;
    //   return acc;
    // }, {} as Record<string, boolean>);
    // setTouched(allTouched);
    
    // Validate form
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Validation functions
  const validateField = (field: keyof ProductFormData, value: any): string | undefined => {
    switch (field) {
      case 'name':
        if (!value || value.trim().length === 0) {
          return 'Product name is required';
        }
        if (value.trim().length < 2) {
          return 'Product name must be at least 2 characters';
        }
        if (value.trim().length > 100) {
          return 'Product name must be less than 100 characters';
        }
        break;
      
      case 'sku':
        if (!value || value.trim().length === 0) {
          return 'SKU is required';
        }
        if (value.trim().length < 3) {
          return 'SKU must be at least 3 characters';
        }
        if (value.trim().length > 20) {
          return 'SKU must be less than 20 characters';
        }
        if (!/^[A-Z0-9-_]+$/i.test(value.trim())) {
          return 'SKU can only contain letters, numbers, hyphens, and underscores';
        }
        break;
      
      case 'category':
        if (!value || value.trim().length === 0) {
          return 'Category is required';
        }
        break;
      
      case 'priceCents':
        if (value === null || value === undefined || value === '') {
          return 'Price is required';
        }
        const price = Number(value);
        if (isNaN(price) || price < 0) {
          return 'Price must be a positive number';
        }
        if (price > 999999) {
          return 'Price must be less than $9,999.99';
        }
        break;
      
      case 'stockQty':
        if (value === null || value === undefined || value === '') {
          return 'Stock quantity is required';
        }
        const stock = Number(value);
        if (isNaN(stock) || stock < 0) {
          return 'Stock quantity must be a non-negative number';
        }
        if (stock > 99999) {
          return 'Stock quantity must be less than 100,000';
        }
        break;
      
      case 'imageUrl':
        if (value && value.trim().length > 0) {
          try {
            new URL(value.trim());
          } catch {
            return 'Please enter a valid URL';
          }
        }
        break;
      
      default:
        return undefined;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field as keyof ProductFormData, formData[field as keyof ProductFormData]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleBlur = (field: keyof ProductFormData) => {
    // setTouched(prev => ({
    //   ...prev,
    //   [field]: true
    // }));

    // Validate field on blur
    const error = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: 'var(--spacing-md)'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--spacing-2xl)',
        maxWidth: '42rem',
        width: '100%',
        margin: '0 var(--spacing-md)',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {initialProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            style={{
              color: 'var(--text-muted)',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close form"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
            <div>
              <label htmlFor="name" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: `1px solid ${errors.name ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.name ? '#ef4444' : 'var(--primary-blue)';
                  e.target.style.boxShadow = `0 0 0 3px ${errors.name ? '#fecaca' : 'var(--primary-blue-light)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.name ? '#ef4444' : 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                  handleBlur('name');
                }}
                required
              />
              {errors.name && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: 'var(--spacing-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}>
                  <span>⚠</span>
                  {errors.name}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="sku" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: `1px solid ${errors.sku ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.sku ? '#ef4444' : 'var(--primary-blue)';
                  e.target.style.boxShadow = `0 0 0 3px ${errors.sku ? '#fecaca' : 'var(--primary-blue-light)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.sku ? '#ef4444' : 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                  handleBlur('sku');
                }}
                required
              />
              {errors.sku && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: 'var(--spacing-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}>
                  <span>⚠</span>
                  {errors.sku}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="category" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: `1px solid ${errors.category ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.category ? '#ef4444' : 'var(--primary-blue)';
                  e.target.style.boxShadow = `0 0 0 3px ${errors.category ? '#fecaca' : 'var(--primary-blue-light)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.category ? '#ef4444' : 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                  handleBlur('category');
                }}
                required
              >
                <option value="">Select Category</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Pantry">Pantry</option>
                <option value="Bakery">Bakery</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Meat">Meat</option>
              </select>
              {errors.category && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: 'var(--spacing-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}>
                  <span>⚠</span>
                  {errors.category}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="priceCents" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Price (cents) *
              </label>
              <input
                type="number"
                id="priceCents"
                value={formData.priceCents}
                onChange={(e) => handleInputChange('priceCents', parseInt(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: `1px solid ${errors.priceCents ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.priceCents ? '#ef4444' : 'var(--primary-blue)';
                  e.target.style.boxShadow = `0 0 0 3px ${errors.priceCents ? '#fecaca' : 'var(--primary-blue-light)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.priceCents ? '#ef4444' : 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                  handleBlur('priceCents');
                }}
                min="0"
                required
              />
              {errors.priceCents && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: 'var(--spacing-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}>
                  <span>⚠</span>
                  {errors.priceCents}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="stockQty" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stockQty"
                value={formData.stockQty}
                onChange={(e) => handleInputChange('stockQty', parseInt(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: `1px solid ${errors.stockQty ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.stockQty ? '#ef4444' : 'var(--primary-blue)';
                  e.target.style.boxShadow = `0 0 0 3px ${errors.stockQty ? '#fecaca' : 'var(--primary-blue-light)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.stockQty ? '#ef4444' : 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                  handleBlur('stockQty');
                }}
                min="0"
                required
              />
              {errors.stockQty && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: 'var(--spacing-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}>
                  <span>⚠</span>
                  {errors.stockQty}
                </div>
              )}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="imageUrl" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: `1px solid ${errors.imageUrl ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.imageUrl ? '#ef4444' : 'var(--primary-blue)';
                  e.target.style.boxShadow = `0 0 0 3px ${errors.imageUrl ? '#fecaca' : 'var(--primary-blue-light)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.imageUrl ? '#ef4444' : 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                  handleBlur('imageUrl');
                }}
              />
              {errors.imageUrl && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: 'var(--spacing-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}>
                  <span>⚠</span>
                  {errors.imageUrl}
                </div>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)'
          }}>
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              style={{
                width: '1.25rem',
                height: '1.25rem',
                color: 'var(--primary-blue)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
            <label htmlFor="isActive" style={{
              marginLeft: 'var(--spacing-md)',
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}>
              Active Product
            </label>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-lg)',
            borderTop: '1px solid var(--border-light)'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-primary)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: 'var(--primary-blue)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-blue-hover)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-blue)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              {initialProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
