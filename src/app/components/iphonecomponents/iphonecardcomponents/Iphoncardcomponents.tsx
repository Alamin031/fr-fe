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
  simConfigs?: SimConfig[]; // Made optional
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
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
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
    isFetching
  } = useIphoneProducts();

  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});
  const [selectedStorages, setSelectedStorages] = useState<Record<string, number>>({});
  const [selectedSims, setSelectedSims] = useState<Record<string, number>>({});

  const handleShowNow = (product: Product) => {
    const totalPrice = calculateTotalPrice(product);
    clearOrder();

    // Get the actual color, storage, and SIM values with safe access
    const selectedColorId = selectedColors[product._id];
    const selectedColor = product.colorImageConfigs?.find(config => config.id === selectedColorId);
    const selectedStorageId = selectedStorages[product._id];
    const selectedStorage = product.storageConfigs?.find(config => config.id === selectedStorageId);
    const selectedSimId = selectedSims[product._id];
    const selectedSim = product.simConfigs?.find(config => config.id === selectedSimId);

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
    // implement your cart logic here
  };

  const handleColorSelect = (productId: string, colorId: number) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: colorId,
    }));
  };

  // const handleStorageSelect = (productId: string, storageId: number) => {
  //   setSelectedStorages((prev) => ({
  //     ...prev,
  //     [productId]: storageId,
  //   }));
  // };

  const handleSimSelect = (productId: string, simId: number) => {
    setSelectedSims((prev) => ({
      ...prev,
      [productId]: simId,
    }));
  };

  const getCurrentImage = (product: Product) => {
    const selectedColorId = selectedColors[product._id];
    if (selectedColorId && product.colorImageConfigs) {
      const selectedConfig = product.colorImageConfigs.find(
        (config) => config.id === selectedColorId
      );
      return selectedConfig?.image || product.colorImageConfigs[0]?.image;
    }
    return product.colorImageConfigs?.[0]?.image || "";
  };

  const calculateTotalPrice = (product: Product) => {
    const basePrice = parseFloat(product.basePrice || "0");
    
    // Safe access to storage configs
    const selectedStorageId = selectedStorages[product._id];
    const selectedStorage = product.storageConfigs?.find(config => config.id === selectedStorageId);
    const storagePrice = parseFloat(selectedStorage?.price || "0");
    
    // Safe access to SIM configs (optional)
    const selectedSimId = selectedSims[product._id];
    const selectedSim = product.simConfigs?.find(config => config.id === selectedSimId);
    const simPrice = parseFloat(selectedSim?.price || "0");
    
    // Safe access to color configs
    const selectedColorId = selectedColors[product._id];
    const selectedColor = product.colorImageConfigs?.find(config => config.id === selectedColorId);
    const colorPrice = parseFloat(selectedColor?.price || "0");
    
    return basePrice + storagePrice + simPrice + colorPrice;
  };

  // Initialize selected options when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      const initialColors: Record<string, number> = {};
      const initialStorages: Record<string, number> = {};
      const initialSims: Record<string, number> = {};
      
      products.forEach((product) => {
        // Initialize colors
        if (product.colorImageConfigs && product.colorImageConfigs.length > 0) {
          initialColors[product._id] = product.colorImageConfigs[0].id;
        }
        
        // Initialize storages
        if (product.storageConfigs && product.storageConfigs.length > 0) {
          initialStorages[product._id] = product.storageConfigs[0].id;
        }
        
        // Initialize SIMs (only if they exist)
        if (product.simConfigs && product.simConfigs.length > 0) {
          initialSims[product._id] = product.simConfigs[0].id;
        }
      });
      
      setSelectedColors(initialColors);
      setSelectedStorages(initialStorages);
      setSelectedSims(initialSims);
    }
  }, [products]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6 w-full">
        <div className="text-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
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
      
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => {
              const currentImage = getCurrentImage(product);
              const totalPrice = calculateTotalPrice(product);
              // const basePrice = parseFloat(product.basePrice);
              const originalPrice = totalPrice + 10000;
              const discount = Math.round(
                ((originalPrice - totalPrice) / originalPrice) * 100
              );
              const productSlug = slugify(product.name);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-6 flex flex-col items-center text-center border border-gray-100 hover:border-gray-200"
                >
                  {/* Product Image */}
                  {currentImage && (
                    <Link href={`/category/iphone/${productSlug}`} className="block w-full">
                      <div className="relative w-full aspect-square max-w-[200px] sm:max-w-[220px] lg:max-w-[250px] mx-auto mb-4">
                        <Image
                          src={currentImage}
                          alt={product.name}
                          fill
                          className="object-contain rounded-xl transition-transform duration-300 ease-in-out hover:scale-105"
                          sizes="(max-width: 640px) 200px, (max-width: 1024px) 220px, 250px"
                          transformation={[{ aiRemoveBackground: true }]}
                        />
                      </div>
                    </Link>
                  )}

                  {/* Product Name */}
                  <Link href={`/category/iphone/${productSlug}`} className="block w-full">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 hover:text-amber-600 transition-colors duration-200 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Storage Selection */}
                  {/* {product.storageConfigs && product.storageConfigs.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-3 justify-center">
                      {product.storageConfigs.map((storageConfig) => (
                        <button
                          key={storageConfig.id}
                          onClick={() => handleStorageSelect(product._id, storageConfig.id)}
                          disabled={!storageConfig.inStock}
                          className={`px-2 py-1 text-xs rounded-full border transition-all duration-200 ${
                            selectedStorages[product._id] === storageConfig.id
                              ? "bg-blue-500 text-white border-blue-500"
                              : storageConfig.inStock
                              ? "border-gray-300 text-gray-700 hover:border-gray-400"
                              : "border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {storageConfig.label}
                        </button>
                      ))}
                    </div>
                  )} */}

                  {/* SIM Selection - Only show if SIM configs exist */}
                  {product.simConfigs && product.simConfigs.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-3 justify-center">
                      {product.simConfigs.map((simConfig) => (
                        <button
                          key={simConfig.id}
                          onClick={() => handleSimSelect(product._id, simConfig.id)}
                          disabled={!simConfig.inStock}
                          className={`px-2 py-1 text-xs rounded-full border transition-all duration-200 ${
                            selectedSims[product._id] === simConfig.id
                              ? "bg-green-500 text-white border-green-500"
                              : simConfig.inStock
                              ? "border-gray-300 text-gray-700 hover:border-gray-400"
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
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="flex gap-2 flex-wrap justify-center">
                        {product.colorImageConfigs.map((colorConfig) => (
                          <button
                            key={colorConfig.id}
                            onClick={() => handleColorSelect(product._id, colorConfig.id)}
                            disabled={!colorConfig.inStock}
                            className={`w-4 h-4 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-200 ${
                              selectedColors[product._id] === colorConfig.id
                                ? "border-blue-500 scale-110 shadow-lg ring-2 ring-blue-200"
                                : colorConfig.inStock
                                ? "border-gray-300 hover:border-gray-400 hover:scale-105"
                                : "border-gray-200 opacity-50 cursor-not-allowed"
                            }`}
                            style={{ backgroundColor: colorConfig.color }}
                            title={colorConfig.inStock ? `Color: ${colorConfig.color}` : 'Out of stock'}
                          >
                            <div className="w-full h-full rounded-full border border-white/20"></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Section */}
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      ৳ {totalPrice.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <span className="line-through text-gray-400 text-sm">
                        ৳ {originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    </div>
                    {/* {totalPrice !== basePrice && (
                      <p className="text-xs text-gray-500 mt-1">
                        Base: ৳{basePrice.toLocaleString()} + Options: ৳{(totalPrice - basePrice).toLocaleString()}
                      </p>
                    )} */}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row gap-3 w-full mt-auto">
                    <button
                      onClick={() => handleShowNow(product)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white t text-black border border-black px-4 py-2 hover: transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      <span>Order Now</span>
                    </button>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 px-4 py-2 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 sm:w-auto min-w-[48px]"
                    >
                      <ShoppingCart size={18} />
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