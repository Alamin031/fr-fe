"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart } from "lucide-react";
import { Image, ImageKitProvider } from "@imagekit/next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useOrderStore from "../../../../../store/store";

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

interface RamConfig {
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
  ramConfigs: RamConfig[];
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

// Card Loading Skeleton Component
const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 flex flex-col items-center text-center border border-gray-100 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] mx-auto mb-3">
        <div className="w-full h-full bg-gray-200 rounded-lg"></div>
      </div>
      
      {/* Product Name Skeleton */}
      <div className="w-full mb-2">
        <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mx-auto w-1/2"></div>
      </div>
      
      {/* Color Selection Skeleton */}
      <div className="flex items-center justify-center gap-1 mb-2">
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Pricing Skeleton */}
      <div className="mb-3 sm:mb-4 w-full">
        <div className="h-6 bg-gray-200 rounded mb-1 mx-auto w-1/2"></div>
        <div className="flex items-center justify-center gap-1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
      
      {/* Action Buttons Skeleton */}
      <div className="flex flex-row gap-2 w-full mt-auto">
        <div className="flex-1 h-9 bg-gray-200 rounded-full"></div>
        <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

// Generate skeleton cards for loading state
const generateSkeletons = (count: number) => {
  return Array.from({ length: count }, (_, index) => (
    <CardSkeleton key={`skeleton-${index}`} />
  ));
};

export default function Mabookcard() {
  const { addOrder, clearOrder } = useOrderStore();

  const router = useRouter();
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined");
  }

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['macbook-list'],
    queryFn: async () => {
      const res = await axios.get<Product[]>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/macbooklist`
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>(
    {}
  );

  const handleShowNow = (product: Product) => {
    clearOrder();
    
    // Get the current selected image
    const currentImage = getCurrentImage(product);
    
    addOrder({
      productName: product.name,
      image: currentImage,  // ✅ Added image here
      price: parseFloat(product.basePrice),
      storage: product.storageConfigs?.[0]?.label ?? undefined,
      RAM: product.ramConfigs?.[0]?.label ?? undefined,
      quantity: 1,
      productId: product._id,
    });

    router.push(`/checkout`);
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

  useEffect(() => {
    if (!products || products.length === 0) return;
    const initialColors: Record<string, number> = {};
    products.forEach((product) => {
      if (product.colorImageConfigs.length > 0) {
        initialColors[product._id] = product.colorImageConfigs[0].id;
      }
    });
    setSelectedColors(initialColors);
  }, [products]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <p className="text-red-600 text-base sm:text-lg font-medium">Failed to load products</p>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <div className="w-full px-3 sm:px-4 lg:px-6 mt-4">
        <div className="max-w-7xl mx-auto">
          {/* Grid Layout: 2 columns on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {/* Show skeletons when loading, actual products when data is available */}
            {isLoading ? generateSkeletons(8) : (products || []).map((product) => {
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
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 flex flex-col items-center text-center border border-gray-100 hover:border-gray-200"
                >
                  {/* Product Image */}
                  <Link href={`/category/macbook/${productSlug}`} className="block w-full">
                    <div className="relative w-full aspect-square max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] mx-auto mb-3">
                      <Image
                        src={currentImage}
                        alt={product.name}
                        fill
                        className="object-contain rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
                        sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
                      />
                    </div>
                  </Link>

                  {/* Product Name */}
                  <Link href={`/category/macbook/${productSlug}`} className="block w-full">
                    <h3 className="text-sm sm:text-base font-semibold mb-2 text-gray-900 hover:text-amber-600 transition-colors duration-200 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Color Selection */}
                  {product.colorImageConfigs &&
                    product.colorImageConfigs.length > 1 && (
                      <div className="flex items-center justify-center gap-1 mb-2 sm:mb-3">
                        <div className="flex gap-1 flex-wrap justify-center">
                          {product.colorImageConfigs.map((colorConfig) => (
                            <button
                              key={colorConfig.id}
                              onClick={() =>
                                handleColorSelect(product._id, colorConfig.id)
                              }
                              className={`w-4 h-4 sm:w-4 sm:h-4 rounded-full border transition-all duration-200 ${
                                selectedColors[product._id] === colorConfig.id
                                  ? "border-blue-500 scale-110 shadow-md ring-1 ring-blue-200"
                                  : "border-gray-300 hover:border-gray-400 hover:scale-105"
                              }`}
                              style={{ backgroundColor: colorConfig.color }}
                              title={`Color: ${colorConfig.color}`}
                              aria-label={`Select ${colorConfig.color} color`}
                            >
                              <div className="w-full h-full rounded-full border border-white/20"></div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Price Section */}
                  <div className="mb-3 sm:mb-4 w-full">
                    <p className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      ৳ {basePrice.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      <span className="line-through text-gray-400 text-xs">
                        ৳ {originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-600 text-xs font-medium px-1.5 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row gap-2 w-full mt-auto">
                    <button
                      onClick={() => handleShowNow(product)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-full bg-white text-black border border-black px-2 py-1.5 sm:py-2 hover:bg-gray-50 transition-colors duration-200 font-medium text-xs sm:text-sm"
                    >
                      <span>Order Now</span>
                    </button>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 px-2 py-1.5 sm:py-2 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 min-w-[36px] sm:min-w-[40px]"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ImageKitProvider>
  );
}