// client/src/hooks/useProductCatalogue.ts

import { useState, useMemo } from 'react';
import { ProductController } from '../controllers/ProductCatalogueController';
import type { Product } from '../models/ProductCatalogueModel';
import { useCartContext } from '../context/CartContext'; // Added from origin/dev

export const useProductCatalogue = () => {
  // --- State Management ---
  
  // These states represent the filters that are currently APPLIED to the product list.
  const [appliedCategory, setAppliedCategory] = useState<string>('all');
  const [appliedSort, setAppliedSort] = useState<{ by: string, ascending: boolean }>({ by: 'name', ascending: true });
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  
  // These states are ONLY for the live search input and its autocomplete suggestions.
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  // This context dependency is from origin/dev. It ensures the product list refreshes when the cart changes.
  const { cartItems } = useCartContext(); 

  const controller = useMemo(() => new ProductController(), []);
  const categories = controller.getAllCategories();

  // This is the SINGLE source of truth for the displayed products.
  // It recalculates ONLY when one of the APPLIED filters or the cart changes.
  // This combines the performance benefit from HEAD and the context feature from origin/dev.
  const products = useMemo(() => {
    let result = appliedCategory === 'all'
      ? controller.getAllProducts()
      : controller.getProductsByCategory(appliedCategory);

    if (appliedQuery) {
      const lowerCaseQuery = appliedQuery.toLowerCase();
      result = result.filter((product: Product) =>
        product.name.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return controller.sortProducts(result, appliedSort.by, appliedSort.ascending);
  }, [appliedCategory, appliedSort, appliedQuery, controller, cartItems]); // Added cartUpdated dependency

  // This function is for generating autocomplete suggestions as the user types.
  const generateSuggestions = (query: string) => {
    setInputValue(query); // Update the live input value for the UI
    const lowerCaseQuery = query.toLowerCase();

    if (lowerCaseQuery.length > 0) {
      const allProducts = controller.getAllProducts();

      const filteredSuggestions = allProducts.filter((product: Product) => {
        const lowerCaseName = product.name.toLowerCase();
        // A simple suggestion logic: starts with for the first letter, includes for more letters
        if (lowerCaseQuery.length === 1) {
          return lowerCaseName.startsWith(lowerCaseQuery);
        }
        return lowerCaseName.includes(lowerCaseQuery);
      }).slice(0, 5); // Limit to 5 suggestions

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // The hook returns all necessary values and functions for the UI components.
  return {
    products,
    categories,
    suggestions,
    setSuggestions,
    inputValue,
    generateSuggestions,
    // Functions to APPLY the filters
    setAppliedCategory,
    setAppliedSort,
    setAppliedQuery,
    appliedQuery, // Expose appliedQuery for UI state if needed
  };
};