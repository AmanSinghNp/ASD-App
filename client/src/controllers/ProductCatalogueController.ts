
import { ProductCatalogueModel } from '../models/ProductCatalogueModel';
import type { Product } from '../models/ProductCatalogueModel'; // Ensure Product type is imported

export class ProductController {
  private model: ProductCatalogueModel;

  constructor() {
    this.model = ProductCatalogueModel.getInstance();
  }

  getProductsByCategory(categoryId: string) {
    try {
      return this.model.getProductsByCategory(categoryId);
    } catch (error) {
      console.error('Error getting products by category:', error);
      return [];
    }
  }

  getProductDetails(productId: string) {
    try {
      return this.model.getProductDetails(productId);
    } catch (error) {
      console.error('Error getting product details:', error);
      return null;
    }
  }

  // Ensure the 'products' parameter is correctly typed as Product[]
  sortProducts(products: Product[], sortBy: string, ascending: boolean = true) {
    try {
      return this.model.sortProducts(products, sortBy, ascending);
    } catch (error) {
      console.error('Error sorting products:', error);
      return products;
    }
  }

  getAllCategories() {
    try {
      return this.model.getAllCategories();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  searchProducts(query: string) {
    try {
      return this.model.searchProducts(query);
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  getAllProducts() {
    try {
      return this.model.getAllProducts();
    } catch (error) {
      console.error('Error getting all products:', error);
      return [];
    }
  }
}