"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ShoppingCart, RefreshCw } from "lucide-react";
import { Image, ImageKitProvider } from "@imagekit/next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useOrderStore from "../../../../store/store";

interface Accessory {
  _id: string;
  name: string;
  basePrice: string;
  accessoriesType: string;
  imageConfigs?: Array<{ image: string }>;
  details?: Array<{ label: string; value: string }>;
  inStock: boolean;
  productlinkname?: string;
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

// Safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
};

// Skeleton Loader Component
const AccessoryCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 flex flex-col items-center text-center border border-gray-100 animate-pulse">
      <div className="relative w-full aspect-square max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] mx-auto mb-3">
        <div className="w-full h-full bg-gray-200 rounded-lg"></div>
      </div>
      <div className="w-full mb-2">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
      <div className="mb-3 sm:mb-4 w-full">
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="flex flex-row gap-2 w-full mt-auto">
        <div className="flex-1 h-10 bg-gray-200 rounded-full"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default function AccessoriesCard() {
  const { addOrder, clearOrder } = useOrderStore();
  const router = useRouter();
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined");
  }

  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchAccessories = useCallback(async (updateCache = false) => {
    try {
      setIsFetching(true);
      setIsError(false);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/accessorieslist?ts=${Date.now()}`;
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch accessories: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected an array');
      }

      setAccessories(data);

      if (updateCache) {
        safeLocalStorage.setItem('accessoriesCache', JSON.stringify(data));
        safeLocalStorage.setItem('accessoriesCacheTime', Date.now().toString());
      }
    } catch (err) {
      setIsError(true);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching accessories';
      setError(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }, []);

  // Initialize accessories from cache or fetch
  useEffect(() => {
    const cached = safeLocalStorage.getItem('accessoriesCache');
    const cacheTime = safeLocalStorage.getItem('accessoriesCacheTime');
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    if (cached && cacheTime) {
      const age = Date.now() - parseInt(cacheTime, 10);
      if (age < CACHE_DURATION) {
        try {
          const parsedCache = JSON.parse(cached);
          setAccessories(parsedCache);
          setIsLoading(false);
          return;
        } catch (err) {
          console.warn('Failed to parse cache:', err);
        }
      }
    }

    fetchAccessories(true);
  }, [fetchAccessories]);

  const getCurrentImage = useCallback((accessory: Accessory) => {
    return accessory?.imageConfigs?.[0]?.image || "";
  }, []);

  const calculateTotalPrice = useCallback((accessory: Accessory) => {
    return parseFloat(accessory.basePrice || "0");
  }, []);

  const calculateOriginalPrice = useCallback((accessory: Accessory) => {
    const currentPrice = parseFloat(accessory.basePrice || "0");
    return currentPrice + (currentPrice * 0.15); // 15% higher for original price
  }, []);

  const handleShowNow = useCallback((accessory: Accessory) => {
    const totalPrice = calculateTotalPrice(accessory);
    clearOrder();

    addOrder({
      productId: accessory._id,
      productName: accessory.name,
      price: totalPrice,
      color: accessory.accessoriesType,
      storage: "N/A",
      quantity: 1,
      image: getCurrentImage(accessory),
    });

    router.push("/checkout");
  }, [calculateTotalPrice, clearOrder, addOrder, getCurrentImage, router]);

  const handleAddToCart = useCallback((accessory: Accessory) => {
    console.log("Adding to cart:", accessory);
    // TODO: Implement cart functionality
  }, []);

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <p className="text-red-600 text-base sm:text-lg font-medium mb-3">
            Error loading accessories: {error}
          </p>
          <button
            onClick={() => fetchAccessories(true)}
            disabled={isFetching}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetching ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  if (accessories.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-3 text-sm sm:text-base">No accessories found.</p>
          <button
            onClick={() => fetchAccessories(true)}
            disabled={isFetching}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      {isFetching && !isLoading && (
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm z-50 flex items-center gap-2 shadow-lg">
          <RefreshCw size={14} className="animate-spin" />
          <span>Updating...</span>
        </div>
      )}

      <div className="w-full px-3 sm:px-4 lg:px-6 mt-4">
        <div className="max-w-7xl mx-auto">
          {/* Refresh Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => fetchAccessories(true)}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
              <span>{isFetching ? 'Refreshing...' : 'Refresh Accessories'}</span>
            </button>
          </div>

          {/* Accessories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {isLoading ? [...Array(8)].map((_, index) => (
              <AccessoryCardSkeleton key={index} />
            )) : accessories.map((accessory) => {
              const currentImage = getCurrentImage(accessory);
              const totalPrice = calculateTotalPrice(accessory);
              const originalPrice = calculateOriginalPrice(accessory);
              const discount = Math.round(
                ((originalPrice - totalPrice) / originalPrice) * 100
              );
              const productSlug = slugify(accessory.name);

              return (
                <div
                  key={accessory._id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 flex flex-col items-center text-center border border-gray-100 hover:border-gray-200"
                >
                  {/* Accessory Image */}
                  {currentImage && (
                    <Link href={`/category/accessories/${productSlug}`} className="block w-full">
                      <div className="relative w-full aspect-square max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] mx-auto ">
                        <Image
                          src={currentImage}
                          alt={accessory.name}
                          fill
                          className="object-contain rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
                          sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </Link>
                  )}

                  {/* Accessory Name */}
                  <Link href={`/category/accessories/${productSlug}`} className="block w-full ">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-amber-600 transition-colors duration-200 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem] mb-[-12]">
                      {accessory.name}
                    </h3>
                  </Link>

                  {/* Accessory Type */}
                 

                  {/* Price Section */}
                  <div className=" sm:mb-4 w-full">
                    <p className="text-base sm:text-lg font-bold text-gray-900 mb-1 max-sm:text-[13px]">
                      ৳ {totalPrice.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="line-through text-gray-400 max-sm:text-[12px]">
                        ৳ {originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-600 max-sm:text-[12px] font-medium px-2 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    </div>
                    {accessory.inStock && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        Out of Stock
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row gap-2 w-full mt-auto">
                    <button
                      onClick={() => handleShowNow(accessory)}
                      disabled={accessory.inStock}
                      className="flex-1 flex items-center justify-center gap-1 rounded-full bg-white text-black border border-black px-2 py-1.5 sm:py-2 hover:bg-gray-50 transition-colors duration-200 font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{!accessory.inStock ? 'Order Now' : 'Out of Stock'}</span>
                    </button>

                    <button
                      onClick={() => handleAddToCart(accessory)}
                      disabled={accessory.inStock}
                      className="flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 px-2 py-1.5 sm:py-2 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 min-w-[36px] sm:min-w-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                      title={accessory.inStock ? "Add to cart" : "Out of stock"}
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