"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Image, ImageKitProvider } from "@imagekit/next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useOrderStore from "../../../../../store/store";

interface ColorImageConfig {
  id: number;
  color: string;
  image: string;
  price: string;
  inStock: boolean;
}

interface StorageConfig {
  id: number;
  label: string;
  price: string;
  shortDetails: string;
  inStock: boolean;
}

interface SimConfig {
  id: number;
  type: string;
  price: string;
  inStock: boolean;
}

interface Product {
  _id: string;
  name: string;
  basePrice: string;
  colorImageConfigs: ColorImageConfig[];
  storageConfigs: StorageConfig[];
  simConfigs?: SimConfig[];
  productlinkname: string;
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

const useIphoneProducts = () => {
  return useQuery({
    queryKey: ["iphone-products"],
    queryFn: async (): Promise<Product[]> => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/iphonelist`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

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
      
      {/* SIM Configuration Skeleton */}
      <div className="flex flex-wrap gap-1 mb-2 justify-center">
        <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Color Selection Skeleton */}
      <div className="flex items-center justify-center mb-2">
        <div className="flex gap-1.5">
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Pricing Skeleton */}
      <div className="mb-3 sm:mb-4 w-full">
        <div className="h-6 bg-gray-200 rounded mb-1 mx-auto w-1/2"></div>
        <div className="flex items-center justify-center gap-1.5">
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

export default function IphoneAll() {
  const router = useRouter();
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const { addOrder, clearOrder } = useOrderStore();

  if (!urlEndpoint) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined");
  }

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useIphoneProducts();

  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});
  const [selectedStorages, setSelectedStorages] = useState<Record<string, number>>({});
  const [selectedSims, setSelectedSims] = useState<Record<string, number>>({});

  const handleShowNow = (product: Product) => {
    const totalPrice = calculateTotalPrice(product);
    clearOrder();

    const selectedColorId = selectedColors[product._id];
    const selectedColor = product.colorImageConfigs?.find((config) => config.id === selectedColorId);
    const selectedStorageId = selectedStorages[product._id];
    const selectedStorage = product.storageConfigs?.find((config) => config.id === selectedStorageId);
    const selectedSimId = selectedSims[product._id];
    const selectedSim = product.simConfigs?.find((config) => config.id === selectedSimId);

    addOrder({
      productId: product._id,
      productName: product.name,
      price: totalPrice,
      color: selectedColor?.color,
      storage: selectedStorage?.label,
      sim: selectedSim?.type,
      quantity: 1,
      image: getCurrentImage(product),
    });

    router.push(`/checkout`);
  };

  const handleAddToCart = (product: Product) => {
    console.log("Adding to cart:", product);
  };

  const handleColorSelect = (productId: string, colorId: number) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: colorId }));
  };

  const handleSimSelect = (productId: string, simId: number) => {
    setSelectedSims((prev) => ({ ...prev, [productId]: simId }));
  };

  const getCurrentImage = (product: Product) => {
    const selectedColorId = selectedColors[product._id];
    if (selectedColorId && product.colorImageConfigs) {
      const selectedConfig = product.colorImageConfigs.find((config) => config.id === selectedColorId);
      return selectedConfig?.image || product.colorImageConfigs[0]?.image;
    }
    return product.colorImageConfigs?.[0]?.image || "";
  };

  const calculateTotalPrice = (product: Product) => {
    const basePrice = parseFloat(product.basePrice || "0");
    const selectedStorageId = selectedStorages[product._id];
    const selectedStorage = product.storageConfigs?.find((config) => config.id === selectedStorageId);
    const storagePrice = parseFloat(selectedStorage?.price || "0");
    const selectedSimId = selectedSims[product._id];
    const selectedSim = product.simConfigs?.find((config) => config.id === selectedSimId);
    const simPrice = parseFloat(selectedSim?.price || "0");
    const selectedColorId = selectedColors[product._id];
    const selectedColor = product.colorImageConfigs?.find((config) => config.id === selectedColorId);
    const colorPrice = parseFloat(selectedColor?.price || "0");
    return basePrice + storagePrice + simPrice + colorPrice;
  };

  useEffect(() => {
    if (products.length > 0) {
      const initialColors: Record<string, number> = {};
      const initialStorages: Record<string, number> = {};
      const initialSims: Record<string, number> = {};
      products.forEach((product) => {
        if (product.colorImageConfigs && product.colorImageConfigs.length > 0) {
          initialColors[product._id] = product.colorImageConfigs[0].id;
        }
        if (product.storageConfigs && product.storageConfigs.length > 0) {
          initialStorages[product._id] = product.storageConfigs[0].id;
        }
        if (product.simConfigs && product.simConfigs.length > 0) {
          initialSims[product._id] = product.simConfigs[0].id;
        }
      });
      setSelectedColors(initialColors);
      setSelectedStorages(initialStorages);
      setSelectedSims(initialSims);
    }
  }, [products]);

  if (isError) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-3 text-sm sm:text-base">
          <p>Error loading products: {error?.message}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0 && !isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm sm:text-base">No products found.</p>
        <button
          onClick={() => refetch()}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      {isFetching && !isLoading && (
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm z-50">
          Updating...
        </div>
      )}
      <div className="w-full px-3 sm:px-4 lg:px-6 mt-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {/* Show skeletons when loading, actual products when data is available */}
            {isLoading ? generateSkeletons(8) : products.map((product) => {
              const currentImage = getCurrentImage(product);
              const totalPrice = calculateTotalPrice(product);
              const originalPrice = totalPrice + 10000;
              const discount = Math.round(
                ((originalPrice - totalPrice) / originalPrice) * 100
              );
              const productSlug = slugify(product.name);
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 flex flex-col items-center text-center border border-gray-100 hover:border-gray-200"
                >
                  {currentImage && (
                    <Link href={`/category/iphone/${productSlug}`} className="block w-full">
                      <div className="relative w-full aspect-square max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] mx-auto mb-3">
                        <Image
                          src={currentImage}
                          alt={product.name}
                          fill
                          className="object-contain rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
                          sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
                          transformation={[{ aiRemoveBackground: true }]}
                        />
                      </div>
                    </Link>
                  )}
                  
                  {/* Product Name */}
                  <Link href={`/category/iphone/${productSlug}`} className="block w-full mb-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-amber-600 transition-colors duration-200 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* SIM Configuration */}
                  {product.simConfigs && product.simConfigs.length > 1 && (
                    <div className="flex flex-wrap gap-1 mb-2 justify-center">
                      {product.simConfigs.map((simConfig) => (
                        <button
                          key={simConfig.id}
                          onClick={() => handleSimSelect(product._id, simConfig.id)}
                          disabled={!simConfig.inStock}
                          className={`px-2 py-1 text-xs rounded-full border transition-all duration-200 ${
                            selectedSims[product._id] === simConfig.id
                              ? "bg-green-500 text-white border-green-500"
                              : simConfig.inStock
                              ? "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                              : "border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {simConfig.type}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Color Selection */}
                  {product.colorImageConfigs && product.colorImageConfigs.length > 1 && (
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex gap-1.5 flex-wrap justify-center">
                        {product.colorImageConfigs.map((colorConfig) => (
                          <button
                            key={colorConfig.id}
                            onClick={() => handleColorSelect(product._id, colorConfig.id)}
                            disabled={!colorConfig.inStock}
                            className={`w-4 h-4 sm:w-4 sm:h-4 rounded-full border transition-all duration-200 ${
                              selectedColors[product._id] === colorConfig.id
                                ? "border-blue-500 scale-110 shadow-md ring-1 ring-blue-200"
                                : colorConfig.inStock
                                ? "border-gray-300 hover:border-gray-400 hover:scale-105"
                                : "border-gray-200 opacity-50 cursor-not-allowed"
                            }`}
                            style={{ backgroundColor: colorConfig.color }}
                            title={colorConfig.inStock ? `Color: ${colorConfig.color}` : "Out of stock"}
                          >
                            <div className="w-full h-full rounded-full border border-white/20"></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Pricing */}
                  <div className="mb-3 sm:mb-4 w-full">
                    <p className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      ৳ {totalPrice.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="line-through text-gray-400 text-xs">
                        ৳ {originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
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