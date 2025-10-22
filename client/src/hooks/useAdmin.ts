import { useState, useMemo } from 'react';
import { AdminController } from '../controllers/AdminController';
import type { Order, Analytics, DeliverySlot } from '../models/AdminModel';

export const useAdmin = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string>('');
  const [sortOption, setSortOption] = useState<{ by: string, ascending: boolean }>({ 
    by: 'date', 
    ascending: false 
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const controller = useMemo(() => new AdminController(), []);

  // Get filtered orders using useMemo for performance
  const orders = useMemo(() => {
    return controller.getFilteredOrders({
      searchQuery,
      status: selectedStatus,
      deliveryMethod: selectedDeliveryMethod,
      sortBy: sortOption.by,
      ascending: sortOption.ascending
    });
  }, [searchQuery, selectedStatus, selectedDeliveryMethod, sortOption, controller]);

  // Get analytics using useMemo
  const analytics = useMemo(() => {
    return controller.getAnalyticsForDateRange(dateRange.startDate, dateRange.endDate);
  }, [dateRange, controller]);

  // Get delivery slots using useMemo
  const deliverySlots = useMemo(() => {
    return controller.getDeliverySlotsForDate(dateRange.startDate);
  }, [dateRange, controller]);

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

  // Delivery method options
  const deliveryMethodOptions = [
    { value: '', label: 'All Methods' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Pickup', label: 'Pickup' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest First)' },
    { value: 'date-asc', label: 'Date (Oldest First)' },
    { value: 'total-desc', label: 'Total (Highest First)' },
    { value: 'total-asc', label: 'Total (Lowest First)' },
    { value: 'customer-asc', label: 'Customer (A-Z)' },
    { value: 'customer-desc', label: 'Customer (Z-A)' },
    { value: 'status-asc', label: 'Status (A-Z)' },
    { value: 'status-desc', label: 'Status (Z-A)' }
  ];

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    return controller.updateOrderStatus(orderId, newStatus);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedDeliveryMethod('');
    setSortOption({ by: 'date', ascending: false });
  };

  return {
    // Data
    orders,
    analytics,
    deliverySlots,
    
    // Filters
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedDeliveryMethod,
    setSelectedDeliveryMethod,
    sortOption,
    setSortOption,
    dateRange,
    setDateRange,
    
    // Options
    statusOptions,
    deliveryMethodOptions,
    sortOptions,
    
    // Actions
    updateOrderStatus,
    clearFilters
  };
};
