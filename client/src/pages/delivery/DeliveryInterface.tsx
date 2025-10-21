import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, Package, CheckCircle, AlertCircle } from 'lucide-react';

interface Order {
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

interface DeliverySlot {
  slotStart: string;
  slotEnd: string;
  remaining: number;
}

export const DeliveryInterface: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Load orders and delivery slots
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch orders
        const ordersResponse = await fetch('http://localhost:4000/api/orders');
        const ordersData = await ordersResponse.json();
        if (ordersData.data) {
          setOrders(ordersData.data);
        }
        
        // Fetch delivery slots for selected date
        const slotsResponse = await fetch(`http://localhost:4000/api/delivery/slots?date=${selectedDate}`);
        const slotsData = await slotsResponse.json();
        if (slotsData.data) {
          setDeliverySlots(slotsData.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedDate]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
        ));
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'confirmed': return { backgroundColor: 'var(--primary-blue-light)', color: 'var(--primary-blue-dark)' };
      case 'preparing': return { backgroundColor: '#fed7aa', color: '#c2410c' };
      case 'out_for_delivery': return { backgroundColor: '#e9d5ff', color: '#7c3aed' };
      case 'delivered': return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'cancelled': return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default: return { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const filteredOrders = filterStatus 
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      padding: 'var(--spacing-2xl) 0'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--spacing-lg)'
          }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Delivery Interface
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)'
            }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: 'var(--spacing-md)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-blue)';
                  e.target.style.boxShadow = '0 0 0 3px var(--primary-blue-light)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Delivery Slots Overview */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-md)',
            margin: 0
          }}>
            Delivery Slots - {selectedDate}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            {deliverySlots.map((slot, index) => (
              <div key={index} style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-blue-light)';
                e.currentTarget.style.borderColor = 'var(--primary-blue-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {new Date(slot.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(slot.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>
                  {slot.remaining} slots remaining
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)'
          }}>
            <button
              onClick={() => setFilterStatus('')}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                backgroundColor: filterStatus === '' ? 'var(--primary-blue)' : 'var(--bg-tertiary)',
                color: filterStatus === '' ? 'white' : 'var(--text-primary)',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (filterStatus !== '') {
                  e.currentTarget.style.backgroundColor = 'var(--border-color)';
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== '') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }
              }}
            >
              All Orders ({orders.length})
            </button>
            {['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(status => {
              const count = orders.filter(order => order.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    backgroundColor: filterStatus === status ? 'var(--primary-blue)' : 'var(--bg-tertiary)',
                    color: filterStatus === status ? 'white' : 'var(--text-primary)',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                  onMouseEnter={(e) => {
                    if (filterStatus !== status) {
                      e.currentTarget.style.backgroundColor = 'var(--border-color)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filterStatus !== status) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                    }
                  }}
                >
                  {status.replace('_', ' ')} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-tertiary)'
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Orders
            </h2>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div style={{
              padding: 'var(--spacing-2xl)',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <Package style={{
                width: '3rem',
                height: '3rem',
                margin: '0 auto var(--spacing-md)',
                color: 'var(--border-color)'
              }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No orders found</p>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--border-light)' }}>
              {filteredOrders.map((order, index) => (
                <div key={order.id} style={{
                  padding: 'var(--spacing-lg)',
                  borderBottom: index < filteredOrders.length - 1 ? '1px solid var(--border-light)' : 'none',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-lg)'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-sm)'
                      }}>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          margin: 0
                        }}>
                          Order #{order.id}
                        </h3>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          borderRadius: 'var(--radius-lg)',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          ...getStatusColor(order.status)
                        }}>
                          {getStatusIcon(order.status)}
                          <span style={{ marginLeft: 'var(--spacing-xs)', textTransform: 'capitalize' }}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Customer</div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                          <div className="text-sm text-gray-500">{order.phone}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Delivery Details</div>
                          <div className="flex items-center text-sm text-gray-700 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {order.deliveryMethod}
                          </div>
                          {order.deliveryMethod === 'Delivery' && order.slotStart && (
                            <div className="flex items-center text-sm text-gray-700">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(order.slotStart).toLocaleString()}
                            </div>
                          )}
                          <div className="text-sm text-gray-700 mt-1">{order.address}</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">Items</div>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <div className="text-sm text-gray-600 mb-2">Status Actions</div>
                      <div className="space-y-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="w-full px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="w-full px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                            className="w-full px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                          >
                            <Truck className="h-3 w-3 inline mr-1" />
                            Out for Delivery
                          </button>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="w-full px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="w-full px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
