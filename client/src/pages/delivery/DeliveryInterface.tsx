/**
 * Delivery Interface Component - OPTIMIZED VERSION
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F008 - Delivery
 * Description: Fast, simplified delivery interface using local data (no API calls)
 * Last Updated: 2025-10-22
 */

import React, { useState } from 'react';
import { Truck, MapPin, Clock, Package, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useDelivery } from '../../hooks/useDelivery';

export const DeliveryInterface: React.FC = () => {
  const [activeView, setActiveView] = useState<'orders' | 'slots'>('orders');
  
  const {
    orders,
    deliverySlots,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedDate,
    setSelectedDate,
    statusOptions,
    updateOrderStatus,
    getDeliveryStats
  } = useDelivery();

  const stats = getDeliveryStats();

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle size={16} color="#f59e0b" />;
      case 'confirmed': return <CheckCircle size={16} color="#3b82f6" />;
      case 'preparing': return <Package size={16} color="#f97316" />;
      case 'out_for_delivery': return <Truck size={16} color="#8b5cf6" />;
      case 'delivered': return <CheckCircle size={16} color="#10b981" />;
      case 'cancelled': return <AlertCircle size={16} color="#ef4444" />;
      default: return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'confirmed': return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'preparing': return { backgroundColor: '#fed7aa', color: '#c2410c' };
      case 'out_for_delivery': return { backgroundColor: '#e9d5ff', color: '#7c3aed' };
      case 'delivered': return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'cancelled': return { backgroundColor: '#fee2e2', color: '#dc2626' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div className="delivery-interface" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Delivery Management</h1>
        <p style={{ color: '#666' }}>Manage orders and delivery slots efficiently</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Package size={20} color="#3b82f6" />
            <h3 style={{ margin: '0 0 0 8px', fontSize: '16px' }}>Total Orders</h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#333' }}>
            {stats.totalOrders}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <AlertCircle size={20} color="#f59e0b" />
            <h3 style={{ margin: '0 0 0 8px', fontSize: '16px' }}>Pending</h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#333' }}>
            {stats.pendingOrders}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Truck size={20} color="#8b5cf6" />
            <h3 style={{ margin: '0 0 0 8px', fontSize: '16px' }}>Out for Delivery</h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#333' }}>
            {stats.outForDeliveryOrders}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <CheckCircle size={20} color="#10b981" />
            <h3 style={{ margin: '0 0 0 8px', fontSize: '16px' }}>Delivered</h3>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#333' }}>
            {stats.deliveredOrders}
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <button
          onClick={() => setActiveView('orders')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeView === 'orders' ? '#493aecff' : 'transparent',
            color: activeView === 'orders' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          <Package style={{ marginRight: '8px', display: 'inline' }} />
          Orders
        </button>
        <button
          onClick={() => setActiveView('slots')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeView === 'slots' ? '#493aecff' : 'transparent',
            color: activeView === 'slots' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          <Calendar style={{ marginRight: '8px', display: 'inline' }} />
          Delivery Slots
        </button>
      </div>

      {/* Orders View */}
      {activeView === 'orders' && (
        <div>
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minWidth: '200px'
                }}
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Orders List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '20px',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      {getStatusIcon(order.status)}
                      <h3 style={{ margin: '0 0 0 8px', fontSize: '18px' }}>
                        {order.customerName}
                      </h3>
                      <span
                        style={{
                          marginLeft: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          ...getStatusColor(order.status)
                        }}
                      >
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>
                      Order ID: {order.id}
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>
                      {order.deliveryMethod} • ${order.total.toFixed(2)}
                    </p>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      {order.email} • {order.phone}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        marginBottom: '8px'
                      }}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <MapPin size={16} color="#666" />
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    {order.address}
                  </span>
                </div>

                {order.slotStart && order.slotEnd && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px'
                  }}>
                    <Clock size={16} color="#666" />
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      Delivery Slot: {new Date(order.slotStart).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {new Date(order.slotEnd).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                )}

                {/* Order Items */}
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>Items:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {order.items.map((item, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '14px',
                        color: '#666'
                      }}>
                        <span>{item.name} x {item.quantity}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Slots View */}
      {activeView === 'slots' && (
        <div>
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {deliverySlots.map((slot, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '20px',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Clock size={20} color="#493aecff" />
                  <h3 style={{ margin: '0 0 0 8px', fontSize: '16px' }}>
                    {new Date(slot.slotStart).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {new Date(slot.slotEnd).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </h3>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <Package size={16} color="#666" />
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    {slot.remaining} slots remaining
                  </span>
                </div>
                <div style={{
                  padding: '8px 12px',
                  background: slot.remaining > 0 ? '#d1fae5' : '#fee2e2',
                  color: slot.remaining > 0 ? '#065f46' : '#dc2626',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {slot.remaining > 0 ? 'Available' : 'Full'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};