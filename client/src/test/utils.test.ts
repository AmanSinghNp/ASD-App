import { describe, it, expect } from 'vitest'

// Simple utility function for testing
export const formatPrice = (priceCents: number): string => {
  return `$${(priceCents / 100).toFixed(2)}`
}

describe('Utility Functions', () => {
  it('formats price correctly', () => {
    expect(formatPrice(450)).toBe('$4.50')
    expect(formatPrice(0)).toBe('$0.00')
    expect(formatPrice(1234)).toBe('$12.34')
  })

  it('handles edge cases', () => {
    expect(formatPrice(1)).toBe('$0.01')
    expect(formatPrice(999)).toBe('$9.99')
  })
})
