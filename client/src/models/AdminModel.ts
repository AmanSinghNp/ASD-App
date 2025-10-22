import ordersData from '../lib/mock/orders.json';
import analyticsData from '../lib/mock/analytics.json';
import deliverySlotsData from '../lib/mock/deliverySlots.json';
import productsData from '../lib/mock/products.json';

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryMethod: 'Delivery' | 'Pickup';
  slotStart?: string;
  slotEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliverySlot {
  slotStart: string;
  slotEnd: string;
  remaining: number;
}

export interface Analytics {
  sales: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    growthRate: number;
  };
  products: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    topSelling: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }>;
  };
  orders: {
    statusDistribution: Record<string, number>;
    deliveryMethod: Record<string, number>;
  };
  timeRange: {
    startDate: string;
    endDate: string;
  };
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  priceCents: number;
  stockQty: number;
  imageUrl: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

let globalAdminModel: AdminModel | null = null;

export class AdminModel {
  private orders: Order[];
  private analytics: Analytics;
  private deliverySlots: DeliverySlot[];
  private products: Product[];

  constructor() {
    // Deep copy to avoid mutation of the imported JSON
    this.orders = (ordersData as Order[]).map(o => ({ ...o }));
    this.analytics = { ...analyticsData } as Analytics;
    this.deliverySlots = (deliverySlotsData as DeliverySlot[]).map(s => ({ ...s }));
    this.products = (productsData as Product[]).map(p => ({ ...p }));
  }

  static getInstance(): AdminModel {
    if (!globalAdminModel) {
      globalAdminModel = new AdminModel();
    }
    return globalAdminModel;
  }

  // Orders
  getAllOrders(): Order[] {
    return this.orders;
  }

  getOrdersByStatus(status: string): Order[] {
    if (!status) return this.orders;
    return this.orders.filter(order => order.status === status);
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Analytics
  getAnalytics(): Analytics {
    return this.analytics;
  }

  getAnalyticsForDateRange(startDate: string, endDate: string): Analytics {
    // For simplicity, return the same analytics data
    // In a real app, this would filter by date range
    return this.analytics;
  }

  // Delivery Slots
  getDeliverySlots(): DeliverySlot[] {
    return this.deliverySlots;
  }

  getDeliverySlotsForDate(date: string): DeliverySlot[] {
    // For simplicity, return the same slots for any date
    // In a real app, this would filter by date
    return this.deliverySlots;
  }

  // Search and Filter
  searchOrders(query: string): Order[] {
    const lowerCaseQuery = query.toLowerCase();
    return this.orders.filter(order =>
      order.customerName.toLowerCase().includes(lowerCaseQuery) ||
      order.email.toLowerCase().includes(lowerCaseQuery) ||
      order.id.toLowerCase().includes(lowerCaseQuery)
    );
  }

  filterOrdersByDeliveryMethod(method: string): Order[] {
    if (!method) return this.orders;
    return this.orders.filter(order => order.deliveryMethod === method);
  }

  // Sorting
  sortOrders(orders: Order[], sortBy: string, ascending: boolean = true): Order[] {
    const sortedOrders = [...orders];
    switch (sortBy) {
      case 'date':
        sortedOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return ascending ? dateA - dateB : dateB - dateA;
        });
        break;
      case 'total':
        sortedOrders.sort((a, b) => ascending ? a.total - b.total : b.total - a.total);
        break;
      case 'customer':
        sortedOrders.sort((a, b) => a.customerName.localeCompare(b.customerName));
        if (!ascending) sortedOrders.reverse();
        break;
      case 'status':
        sortedOrders.sort((a, b) => a.status.localeCompare(b.status));
        if (!ascending) sortedOrders.reverse();
        break;
      default:
        sortedOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return sortedOrders;
  }

  // Products
  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getProductBySku(sku: string): Product | undefined {
    return this.products.find(product => product.sku === sku);
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...productData,
      id: productData.sku, // Use SKU as ID for consistency
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      return null;
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString()
    };

    return this.products[productIndex];
  }

  deleteProduct(id: string): boolean {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      return false;
    }

    this.products.splice(productIndex, 1);
    return true;
  }

  searchProducts(query: string): Product[] {
    const lowerCaseQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.sku.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
  }

  getProductsByCategory(category: string): Product[] {
    if (!category || category === 'all') return this.products;
    return this.products.filter(product => product.category === category);
  }

  getActiveProducts(): Product[] {
    return this.products.filter(product => product.isActive);
  }

  getLowStockProducts(threshold: number = 10): Product[] {
    return this.products.filter(product => product.stockQty <= threshold);
  }

  // Product sorting
  sortProducts(products: Product[], sortBy: string, ascending: boolean = true): Product[] {
    const sortedProducts = [...products];
    switch (sortBy) {
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        if (!ascending) sortedProducts.reverse();
        break;
      case 'price':
        sortedProducts.sort((a, b) => ascending ? a.priceCents - b.priceCents : b.priceCents - a.priceCents);
        break;
      case 'stock':
        sortedProducts.sort((a, b) => ascending ? a.stockQty - b.stockQty : b.stockQty - a.stockQty);
        break;
      case 'category':
        sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
        if (!ascending) sortedProducts.reverse();
        break;
      case 'created':
        sortedProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return ascending ? dateA - dateB : dateB - dateA;
        });
        break;
      default:
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sortedProducts;
  }
}
