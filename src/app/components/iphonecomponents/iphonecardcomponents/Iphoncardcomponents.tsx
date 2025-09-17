"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Image, ImageKitProvider } from "@imagekit/next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

interface Product {
  _id: string;
  name: string;
  basePrice: string;
  colorImageConfigs: ColorImageConfig[];
  storageConfigs: StorageConfig[];
}

const slugify = (text: string) =>
  text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

// Custom hook for fetching iPhone products
const useIphoneProducts = () => {
  return useQuery({
    queryKey: ['iphone-products'],
    queryFn: async (): Promise<Product[]> => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/iphonelist`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes (previously cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default function IphoneAll() {
  const router = useRouter();
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined");
  }

  // Use TanStack Query instead of manual state management
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useIphoneProducts();

  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});

  const handleShowNow = (product: Product) => {
    router.push(`/checkout/${product._id}`);
  };

  const handleAddToCart = (product: Product) => {
    console.log("Adding to cart:", product);
    // implement your cart logic here
  };

  const handleColorSelect = (productId: string, colorId: number) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: colorId,
    }));
  };

  const getCurrentImage = (product: Product) => {
    const selectedColorId = selectedColors[product._id];
    if (selectedColorId) {
      const selectedConfig = product.colorImageConfigs.find(
        (config) => config.id === selectedColorId
      );
      return selectedConfig?.image || product.colorImageConfigs[0]?.image;
    }
    return product.colorImageConfigs[0]?.image;
  };

  // Initialize selected colors when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      const initialColors: Record<string, number> = {};
      products.forEach((product) => {
        if (product.colorImageConfigs.length > 0) {
          initialColors[product._id] = product.colorImageConfigs[0].id;
        }
      });
      setSelectedColors(initialColors);
    }
  }, [products]);

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 text-center w-full flex justify-center items-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2">Loading products...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">
          <p>Error loading products: {error?.message}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No products found.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      {/* Show background refetch indicator */}
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-50">
          Updating...
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto">
        {products.map((product) => {
          const currentImage = getCurrentImage(product);
          const basePrice = parseFloat(product.basePrice);
          const originalPrice = basePrice + 10000;
          const discount = Math.round(
            ((originalPrice - basePrice) / originalPrice) * 100
          );
          const productSlug = slugify(product.name);

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center w-full max-w-sm mx-auto border"
            >
              {/* Product Image */}
              {currentImage && (
                <Link href={`/category/iphone/${productSlug}`}>
                  <div className="relative w-[250px] h-[250px]">
                    <Image
                      src={currentImage}
                      alt={product.name}
                      fill
                      className="object-contain rounded-xl transition-all duration-300 ease-in-out"
                      transformation={[{ aiRemoveBackground: true }]}
                    />
                  </div>
                </Link>
              )}

              {/* Product Name */}
              <Link href={`/category/iphone/${productSlug}`}>
                <h3 className="text-xl font-semibold mt-6">{product.name}</h3>
              </Link>

              {/* Color Selection */}
              {product.colorImageConfigs &&
                product.colorImageConfigs.length > 1 && (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex gap-2">
                      {product.colorImageConfigs.map((colorConfig) => (
                        <button
                          key={colorConfig.id}
                          onClick={() =>
                            handleColorSelect(product._id, colorConfig.id)
                          }
                          className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                            selectedColors[product._id] === colorConfig.id
                              ? "border-blue-500 scale-110 shadow-lg"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: colorConfig.color }}
                          title={`Color: ${colorConfig.color}`}
                        >
                          <div className="w-full h-full rounded-full border border-white/20"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Price */}
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ৳ {basePrice.toLocaleString()}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="line-through text-gray-400 text-sm">
                  ৳ {originalPrice.toLocaleString()}
                </span>
                <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                  {discount}% OFF
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6 w-full">
                <button
                  onClick={() => handleShowNow(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white rounded-[10px] px-6 py-3 hover:bg-white hover:text-gray-500 transition duration-200 border font-medium"
                >
                  Order Now
                  
                </button>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center justify-center bg-white border hover:border-white hover:text-white border-gray-500 text-gray-500 rounded-[10px] px-6 py-3 hover:bg-amber-500 transition duration-200"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ImageKitProvider>
  );
}