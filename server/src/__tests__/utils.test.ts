import { describe, it, expect } from '@jest/globals'

// Simple utility function for testing
export const calculateTotal = (items: Array<{ price: number; quantity: number }>): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

describe('Utility Functions', () => {
  describe('calculateTotal', () => {
    it('calculates total for single item', () => {
      const items = [{ price: 10, quantity: 2 }]
      expect(calculateTotal(items)).toBe(20)
    })

    it('calculates total for multiple items', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 3 },
        { price: 15, quantity: 1 }
      ]
      expect(calculateTotal(items)).toBe(50)
    })

    it('returns 0 for empty array', () => {
      expect(calculateTotal([])).toBe(0)
    })
  })

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('admin@company.org')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })
})
