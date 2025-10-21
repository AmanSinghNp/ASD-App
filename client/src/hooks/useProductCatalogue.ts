import { useState, useMemo } from 'react';
import { ProductController } from '../controllers/ProductCatalogueController';
import { useCartContext } from '../context/CartContext';

export const useProductCatalogue = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<{ by: string, ascending: boolean }>({ 
    by: 'name', 
    ascending: true 
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { cartUpdated } = useCartContext();

  const controller = useMemo(() => new ProductController(), []);

  const categories = controller.getAllCategories();

  const products = useMemo(() => {
    let filteredProducts = selectedCategory === 'all' 
      ? controller.getProductsByCategory('all')
      : controller.getProductsByCategory(selectedCategory);

    if (searchQuery) {
      filteredProducts = controller.searchProducts(searchQuery);
    }

    return controller.sortProducts(filteredProducts, sortOption.by, sortOption.ascending);
  }, [selectedCategory, sortOption, searchQuery, controller, cartUpdated]);

  return {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery
  };
};