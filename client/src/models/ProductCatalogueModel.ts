export interface Product {
    id: string;
    name: string;
    price: number;
    brand: string;
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
    id: '1',
    name: 'Organic Apples',
    price: 4.99,
    brand: 'FarmFresh',
    description: 'Fresh organic apples from local farms',
    category: 'fruits',
    imageUrl: '/images/apples.jpg',
    stock: 50,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Bananas',
    price: 2.99,
    brand: 'FarmFresh',
    description: 'Sweet yellow bananas',
    category: 'fruits',
    imageUrl: '/images/bananas.jpg',
    stock: 75,
    rating: 4.2
  },
  {
    id: '3',
    name: 'Milk',
    price: 3.49,
    brand: 'DairyLand',
    description: 'Fresh whole milk',
    category: 'dairy',
    imageUrl: '/images/milk.jpg',
    stock: 30,
    rating: 4.0
  },
  {
    id: '4',
    name: 'Cheese',
    price: 5.99,
    brand: 'DairyLand',
    description: 'Aged cheddar cheese',
    category: 'dairy',
    imageUrl: '/images/cheese.jpg',
    stock: 25,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Bread',
    price: 2.49,
    brand: 'Artisan Bakes',
    description: 'Whole grain bread',
    category: 'bakery',
    imageUrl: '/images/bread.jpg',
    stock: 40,
    rating: 4.3
  },
  {
    id: '6',
    name: 'Carrots',
    price: 1.99,
    brand: 'FarmFresh',
    description: 'Fresh organic carrots',
    category: 'vegetables',
    imageUrl: '/images/carrots.jpg',
    stock: 60,
    rating: 4.1
  },
  {
    id: '7',
    name: 'Yogurt',
    price: 3.99,
    brand: 'DairyLand',
    description: 'Greek yogurt',
    category: 'dairy',
    imageUrl: '/images/yogurt.jpg',
    stock: 35,
    rating: 4.4
  },
  {
    id: '8',
    name: '2-Person Camping Tent',
    brand: 'Outdoor Gear',
    price: 129.99,
    description: 'A lightweight and waterproof tent, perfect for weekend camping trips.',
    category: 'outdoors',
    imageUrl: '/images/tent.jpg',
    stock: 18,
    rating: 4.6
  },
  {
    id: '9',
    name: 'Hiking Backpack 50L',
    brand: 'Outdoor Gear',
    price: 89.99,
    description: 'A durable 50-litre backpack with multiple compartments for hiking.',
    category: 'outdoors',
    imageUrl: '/images/backpack.jpg',
    stock: 30,
    rating: 4.4
  },
   {
    id: '10',
    name: 'Non-Stick Frying Pan',
    brand: 'KitchenPro',
    price: 39.99,
    description: 'A 10-inch non-stick frying pan, suitable for all cooktops.',
    category: 'home',
    imageUrl: '/images/pan.jpg',
    stock: 45,
    rating: 4.7
  },
{
    id: '11',
    name: 'Robot Vacuum Cleaner',
    brand: 'CleanBot',
    price: 399.00,
    description: 'An autonomous robot vacuum with smart mapping and app control.',
    category: 'appliances',
    imageUrl: '/images/robot-vacuum.jpg',
    stock: 12,
    rating: 4.5
  },
  {
    id: '12',
    name: 'Organic Carrots',
    brand: 'FarmFresh',
    price: 1.99,
    description: 'A 1kg bag of fresh, sweet organic carrots.',
    category: 'vegetables',
    imageUrl: '/images/carrots.jpg',
    stock: 60,
    rating: 4.1
  },
  {
    id: '13',
    name: 'Greek Yogurt',
    brand: 'DairyLand',
    price: 3.99,
    description: 'A 500g tub of thick and creamy Greek yogurt.',
    category: 'dairy',
    imageUrl: '/images/yogurt.jpg',
    stock: 35,
    rating: 4.4
  },
  {
    id: '14',
    name: 'Espresso Coffee Machine',
    brand: 'KitchenPro',
    price: 199.99,
    description: 'A compact espresso machine with a milk frother.',
    category: 'appliances',
    imageUrl: '/images/coffee-machine.jpg',
    stock: 20,
    rating: 4.6
  },
  {
    id: '15',
    name: 'Yoga Mat',
    brand: 'FitLife',
    price: 29.99,
    description: 'A non-slip, eco-friendly yoga mat for your daily practice.',
    category: 'sports',
    imageUrl: '/images/yoga-mat.jpg',
    stock: 50,
    rating: 4.8
  }



];

const categories: Category[] = [
  { id: 'fruits', name: 'Fruits' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'outdoors', name: 'Outdoors' },
  { id: 'home', name: 'Home Goods' },
  { id: 'appliances', name: 'Appliances' },
  { id: 'sports', name: 'Sports' }
];

export class ProductCatalogueModel {
    // U023 Browse products in categories
    getProductsByCategory(categoryId: string): Product[] {
        if (categoryId === 'all') {
            return productLists;
        }
        return productLists.filter(product => product.category === categoryId);
    }

    // U024: View details of a product
    getProductDetails(productId: string): Product | undefined {
        return productLists.find(product => product.id === productId);
    }

    // U025: Sort products
    sortProducts(products: Product[], sortBy: string, ascending: boolean = true): Product[] {
        const sortedProducts = [...products];

        switch(sortBy) {
            case 'price':
            sortedProducts.sort((a, b) => ascending ? a.price - b.price : b.price - a.price);
            break;

            case 'name':
            sortedProducts.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (ascending) {
                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
                } else {
                return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
                }
            });
            break;

            case 'brand':
              sortedProducts.sort((a, b) => {
                    const brandA = a.brand.toUpperCase();
                    const brandB = b.brand.toUpperCase();
                    if (ascending) {
                        return brandA < brandB ? -1 : brandA > brandB ? 1 : 0;
                    } else {
                        return brandA > brandB ? -1 : brandA < brandB ? 1 : 0;
                    }
                });
                break;

            case 'rating':
            sortedProducts.sort((a, b) => {
                const ratingA = a.rating || 0;
                const ratingB = b.rating || 0;
                return ascending ? ratingA - ratingB : ratingB - ratingA;
            });
            break;

            default:
            // Default sort by name ascending
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        }

        return sortedProducts;
    }

    // Get all categories
    getAllCategories(): Category[] {
        return categories;
    }

    // Search products by name
    searchProducts(query: string): Product[] {
        const lowerCaseQuery = query.toLowerCase();
        return productLists.filter(product => 
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.description.toLowerCase().includes(lowerCaseQuery) ||
            product.brand.toLowerCase().includes(lowerCaseQuery)
        );
    }

    // Get all products (optional helper method)
    getAllProducts(): Product[] {
        return productLists;
    }

}