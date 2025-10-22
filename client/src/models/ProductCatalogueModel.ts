
import type { ReactNode } from 'react';
import productsData from '../lib/mock/products.json';

export interface Product {
  description: ReactNode;
  stock: number;
  price: number;
  id: string;
  sku: string;
  name: string;
  category: string;
  priceCents: number;
  stockQty: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}


let globalProductCatalogueModel: ProductCatalogueModel | null = null;

export class ProductCatalogueModel {
  private products: Product[];
  private categories: Category[];

  private static instance: ProductCatalogueModel;

  constructor() {
    // Deep copy to avoid mutation of the imported JSON
    this.products = (productsData as Product[]).map(p => ({ ...p }));
    this.categories = this.extractCategories();
  }

  static getInstance(): ProductCatalogueModel {
    // if (!globalProductCatalogueModel) {
    //   globalProductCatalogueModel = new ProductCatalogueModel();
    // }
    // return globalProductCatalogueModel;
    if (!ProductCatalogueModel.instance) {
      ProductCatalogueModel.instance = new ProductCatalogueModel();
    }
    return ProductCatalogueModel.instance;
  }

  private extractCategories(): Category[] {
    const unique = Array.from(new Set(this.products.map(p => p.category)));
    return unique.map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) }));
  }

  getProductsByCategory(categoryId: string): Product[] {
    if (categoryId === 'all') return this.products;
    return this.products.filter(product => product.category === categoryId);
  }

  getProductDetails(productId: string): Product | undefined {
    return this.products.find(product => product.id === productId);
  }

  sortProducts(products: Product[], sortBy: string, ascending: boolean = true): Product[] {
    const sortedProducts = [...products];
    switch (sortBy) {
      case 'price':
        sortedProducts.sort((a, b) => ascending ? a.priceCents - b.priceCents : b.priceCents - a.priceCents);
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        if (!ascending) sortedProducts.reverse();
        break;
      default:
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sortedProducts;
  }

  getAllCategories(): Category[] {
    return [{ id: 'all', name: 'All Categories' }, ...this.categories];
  }

  searchProducts(query: string): Product[] {
    const lowerCaseQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery)
    );
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  // Decrement stock when added to cart
  decrementStock(productId: string, quantity: number = 1): boolean {
    const product = this.products.find(p => p.id === productId);
    if (product && product.stockQty >= quantity) {
      product.stockQty -= quantity;
      return true;
    }
    return false;
  }
}