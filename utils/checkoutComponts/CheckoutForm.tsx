// app/checkout/CheckoutForm.tsx
'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
// import useOrderStore from '../../../store/store'
// import district from '../../../utils/districtData';
import toast, { Toaster } from 'react-hot-toast';
import district from '../districtData';
import useOrderStore from '../../store/store';

const districtData = district;

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  storage?: string;
  RAM?: string;
  sim?: string;
  display?: string;
  region?: string;
  image?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  upazila: string;
}

const CheckoutForm: React.FC = () => {
  const { order }: { order: OrderItem[] } = useOrderStore();

  // You can use searchParams here if needed

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    district: '',
    upazila: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Handler for input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (name === 'district') {
      setFormData((prev) => ({ ...prev, district: value, upazila: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^01[3-9]\d{8}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid BD mobile number (e.g., 01712345678)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.district) {
      newErrors.district = 'Please select a district';
    }

    if (!formData.upazila) {
      newErrors.upazila = 'Please select an upazila';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if order has items
    if (order.length === 0) {
      toast.error('Your cart is empty! Please add items before checkout.', {
        duration: 4000,
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly', {
        duration: 4000,
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Processing your order...');

    // Simulate API call
    const finalData = {
      customer: formData,
      orderItems: order,
      total: totalPrice,
      
      createdAt: new Date().toISOString(),
    };
    
    try {
      const res = await fetch("/api/checkoutpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
  
      if (!res.ok) throw new Error("Failed to place order");
  
      const data = await res.json();
  
      toast.dismiss(loadingToast);
      toast.success(
        `Order confirmed! Thank you ${formData.firstName}. We'll contact you at ${formData.mobile} soon.`,
        { duration: 5000 }
      );
  
      console.log("Saved Order:", data);
  
      // Reset form
      // setFormData({ firstName: "", lastName: "", mobile: "", email: "", address: "", district: "", upazila: "" });
  
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
    // // setTimeout(() => {
    // //   console.log('Final Order Data:', finalData);
      
    // //   // Dismiss loading and show success
    // //   toast.dismiss(loadingToast);
    // //   toast.success(
    // //     `Order confirmed! Thank you ${formData.firstName}. We'll contact you at ${formData.mobile} soon.`,
    // //     {
    // //       duration: 5000,
    // //     }
    // //   );

    //   // Optional: Reset form after successful submission
    //   // setFormData({ firstName: '', lastName: '', mobile: '', email: '', address: '', district: '', upazila: '' });
    // }, 1500);
  };

  // Calculate total price
  const totalPrice = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Add Toaster component */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <form
        className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8"
        onSubmit={handleSubmit}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* User Information Form */}
            <div className="w-full lg:flex-1 lg:max-w-lg">
              <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
                  Customer Information
                </h2>
                
                {/* Show search params info if available */}
                {/* {orderId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Order Reference:</strong> {orderId}
                      {paymentStatus && ` | Status: ${paymentStatus}`}
                    </p>
                  </div>
                )} */}

                <p className="text-sm text-gray-600 text-center mb-4">
                  Please fill in all required fields to complete your order
                </p>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name 
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className={`w-full border rounded-xl px-3 py-2 focus:ring focus:ring-blue-300 ${
                      errors.firstName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name 
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className={`w-full border rounded-xl px-3 py-2 focus:ring focus:ring-blue-300 ${
                      errors.lastName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mobile Number 
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="e.g. 01712345678"
                    className={`w-full border rounded-xl px-3 py-2 focus:ring focus:ring-blue-300 ${
                      errors.mobile ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email 
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={`w-full border rounded-xl px-3 py-2 focus:ring focus:ring-blue-300 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* District Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    District 
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-3 py-2 focus:ring focus:ring-blue-300 ${
                      errors.district ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select District</option>
                    {Object.keys(districtData).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-500 text-xs mt-1">{errors.district}</p>
                  )}
                </div>

                {/* Upazila Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upazila / Thana 
                  </label>
                  <select
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    disabled={!formData.district}
                    className={`w-full border rounded-xl px-3 py-2 focus:ring focus:ring-blue-300 disabled:bg-gray-200 ${
                      errors.upazila ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select Upazila</option>
                    {formData.district &&
                      districtData[formData.district as keyof typeof districtData]?.map((upazila: string) => (
                        <option key={upazila} value={upazila}>
                          {upazila}
                        </option>
                      ))}
                  </select>
                  {errors.upazila && (
                    <p className="text-red-500 text-xs mt-1">{errors.upazila}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address 
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    className={`w-full border rounded-xl px-3 py-2 focus:ring focus:ring-blue-300 ${
                      errors.address ? 'border-red-500' : ''
                    }`}
                    rows={2}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:flex-1 lg:sticky lg:top-8">
              <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Order Summary</h2>
                </div>

                {order.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No items in your order
                  </p>
                ) : (
                  <div className="space-y-4">
                    {order.map((item, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base sm:text-lg">
                              {item.productName}
                            </h3>
                            <div className="text-sm text-gray-600 mt-2">
                              <p>Price: ৳{item.price}</p>
                              <p>Quantity: {item.quantity}</p>
                              {item.color && <p>Color: {item.color}</p>}
                              {item.storage && <p>Storage: {item.storage}</p>}
                              {item.RAM && <p>RAM: {item.RAM}</p>}
                              {item.sim && <p>SIM: {item.sim}</p>}
                              {item.display && <p>Display: {item.display}</p>}
                              {item.region && <p>Region: {item.region}</p>}
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                              />
                            )}
                            <p className="font-bold text-base sm:text-lg">
                              ৳{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
                        <span>Total:</span>
                        <span>৳{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-500 text-white py-3 rounded-xl hover:bg-amber-600 transition font-semibold"
                    >
                      Confirm Order
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center mt-2">
                      By confirming, you agree to our terms and conditions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;