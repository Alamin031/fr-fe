"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  productName: string;
  price: number;
  [key: string]: unknown; // অন্যান্য প্রোপার্টি
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  division: string;
  district: string;
  upazila: string;
  postCode: string;
  address: string;
  paymentMethod: "cash_on_delivery" | "online_payment";
  deliveryMethod: "courier_service" | "shop_pickup";
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    division: "",
    district: "",
    upazila: "",
    postCode: "",
    address: "",
    paymentMethod: "cash_on_delivery",
    deliveryMethod: "courier_service",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bangladeshDivisions = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  const districtsByDivision: Record<string, string[]> = {
    Dhaka: [
      "Dhaka",
      "Gazipur",
      "Narayanganj",
      "Tangail",
      "Kishoreganj",
      "Manikganj",
      "Munshiganj",
      "Narsingdi",
      "Rajbari",
      "Shariatpur",
      "Faridpur",
      "Gopalganj",
      "Madaripur",
    ],
    Chittagong: [
      "Chittagong",
      "Cox's Bazar",
      "Rangamati",
      "Bandarban",
      "Khagrachhari",
      "Feni",
      "Lakshmipur",
      "Comilla",
      "Noakhali",
      "Brahmanbaria",
      "Chandpur",
    ],
  };

  const upazilasByDistrict: Record<string, string[]> = {
    Dhaka: [
      "Dhanmondi",
      "Gulshan",
      "Banani",
      "Uttara",
      "Mirpur",
      "Tejgaon",
      "Ramna",
      "Wari",
      "Kotwali",
      "Lalbagh",
      "Hazaribagh",
      "New Market",
      "Shahbagh",
      "Paltan",
      "Motijheel",
    ],
    Chittagong: [
      "Kotwali",
      "Panchlaish",
      "Double Mooring",
      "Halishahar",
      "Chandgaon",
      "Bakalia",
      "Bayazid",
      "Pahartali",
      "Carbazar",
      "Bandar",
      "Karnaphuli",
      "Boalkhali",
      "Anowara",
      "Chandanaish",
      "Satkania",
      "Lohagara",
      "Banshkhali",
      "Sandwip",
      "Sitakunda",
      "Mirsharai",
      "Fatikchhari",
      "Rangunia",
      "Raozan",
      "Patiya",
      "Hathazari",
    ],
  };

  useEffect(() => {
    if (productId) {
      fetch(`/api/getproduct/checkout?productId=${productId}`)
        .then((res) => res.json())
        .then((data: Product) => setProduct(data))
        .catch((err: unknown) => console.error(err));
    }
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "division" && { district: "", upazila: "" }),
      ...(name === "district" && { upazila: "" }),
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.division) newErrors.division = "Division is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.upazila) newErrors.upazila = "Upazila is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        productId,
        product,
        orderDate: new Date().toISOString(),
        totalAmount: product?.price || 0,
      };

      console.log("Order submitted:", orderData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Order placed successfully! We will contact you soon.");
    } catch (err: unknown) {
      console.error("Order submission failed:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!productId) return <div className="container mx-auto p-4">No product selected</div>;
  if (!product) return <div className="container mx-auto p-4">Loading product...</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p><strong>Product:</strong> {product.productName}</p>
        <p><strong>Price:</strong> ৳ {product.price}</p>
        <hr className="my-3" />
        <p className="text-lg font-bold">Total: ৳ {product.price}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
              </div>
              <div>
                <label className="block mb-2">District *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg"
                >
                  <option value="">Select your district</option>
                  {formData.division && districtsByDivision[formData.division]?.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Division *</label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg"
                >
                  <option value="">Select division</option>
                  {bangladeshDivisions.map((div) => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
                {errors.division && <p className="text-red-500 text-sm">{errors.division}</p>}
              </div>

              <div>
                <label className="block mb-2">Upazila *</label>
                <select
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleInputChange}
                  disabled={!formData.district}
                  className="w-full px-4 py-3 border rounded-lg"
                >
                  <option value="">Select upazila</option>
                  {formData.district && upazilasByDistrict[formData.district]?.map((upazila) => (
                    <option key={upazila} value={upazila}>{upazila}</option>
                  ))}
                </select>
                {errors.upazila && <p className="text-red-500 text-sm">{errors.upazila}</p>}
              </div>

              <div>
                <label className="block mb-2">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "online_payment" }))}
              className={`p-4 border rounded-lg ${formData.paymentMethod === "online_payment" ? "border-orange-500 bg-orange-50" : ""}`}
            >
              Online Payment
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "cash_on_delivery" }))}
              className={`p-4 border rounded-lg ${formData.paymentMethod === "cash_on_delivery" ? "border-orange-500 bg-orange-50" : ""}`}
            >
              Cash on Delivery
            </button>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Delivery Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: "courier_service" }))}
              className={`p-4 border rounded-lg ${formData.deliveryMethod === "courier_service" ? "border-orange-500 bg-orange-50" : ""}`}
            >
              Courier Service
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: "shop_pickup" }))}
              className={`p-4 border rounded-lg ${formData.deliveryMethod === "shop_pickup" ? "border-orange-500 bg-orange-50" : ""}`}
            >
              Shop Pickup
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-lg text-white ${isSubmitting ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"}`}
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
