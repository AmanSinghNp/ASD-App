import { describe, it, expect } from 'vitest';
import { ProductCatalogueModel } from '../models/ProductCatalogueModel';

// Test Suite: Describes the tests for "ProductCatalogueModel"
describe('ProductCatalogueModel', () => {
  const model = new ProductCatalogueModel();
  // Test Case 1: Test filtering products by category
  it('should return only products from the "dairy" category', () => {
    // Act: Call the getProductsByCategory method
    const dairyProducts = model.getProductsByCategory('dairy');

    // Assert: Verify that the result meets expectations
    expect(dairyProducts.length).toBe(3);  //There should be 3 dairy products
    // Check if each product actually belongs to the 'dairy' category
    dairyProducts.forEach(product => {
      expect(product.category).toBe('dairy');
    });
  });

  // Test Case 2: Test sorting products by price in ascending order
  it('should sort products by price in ascending order', () => {
    // Arrange: Get all products
    const allProducts = model.getAllProducts();

    // Act: Call the sortProducts method
    const sortedProducts = model.sortProducts(allProducts, 'price', true);

    // Assert: Verify that the result meets expectations
    // Check if the price of the first product is less than or equal to the second
    expect(sortedProducts[0].price).toBeLessThanOrEqual(sortedProducts[1].price);
   // Check if the price of the second-to-last product is less than or equal to the last
    expect(sortedProducts[sortedProducts.length - 2].price).toBeLessThanOrEqual(sortedProducts[sortedProducts.length - 1].price);
    // Ensure the lowest priced "Organic Carrots" ($1.99) is first
    expect(sortedProducts[0].name).toBe('Organic Carrots');
  });
});