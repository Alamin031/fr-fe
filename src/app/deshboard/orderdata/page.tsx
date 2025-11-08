'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  User,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';
import AdminManagementProvider from '@/providers/AdminManagementProvider';

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  district: string;
  upazila: string;
  address: string;
};

type OrderItem = {
  productName: string;
  image: string;
  price: number;
  quantity: number;
  storage?: string;
  RAM?: string;
};

type Order = {
  _id: string;
  customer: Customer;
  orderItems: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
};

const OrderCheckoutUI: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URI}/checkout`
        );
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data: Order[] = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Unknown error occurred');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleDelete = async (orderId: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this order? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeletingOrder(orderId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URI}/checkout/delete/${orderId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete order');

      setOrders((prev) => prev.filter((order) => order._id !== orderId));

      if (expandedOrder === orderId) {
        setExpandedOrder(null);
      }
    } catch (err: any) {
      alert('Failed to delete order: ' + (err.message || 'Unknown error'));
    } finally {
      setDeletingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg max-w-md">
          <h3 className="text-red-800 font-bold text-lg mb-2">
            Error Loading Orders
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminManagementProvider>
       <div className="min-h-screen bg-gray-50 py-8 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">Total Orders: {orders.length}</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500">
              There are no orders to display at the moment.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <React.Fragment key={order._id}>
                      {/* Main row */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                #{order._id.slice(-8).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer.firstName}{' '}
                              {order.customer.lastName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.customer.mobile}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">
                                {order.customer.district}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customer.upazila}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {order.orderItems.length}{' '}
                            {order.orderItems.length === 1 ? 'item' : 'items'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-indigo-600">
                            {formatCurrency(order.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleExpand(order._id)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 transition-colors"
                            >
                              {expandedOrder === order._id ? (
                                <>
                                  <ChevronUp className="h-4 w-4" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" />
                                  View
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(order._id)}
                              disabled={deletingOrder === order._id}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete order"
                            >
                              {deletingOrder === order._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {expandedOrder === order._id && (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 bg-gray-50">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Order items */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  Order Items
                                </h4>
                                <div className="space-y-3">
                                  {order.orderItems.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="bg-white p-4 rounded-lg border border-gray-200"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0">
                                          <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900">
                                            {item.productName}
                                          </div>
                                          <div className="text-sm text-gray-500 mt-1">
                                            {item.storage && (
                                              <span>{item.storage}</span>
                                            )}
                                            {item.RAM && (
                                              <span> • {item.RAM}</span>
                                            )}
                                            <span>
                                              {' '}
                                              • Qty: {item.quantity}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-bold text-indigo-600">
                                            {formatCurrency(item.price)}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            per unit
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping details */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Shipping Details
                                </h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="space-y-3">
                                    <div>
                                      <div className="text-xs text-gray-500 mb-1">
                                        Full Address
                                      </div>
                                      <div className="text-sm text-gray-900">
                                        {order.customer.address}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <div className="text-xs text-gray-500 mb-1">
                                          Upazila
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {order.customer.upazila}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-gray-500 mb-1">
                                          District
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {order.customer.district}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200">
                                      <div className="text-xs text-gray-500 mb-1">
                                        Last Updated
                                      </div>
                                      <div className="text-sm text-gray-900">
                                        {formatDate(order.updatedAt)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>

    </AdminManagementProvider>
   
  );
};

export default OrderCheckoutUI;
