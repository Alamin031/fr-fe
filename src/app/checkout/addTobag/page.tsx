'use client'
import React from 'react';
import Image from 'next/image';
import { useaddtobagStore } from '../../../../store/store';

const AddToCheckout = () => {
  // Access the order array from the Zustand store
  const { order } = useaddtobagStore();

  console.log('order', order);

  // 1. Calculate the total price
  // The reduce method sums up the 'price' property of every item in the 'order' array.
  const totalPrice = order.reduce((sum, item) => sum + item.price, 0);

  // 2. Function for the "Order Now" button click handler
  const handleOrderNow = () => {
    // This is a placeholder action. In a real application, you would
    // navigate to a payment gateway, submit the order to a backend API, etc.
    alert('Proceeding to checkout for a total of ৳' + totalPrice.toFixed(2));
  };

  return (
    <div className="p-4 max-sm:pb-30">
      <h2 className="text-xl font-semibold mb-4">Checkout Items</h2>

      {/* --- Items List --- */}
      <div className="space-y-4">
        {order?.length > 0 ? (
          order.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border p-3 rounded-lg shadow-sm"
            >
              <Image
                src={item.image}
                alt={item.productName}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <h3 className="font-medium">{item.productName}</h3>
                <p> {item.storage}</p>
                {item.color && <p>Color: {item.color}</p>}
                {item.dynamicInputs?.variant && (
                  <p>Variant: {item.dynamicInputs.variant}</p>
                )}
                <p className="font-semibold text-green-600">৳{item.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No items in your order.</p>
        )}
      </div>

      {/* --- Total Price and Order Button --- */}
      {order?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
            {/* Total Price Display */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Total Price:</h3>
            <p className="text-xl font-bold text-red-600">৳{totalPrice.toFixed(2)}</p>
          </div>

          {/* Order Now Button */}
          <button
            onClick={handleOrderNow}
            className="w-full bg-black hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Order Now
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCheckout;