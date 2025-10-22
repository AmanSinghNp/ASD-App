import { AdminModel, type Order, type DeliverySlot, type Analytics, type Product } from '../models/AdminModel';

export class AdminController {
  private model: AdminModel;

  constructor() {
    this.model = AdminModel.getInstance();
  }

  // Orders
  getAllOrders(): Order[] {
    return this.model.getAllOrders();
  }

  getOrdersByStatus(status: string): Order[] {
    return this.model.getOrdersByStatus(status);
  }

  getOrderById(id: string): Order | undefined {
    return this.model.getOrderById(id);
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): boolean {
    return this.model.updateOrderStatus(orderId, newStatus);
  }

  searchOrders(query: string): Order[] {
    return this.model.searchOrders(query);
  }

  filterOrdersByDeliveryMethod(method: string): Order[] {
    return this.model.filterOrdersByDeliveryMethod(method);
  }

  sortOrders(orders: Order[], sortBy: string, ascending: boolean = true): Order[] {
    return this.model.sortOrders(orders, sortBy, ascending);
  }

  // Analytics
  getAnalytics(): Analytics {
    return this.model.getAnalytics();
  }

  getAnalyticsForDateRange(startDate: string, endDate: string): Analytics {
    return this.model.getAnalyticsForDateRange(startDate, endDate);
  }

  // Delivery Slots
  getDeliverySlots(): DeliverySlot[] {
    return this.model.getDeliverySlots();
  }

  getDeliverySlotsForDate(date: string): DeliverySlot[] {
    return this.model.getDeliverySlotsForDate(date);
  }

  // Combined filtering and sorting
  getFilteredOrders(filters: {
    searchQuery?: string;
    status?: string;
    deliveryMethod?: string;
    sortBy?: string;
    ascending?: boolean;
  }): Order[] {
    let orders = this.getAllOrders();

    if (filters.searchQuery) {
      orders = this.searchOrders(filters.searchQuery);
    }

    if (filters.status) {
      orders = this.getOrdersByStatus(filters.status);
    }

    if (filters.deliveryMethod) {
      orders = this.filterOrdersByDeliveryMethod(filters.deliveryMethod);
    }

    if (filters.sortBy) {
      orders = this.sortOrders(orders, filters.sortBy, filters.ascending);
    }

    return orders;
  }

  // Products
  getAllProducts(): Product[] {
    return this.model.getAllProducts();
  }

  getProductById(id: string): Product | undefined {
    return this.model.getProductById(id);
  }

  getProductBySku(sku: string): Product | undefined {
    return this.model.getProductBySku(sku);
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    return this.model.createProduct(productData);
  }

  updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
    return this.model.updateProduct(id, productData);
  }

  deleteProduct(id: string): boolean {
    return this.model.deleteProduct(id);
  }

  searchProducts(query: string): Product[] {
    return this.model.searchProducts(query);
  }

  getProductsByCategory(category: string): Product[] {
    return this.model.getProductsByCategory(category);
  }

  getActiveProducts(): Product[] {
    return this.model.getActiveProducts();
  }

  getLowStockProducts(threshold: number = 10): Product[] {
    return this.model.getLowStockProducts(threshold);
  }

  sortProducts(products: Product[], sortBy: string, ascending: boolean = true): Product[] {
    return this.model.sortProducts(products, sortBy, ascending);
  }

  // Combined product filtering and sorting
  getFilteredProducts(filters: {
    searchQuery?: string;
    category?: string;
    isActive?: boolean;
    sortBy?: string;
    ascending?: boolean;
  }): Product[] {
    let products = this.getAllProducts();

    if (filters.searchQuery) {
      products = this.searchProducts(filters.searchQuery);
    }

    if (filters.category) {
      products = this.getProductsByCategory(filters.category);
    }

    if (filters.isActive !== undefined) {
      products = products.filter(product => product.isActive === filters.isActive);
    }

    if (filters.sortBy) {
      products = this.sortProducts(products, filters.sortBy, filters.ascending);
    }

    return products;
  }
}
