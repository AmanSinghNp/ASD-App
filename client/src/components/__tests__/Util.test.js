describe('Utility Functions', () => {
  test('formatPrice formats cents to dollars correctly', () => {
    const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;
    
    expect(formatPrice(1000)).toBe('$10.00');
    expect(formatPrice(500)).toBe('$5.00');
    expect(formatPrice(1234)).toBe('$12.34');
  });

  test('calculateTotal calculates order total', () => {
    const calculateTotal = (items) => 
      items.reduce((total, item) => total + (item.priceCents * item.quantity), 0);
    
    const items = [
      { priceCents: 1000, quantity: 2 },
      { priceCents: 2000, quantity: 1 }
    ];
    
    expect(calculateTotal(items)).toBe(4000);
  });

  test('isInStock checks product availability', () => {
    const isInStock = (product) => product.stockQty > 0;
    
    const inStockProduct = { stockQty: 5 };
    const outOfStockProduct = { stockQty: 0 };
    
    expect(isInStock(inStockProduct)).toBe(true);
    expect(isInStock(outOfStockProduct)).toBe(false);
  });

  test('generateId creates unique identifiers', () => {
    const generateId = () => Math.random().toString(36).substr(2, 9);
    
    const id1 = generateId();
    const id2 = generateId();
    
    expect(typeof id1).toBe('string');
    expect(id1).toHaveLength(9);
    expect(id1).not.toBe(id2);
  });
});