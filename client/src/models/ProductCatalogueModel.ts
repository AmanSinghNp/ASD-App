export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  stock: number;
  rating?: number;
}

export interface Category {
  id: string;
  name: string;
}

// Product Lists
const productLists: Product[] = [
  {
    id: "1",
    name: "Organic Apples",
    price: 4.99,
    description: "Fresh organic apples from local farms",
    category: "fruits",
    imageUrl: "/images/apples.jpg",
    stock: 50,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Bananas",
    price: 2.99,
    description: "Sweet yellow bananas",
    category: "fruits",
    imageUrl: "/images/bananas.jpg",
    stock: 75,
    rating: 4.2,
  },
  {
    id: "3",
    name: "Milk",
    price: 3.49,
    description: "Fresh whole milk",
    category: "dairy",
    imageUrl: "/images/milk.jpg",
    stock: 30,
    rating: 4.0,
  },
  {
    id: "4",
    name: "Cheese",
    price: 5.99,
    description: "Aged cheddar cheese",
    category: "dairy",
    imageUrl: "/images/cheese.jpg",
    stock: 25,
    rating: 4.7,
  },
  {
    id: "5",
    name: "Bread",
    price: 2.49,
    description: "Whole grain bread",
    category: "bakery",
    imageUrl: "/images/bread.jpg",
    stock: 40,
    rating: 4.3,
  },
  {
    id: "6",
    name: "Carrots",
    price: 1.99,
    description: "Fresh organic carrots",
    category: "vegetables",
    imageUrl: "/images/carrots.jpg",
    stock: 60,
    rating: 4.1,
  },
  {
    id: "7",
    name: "Yogurt",
    price: 3.99,
    description: "Greek yogurt",
    category: "dairy",
    imageUrl: "/images/yogurt.jpg",
    stock: 35,
    rating: 4.4,
  },
];

const categories: Category[] = [
  { id: "fruits", name: "Fruits" },
  { id: "dairy", name: "Dairy" },
  { id: "bakery", name: "Bakery" },
  { id: "vegetables", name: "Vegetables" },
];

export class ProductCatalogueModel {
  private static instance: ProductCatalogueModel;

  private constructor() {
    // Private constructor to enforce singleton
  }

  static getInstance(): ProductCatalogueModel {
    if (!ProductCatalogueModel.instance) {
      ProductCatalogueModel.instance = new ProductCatalogueModel();
    }
    return ProductCatalogueModel.instance;
  }

  getProductsByCategory(categoryId: string): Product[] {
    if (categoryId === "all") return productLists;
    return productLists.filter((product) => product.category === categoryId);
  }

  getProductDetails(productId: string): Product | undefined {
    return productLists.find((product) => product.id === productId);
  }

  sortProducts(
    products: Product[],
    sortBy: string,
    ascending: boolean = true
  ): Product[] {
    const sortedProducts = [...products];
    switch (sortBy) {
      case "price":
        sortedProducts.sort((a, b) =>
          ascending ? a.price - b.price : b.price - a.price
        );
        break;
      case "name":
        sortedProducts.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (ascending) return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
        });
        break;
      case "rating":
        sortedProducts.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ascending ? ratingA - ratingB : ratingB - ratingA;
        });
        break;
      default:
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sortedProducts;
  }

  getAllCategories(): Category[] {
    return categories;
  }

  searchProducts(query: string): Product[] {
    const q = query.toLowerCase();
    return productLists.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q)
    );
  }

  getAllProducts(): Product[] {
    return productLists;
  }
}
