import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Page = async () => {
  let orders = [];
  let error = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/notifylist`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    orders = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    error = err.message;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Product notify</h1>
          <p className="text-sm text-gray-600 mt-1">List of all product orders with customer details</p>
        </div>
        
        {error && (
          <div className="px-6 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error loading data: {error}</p>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700 w-16">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                <TableHead className="font-semibold text-gray-700">Product</TableHead>
                <TableHead className="font-semibold text-gray-700">Options</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Total Price</TableHead>
                <TableHead className="font-semibold text-gray-700">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">No orders found</div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow key={order._id?.$oid || order._id || index} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs text-gray-500">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{order.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.email || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{order.phone || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{order.product || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.selectedOptions ? (
                          <>
                            <div className="text-gray-900">
                              <span className="font-medium">Storage:</span> {order.selectedOptions.storage || 'N/A'}
                            </div>
                            <div className="text-gray-900">
                              <span className="font-medium">Color:</span> {order.selectedOptions.color || 'N/A'}
                            </div>
                            {order.selectedOptions.dynamicInputs && (
                              <div className="text-gray-600 text-xs mt-1">
                                Dynamic: {order.selectedOptions.dynamicInputs.storage || 'N/A'}, {order.selectedOptions.dynamicInputs.veriant || 'N/A'}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500">No options</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {order.totalPrice ? (
                        `$${parseInt(order.totalPrice.$numberInt || order.totalPrice).toLocaleString()}`
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {order.timestamp ? (
                        <>
                          <div className="text-sm text-gray-600">
                            {new Date(order.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(order.timestamp).toLocaleTimeString()}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500">N/A</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;