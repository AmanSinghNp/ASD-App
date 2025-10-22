import { useState, useMemo } from 'react';
import { AdminController } from '../controllers/AdminController';
import type { Product } from '../models/AdminModel';

export const useAdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<{ by: string, ascending: boolean }>({ 
    by: 'name', 
    ascending: true 
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const controller = useMemo(() => new AdminController(), []);

  // Get all products
  const allProducts = useMemo(() => {
    return controller.getAllProducts();
  }, [controller, refreshTrigger]);

  // Get categories from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)));
    return [
      { id: 'all', name: 'All Categories' },
      ...uniqueCategories.map(cat => ({ id: cat, name: cat }))
    ];
  }, [allProducts]);

  // Get filtered and sorted products
  const products = useMemo(() => {
    return controller.getFilteredProducts({
      searchQuery,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      sortBy: sortOption.by,
      ascending: sortOption.ascending
    });
  }, [searchQuery, selectedCategory, sortOption, controller, refreshTrigger]);

  // Refresh function to trigger data reload
  const refreshProducts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Product management functions
  const createProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct = controller.createProduct(productData);
    refreshProducts();
    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    const updatedProduct = controller.updateProduct(id, productData);
    if (updatedProduct) {
      refreshProducts();
    }
    return updatedProduct;
  };

  const deleteProduct = (id: string) => {
    const success = controller.deleteProduct(id);
    if (success) {
      refreshProducts();
    }
    return success;
  };

  return {
    // Data
    products,
    allProducts,
    categories,
    
    // Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    
    // Actions
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
