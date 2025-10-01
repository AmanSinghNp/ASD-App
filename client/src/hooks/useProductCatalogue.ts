// client/src/hooks/useProductCatalogue.ts



import { useState, useMemo } from 'react';

import { ProductController } from '../controllers/ProductCatalogueController';

import type { Product } from '../models/ProductCatalogueModel';



export const useProductCatalogue = () => {

  // These states represent the filters that are currently APPLIED

  const [appliedCategory, setAppliedCategory] = useState<string>('all');

  const [appliedSort, setAppliedSort] = useState<{ by: string, ascending: boolean }>({ by: 'name', ascending: true });

  const [appliedQuery, setAppliedQuery] = useState<string>('');

  

  // This state is ONLY for the live text in the input box

  const [inputValue, setInputValue] = useState('');

  const [suggestions, setSuggestions] = useState<Product[]>([]);



  const controller = useMemo(() => new ProductController(), []);

  const categories = controller.getAllCategories();

  

  // This is now the SINGLE source of truth for the displayed products.

  // It recalculates ONLY when one of the APPLIED filters changes. This fixes the re-render loop.

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

  }, [appliedCategory, appliedSort, appliedQuery, controller]);



  // This function is now ONLY for generating suggestions.

  const generateSuggestions = (query: string) => {

    setInputValue(query); // Update the live input value

    const lowerCaseQuery = query.toLowerCase();



    if (lowerCaseQuery.length > 0) {

      const allProducts = controller.getAllProducts();

      

      const filteredSuggestions = allProducts.filter((product: Product) => {

        const lowerCaseName = product.name.toLowerCase();

        if (lowerCaseQuery.length === 1) {

          return lowerCaseName.startsWith(lowerCaseQuery);

        }

        return lowerCaseName.includes(lowerCaseQuery);

      }).slice(0, 5);

      

      setSuggestions(filteredSuggestions);

    } else {

      setSuggestions([]);

    }

  };

  

  return {

    products,

    categories,

    suggestions,

    setSuggestions,

    inputValue,

    generateSuggestions,

    // Functions to apply the filters

    setAppliedCategory,

    setAppliedSort,

    setAppliedQuery,
    appliedQuery,

  };

};