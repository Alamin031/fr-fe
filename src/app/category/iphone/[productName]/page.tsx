"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  CreditCard,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { Image, ImageKitProvider } from "@imagekit/next";
import AppleLogo from "@/components/ui/AppleLogo";
import WhatsappLogo from "@/components/ui/WhatsappLogo";

interface PageProps {
  params: Promise<{
    productName: string;
  }>;
}

interface ColorImageConfig {
  id: number;
  color: string;
  image: string;
  price: string;
}

interface StorageConfig {
  id: number;
  label: string;
  price: string;
}

interface DynamicRegion {
  name: string;
  price: string;
}

interface ProductDetail {
  id: number;
  label: string;
  value: string;
}

interface Product {
  _id: string;
  name: string;
  basePrice: string;
  colorImageConfigs: ColorImageConfig[];
  storageConfigs: StorageConfig[];
  dynamicRegions?: DynamicRegion[];
  details: ProductDetail[];
  accessories: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page({ params }: PageProps) {
  // Unwrap the params Promise using React.use()
const { productName } = React.use(params);
     
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedStorageIndex, setSelectedStorageIndex] = useState(0);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // const [imageError, setImageError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `/api/getproduct/iphonedetaits/product`,
          {
            params: { name: productName },
          }
        );
        const data: Product = res.data;
        setProduct(data);

        if (data.colorImageConfigs?.length) setSelectedColorIndex(0);
        if (data.colorImageConfigs?.length) setSelectedImageIndex(0);
        if (data.storageConfigs?.length) setSelectedStorageIndex(0);
        if (data.dynamicRegions?.length) setSelectedRegionIndex(0);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productName) fetchProduct();
  }, [productName]);

  const calculateTotalPrice = (): number => {
    if (!product) return 0;

    const basePrice = Number(product.basePrice) || 0;
    const colorPrice =
      Number(product.colorImageConfigs[selectedColorIndex]?.price) || 0;
    const storagePrice =
      Number(product.storageConfigs[selectedStorageIndex]?.price) || 0;
    const regionPrice =
      Number(product.dynamicRegions?.[selectedRegionIndex]?.price) || 0;

    return basePrice + colorPrice + storagePrice + regionPrice;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(price);

  const handleShopNow = () => {
    if (!product) return;

    const selectedColor =
      product.colorImageConfigs[selectedColorIndex]?.color || "Default";
    const selectedStorage =
      product.storageConfigs[selectedStorageIndex]?.label || "Default";
    const selectedRegion =
      product.dynamicRegions?.[selectedRegionIndex]?.name || "Default";
    const totalPrice = calculateTotalPrice() * quantity;

    // Log the selection for debugging
    console.log('Shop Now clicked:', {
      product: product.name,
      color: selectedColor,
      storage: selectedStorage,
      region: selectedRegion,
      quantity,
      totalPrice: formatPrice(totalPrice)
    });

    // You can customize this based on your needs:
    // Option 1: Redirect to checkout page
    // window.location.href = '/checkout';
    
    // Option 2: Open checkout in new tab
    // window.open('/checkout', '_blank');
    
    // Option 3: Navigate using Next.js router
    // router.push('/checkout');
    
    // For now, showing an alert - replace with your actual logic
    alert(`Proceeding to checkout!\n\nProduct: ${product.name}\nTotal: ${formatPrice(totalPrice)}`);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const selectedColor =
      product.colorImageConfigs[selectedColorIndex]?.color || "Default";
    const selectedStorage =
      product.storageConfigs[selectedStorageIndex]?.label || "Default";
    const selectedRegion =
      product.dynamicRegions?.[selectedRegionIndex]?.name || "Default";
    const totalPrice = calculateTotalPrice() * quantity;

    // Add to cart logic
    console.log('Added to cart:', {
      product: product.name,
      color: selectedColor,
      storage: selectedStorage,
      region: selectedRegion,
      quantity,
      totalPrice: formatPrice(totalPrice)
    });

    // Replace with your actual add to cart logic
    alert(`Added to cart!\n\nProduct: ${product.name}\nQuantity: ${quantity}`);
  };

  const handleWhatsAppContact = () => {
    if (!product) return;

    const selectedColor =
      product.colorImageConfigs[selectedColorIndex]?.color || "Default";
    const selectedStorage =
      product.storageConfigs[selectedStorageIndex]?.label || "Default";
    const selectedRegion =
      product.dynamicRegions?.[selectedRegionIndex]?.name || "Default";
    const totalPrice = formatPrice(calculateTotalPrice() * quantity);

    const message = encodeURIComponent(
      `Hi! I'm interested in this product:\n\n` +
        `Product: ${product.name}\n` +
        `Color: ${selectedColor}\n` +
        `Storage: ${selectedStorage}\n` +
        `Region: ${selectedRegion}\n` +
        `Quantity: ${quantity}\n` +
        `Total Price: ${totalPrice}\n\n` +
        `Please provide more information or help me place an order.`
    );

    const phoneNumber = "8801343159931";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const nextImage = () => {
    if (product?.colorImageConfigs) {
      setSelectedImageIndex((prev) =>
        prev === product.colorImageConfigs.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.colorImageConfigs) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.colorImageConfigs.length - 1 : prev - 1
      );
    }
  };

  const handleColorChange = (index: number) => {
    setSelectedColorIndex(index);
    setSelectedImageIndex(index);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  if (!urlEndpoint)
    return <div>Error: ImageKit URL endpoint is not configured.</div>;

  if (loading)
    return (
      <ImageKitProvider urlEndpoint={urlEndpoint}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ImageKitProvider>
    );

  if (!product)
    return (
      <ImageKitProvider urlEndpoint={urlEndpoint}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Product not found
            </h2>
            <p className="text-gray-600">
              The requested product could not be loaded.
            </p>
          </div>
        </div>
      </ImageKitProvider>
    );

  const currentImage = product.colorImageConfigs[selectedImageIndex];

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <div className="min-h-screen w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={currentImage?.image || ""}
                    alt={product.name}
                    fill
                    className="object-contain"
                    onError={() => handleImageError(selectedImageIndex)}
                  />
                  {product.colorImageConfigs.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Color Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto pb-2 items-center justify-center">
                {product.colorImageConfigs.map((config, index) => (
                  <button
                    key={config.id}
                    onClick={() => handleColorChange(index)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all relative ${
                      selectedColorIndex === index
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={config.image}
                      alt={`Color option ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center">

                  

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-[-15px]">
                  {product.name}
                </h1>
                <div className="flex items-center mt-[-30px] ml-4">
                  <AppleLogo />
                  <span className="font-bold text-sm sm:text-base">Apple</span>
                </div>
                </div>
                <div className="text-xl sm:text-2xl font-medium text-black">
                  {formatPrice(calculateTotalPrice())}
                </div>
              </div>

              {/* Color Selection */}
              {product.colorImageConfigs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colorImageConfigs.map((config, index) => (
                      <button
                        key={config.id}
                        onClick={() => handleColorChange(index)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                          selectedColorIndex === index
                            ? "border-gray-800 scale-110"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: config.color }}
                        aria-pressed={selectedColorIndex === index}
                        title={`Color option ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Storage & Region */}
              <div className="grid grid-cols-1 gap-6">
                {product.storageConfigs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Storage</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {product.storageConfigs.map((config, index) => (
                        <button
                          key={config.id}
                          onClick={() => setSelectedStorageIndex(index)}
                          className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-center text-sm sm:text-base ${
                            selectedStorageIndex === index
                              ? "border-amber-500 bg-amber-50 text-black"
                              : "border-gray-300 hover:border-gray-400 bg-white"
                          }`}
                        >
                          <div className="font-semibold">{config.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.dynamicRegions?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Region</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.dynamicRegions.map((region, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedRegionIndex(index)}
                          className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-center text-sm sm:text-base ${
                            selectedRegionIndex === index
                              ? "border-amber-500 bg-amber-50 text-black"
                              : "border-gray-300 hover:border-gray-400 bg-white"
                          }`}
                        >
                          <div className="font-semibold">{region.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <div className="flex items-center space-x-3 mb-6">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="text-lg sm:text-xl font-semibold px-4">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Primary Shop Now Button */}
                  <button
                    onClick={handleShopNow}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 sm:py-5 px-8 rounded-xl transition-all text-base sm:text-lg shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    Shop Now - {formatPrice(calculateTotalPrice() * quantity)}
                  </button>

                  {/* Secondary Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={handleWhatsAppContact}
                      className="w-full sm:w-auto flex-shrink-0 rounded-lg transition-colors flex items-center justify-center py-2 sm:py-[7px] px-4 bg-green-500 hover:bg-green-600"
                    >
                      <WhatsappLogo />
                    </button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      Free Delivery
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      1 Year Apple official Warranty
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      Easy Returns
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          {product.details?.length > 0 && (
            <div className="mt-8 sm:mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Technical Specifications
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Detailed product information and features
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="hidden sm:table-header-group">
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-800 uppercase tracking-wider w-1/3 text-xs sm:text-sm">
                        Specification
                      </th>
                      <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-800 uppercase tracking-wider w-2/3 text-xs sm:text-sm">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.details.map((detail, index) => (
                      <tr
                        key={detail.id || index}
                        className="hover:bg-gray-50 transition-colors duration-150 block sm:table-row border-b sm:border-b-0"
                      >
                        <td className="py-2 sm:py-4 px-4 sm:px-6 font-medium text-gray-700 bg-gray-25 sm:border-r border-gray-200 block sm:table-cell">
                          <span className="break-words text-sm sm:text-base">
                            {detail.label.replace(/\t/g, "")}
                          </span>
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-6 text-gray-900 block sm:table-cell">
                          <span className="break-words leading-relaxed text-sm sm:text-base">
                            {detail.value}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  * Specifications may vary by region and are subject to change
                  without notice
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ImageKitProvider>
  )};