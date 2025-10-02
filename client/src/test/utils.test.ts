import { describe, it, expect } from 'vitest'

/**
 * Utility functions for testing
 */

// Price calculation utilities
export const formatPrice = (priceCents: number): string => {
  return `$${(priceCents / 100).toFixed(2)}`
}

export const calculateSubtotal = (items: Array<{ price: number }>): number => {
  return items.reduce((total, item) => total + item.price, 0)
}

export const calculateTotal = (subtotal: number, shipping: number = 0): number => {
  return subtotal + shipping
}

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export const validatePostcode = (postcode: string): boolean => {
  return /^\d{4}$/.test(postcode)
}

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

describe('Price Utilities', () => {
  describe('formatPrice', () => {
    it('formats price in cents to dollars', () => {
      expect(formatPrice(1000)).toBe('$10.00')
      expect(formatPrice(1299)).toBe('$12.99')
      expect(formatPrice(0)).toBe('$0.00')
    })

    it('handles large prices correctly', () => {
      expect(formatPrice(100000)).toBe('$1000.00')
      expect(formatPrice(999999)).toBe('$9999.99')
    })
  })

  describe('calculateSubtotal', () => {
    it('calculates subtotal for single item', () => {
      const items = [{ price: 10.99 }]
      expect(calculateSubtotal(items)).toBe(10.99)
    })

    it('calculates subtotal for multiple items', () => {
      const items = [
        { price: 10.99 },
        { price: 5.50 },
        { price: 15.00 }
      ]
      expect(calculateSubtotal(items)).toBe(31.49)
    })

    it('returns 0 for empty array', () => {
      expect(calculateSubtotal([])).toBe(0)
    })
  })

  describe('calculateTotal', () => {
    it('calculates total with shipping', () => {
      expect(calculateTotal(25.00, 5.00)).toBe(30.00)
      expect(calculateTotal(100.00, 15.00)).toBe(115.00)
    })

    it('calculates total without shipping', () => {
      expect(calculateTotal(25.00)).toBe(25.00)
      expect(calculateTotal(0)).toBe(0)
    })
  })
})

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('admin@company.org')).toBe(true)
      expect(validateEmail('user+tag@example.com')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('test..test@example.com')).toBe(false)
    })
  })

  describe('validatePhoneNumber', () => {
    it('validates correct phone numbers', () => {
      expect(validatePhoneNumber('0412345678')).toBe(true)
      expect(validatePhoneNumber('+61412345678')).toBe(true)
      expect(validatePhoneNumber('(04) 1234 5678')).toBe(true)
      expect(validatePhoneNumber('04-1234-5678')).toBe(true)
    })

    it('rejects invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false)
      expect(validatePhoneNumber('abc123')).toBe(false)
      expect(validatePhoneNumber('')).toBe(false)
      expect(validatePhoneNumber('0123456789')).toBe(false) // starts with 0
    })
  })

  describe('validatePostcode', () => {
    it('validates correct postcodes', () => {
      expect(validatePostcode('2000')).toBe(true)
      expect(validatePostcode('3000')).toBe(true)
      expect(validatePostcode('9999')).toBe(true)
    })

    it('rejects invalid postcodes', () => {
      expect(validatePostcode('123')).toBe(false)
      expect(validatePostcode('12345')).toBe(false)
      expect(validatePostcode('abcd')).toBe(false)
      expect(validatePostcode('')).toBe(false)
    })
  })
})

describe('String Utilities', () => {
  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long ...')
    })

    it('returns original text if shorter than max length', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })

    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('')
    })
  })

  describe('capitalizeFirstLetter', () => {
    it('capitalizes first letter and lowercases rest', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello')
      expect(capitalizeFirstLetter('WORLD')).toBe('World')
      expect(capitalizeFirstLetter('tEsT')).toBe('Test')
    })

    it('handles single character', () => {
      expect(capitalizeFirstLetter('a')).toBe('A')
      expect(capitalizeFirstLetter('Z')).toBe('Z')
    })

    it('handles empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('')
    })
  })
})