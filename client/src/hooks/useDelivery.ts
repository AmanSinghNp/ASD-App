import { useState, useMemo } from 'react';
import { AdminController } from '../controllers/AdminController';
import type { Order, DeliverySlot } from '../models/AdminModel';

export const useDelivery = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortOption, setSortOption] = useState<{ by: string, ascending: boolean }>({ 
    by: 'date', 
    ascending: false 
  });

  const controller = useMemo(() => new AdminController(), []);

  // Get filtered orders using useMemo for performance
  const orders = useMemo(() => {
    return controller.getFilteredOrders({
      searchQuery,
      status: selectedStatus,
      sortBy: sortOption.by,
      ascending: sortOption.ascending
    });
  }, [searchQuery, selectedStatus, sortOption, controller]);

  // Get delivery slots for selected date
  const deliverySlots = useMemo(() => {
    return controller.getDeliverySlotsForDate(selectedDate);
  }, [selectedDate, controller]);

  // Status options for filtering
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest First)' },
    { value: 'date-asc', label: 'Date (Oldest First)' },
    { value: 'total-desc', label: 'Total (Highest First)' },
    { value: 'total-asc', label: 'Total (Lowest First)' },
    { value: 'customer-asc', label: 'Customer (A-Z)' },
    { value: 'customer-desc', label: 'Customer (Z-A)' }
  ];

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    return controller.updateOrderStatus(orderId, newStatus);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSortOption({ by: 'date', ascending: false });
  };

  // Get orders by status for quick stats
  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  // Get delivery statistics
  const getDeliveryStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = getOrdersByStatus('pending').length;
    const preparingOrders = getOrdersByStatus('preparing').length;
    const outForDeliveryOrders = getOrdersByStatus('out_for_delivery').length;
    const deliveredOrders = getOrdersByStatus('delivered').length;

    return {
      totalOrders,
      pendingOrders,
      preparingOrders,
      outForDeliveryOrders,
      deliveredOrders
    };
  };

  return {
    // Data
    orders,
    deliverySlots,
    
    // Filters
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedDate,
    setSelectedDate,
    sortOption,
    setSortOption,
    
    // Options
    statusOptions,
    sortOptions,
    
    // Actions
    updateOrderStatus,
    clearFilters,
    getOrdersByStatus,
    getDeliveryStats
  };
};
