"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart } from "lucide-react";
import { Image, ImageKitProvider } from "@imagekit/next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useOrderStore from "../../../../store/store";


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

interface DynamicRegion {
  name: string;
  price: string;
  inStock: boolean;
}

interface Detail {
  id: number;
  label: string;
  value: string;
}

interface PreOrderConfig {
  isPreOrder: boolean;
  availabilityDate: string;
  estimatedShipping: string;
  preOrderDiscount: number;
  maxPreOrderQuantity: number;
}

interface Product {
  _id: string;
  name: string;
  basePrice: string;
  accessories: string;
  storageConfigs: StorageConfig[];
  colorImageConfigs: ColorImageConfig[];
  simConfigs: SimConfig[];
  dynamicRegions: DynamicRegion[];
  details: Detail[];
  preOrderConfig: PreOrderConfig;
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

export default function IpadCard() {
  const {addOrder , clearOrder} = useOrderStore()
  const router = useRouter();
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined");
  }

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['ipad-list'],
    queryFn: async () => {
      const res = await axios.get<Product[]>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/ipadlist`
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});
  const [selectedStorages, setSelectedStorages] = useState<Record<string, number>>({});
  const [selectedSims, setSelectedSims] = useState<Record<string, number>>({});

  const handleShowNow = (product: Product) => {
    const totalPrice = calculateTotalPrice(product);
   clearOrder()
  
    // Get the actual color and storage values
    const selectedColorId = selectedColors[product._id];
    const selectedColor = product.colorImageConfigs.find(config => config.id === selectedColorId);
    const selectedStorageId = selectedStorages[product._id];
    const selectedStorage = product.storageConfigs.find(config => config.id === selectedStorageId);
  
    addOrder({
      productId: product._id,
      productName: product.name,
      price: totalPrice,
      color: selectedColor?.color,
      storage: selectedStorage?.label,
      
      // simId: selectedSims[product._id],
      quantity: 1,
      image: getCurrentImage(product),
      
    });
  
    router.push("/checkout"); // ✅ navigate to checkout
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

  const calculateTotalPrice = (product: Product) => {
    const basePrice = parseFloat(product.basePrice || "0");
    
    const selectedStorageId = selectedStorages[product._id];
    const selectedStorage = product.storageConfigs.find(config => config.id === selectedStorageId);
    const storagePrice = parseFloat(selectedStorage?.price || "0");
    
    const selectedSimId = selectedSims[product._id];
    const selectedSim = product.simConfigs.find(config => config.id === selectedSimId);
    const simPrice = parseFloat(selectedSim?.price || "0");
    
    const selectedColorId = selectedColors[product._id];
    const selectedColor = product.colorImageConfigs.find(config => config.id === selectedColorId);
    const colorPrice = parseFloat(selectedColor?.price || "0");
    
    return basePrice + storagePrice + simPrice + colorPrice;
  };


  useEffect(() => {
    if (!products || products.length === 0) return;
    
    const initialColors: Record<string, number> = {};
    const initialStorages: Record<string, number> = {};
    const initialSims: Record<string, number> = {};
    
    products.forEach((product) => {
      if (product.colorImageConfigs.length > 0) {
        initialColors[product._id] = product.colorImageConfigs[0].id;
      }
      if (product.storageConfigs.length > 0) {
        initialStorages[product._id] = product.storageConfigs[0].id;
      }
      if (product.simConfigs.length > 0) {
        initialSims[product._id] = product.simConfigs[0].id;
      }
    });
    
    setSelectedColors(initialColors);
    setSelectedStorages(initialStorages);
    setSelectedSims(initialSims);
  }, [products]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Failed to load products</p>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-7xl mx-auto">
          {/* Grid Layout: 1 column on mobile, 2 on tablet, 3 on desktop, 4 on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {(products || []).map((product) => {
              const currentImage = getCurrentImage(product);
              const totalPrice = calculateTotalPrice(product);
              const basePrice = parseFloat(product.basePrice);
              const originalPrice = totalPrice + 15000; // Add markup for discount calculation
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
                    <Link href={`/category/ipad/${productSlug}`} className="block w-full">
                      <div className="relative w-full aspect-square max-w-[200px] sm:max-w-[220px] lg:max-w-[250px] mx-auto mb-4">
                        <Image
                          src={currentImage}
                          alt={product.name}
                          fill
                          className="object-contain rounded-xl transition-transform duration-300 ease-in-out hover:scale-105"
                          sizes="(max-width: 640px) 200px, (max-width: 1024px) 220px, 250px"
                        />
                      </div>
                    </Link>
                  )}

                  {/* Product Name */}
                  <Link href={`/category/ipad/${productSlug}`} className="block w-full">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 hover:text-amber-600 transition-colors duration-200 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Storage Selection */}
                 
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
                            aria-label={`Select ${colorConfig.color} color`}
                          >
                            <div className="w-full h-full rounded-full border border-white/20"></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connectivity Selection */}
                 
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
                    {totalPrice !== basePrice && (
                      <p className="text-xs text-gray-500 mt-1">
                        Base: ৳{basePrice.toLocaleString()} + ৳{(totalPrice - basePrice).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row gap-3 w-full mt-auto">
                    <button
                      onClick={() => handleShowNow(product)}
                      
                      className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white text-black border border-gray-300 px-4 py-2 hover:bg-amber-600 hover:text-white transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      <span>Order Now</span>
                    </button>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 px-4 py-2 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 sm:w-auto min-w-[48px]"
                      aria-label="Add to cart"
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