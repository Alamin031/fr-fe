"use client";

import ShopNowLogo from "@/components/ui/ShopNowLogo";
import WhatsappLogo from "@/components/ui/WhatsappLogo";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';


// Type definitions (same as before)
interface OptionConfig {
  id: string;
  label: string;
  price: number;
}

interface ColorConfig {
  id: string;
  color: string;
  image?: string;
  price: number;
}

interface RegionConfig {
  name: string;
  price: number;
}

interface Detail {
  id: string;
  label: string;
  value: string;
}

interface SecondDetail {
  id: string;
  seconddetails: string;
  value: string;
}

interface Product {
  name: string;
  basePrice: string;
  cpuCoreConfigs: OptionConfig[];
  gpuCoreConfigs: OptionConfig[];
  storageConfigs: OptionConfig[];
  ramConfigs: OptionConfig[];
  displayConfigs: OptionConfig[];
  colorImageConfigs: ColorConfig[];
  dynamicRegions: RegionConfig[];
  details: Detail[];
  secondDetails: SecondDetail[];
}

type SelectedOptions = {
  cpu: string | null;
  gpu: string | null;
  storage: string | null;
  ram: string | null;
  display: string | null;
  color: string | null;
  region: string | null;
};

const Macbookdetails: React.FC = () => {
  const { productName } = useParams() as { productName: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    cpu: null,
    gpu: null,
    storage: null,
    ram: null,
    display: null,
    color: null,
    region: null,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeDetails, setActiveDetails] = useState<"default" | "second">("default");
  const [addingToCart, setAddingToCart] = useState(false);

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['macbook', productName],
    enabled: !!productName,
    queryFn: async () => {
      const res = await axios.get<Product>("/api/getproduct/macbookdetails/product", { params: { name: productName } });
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
  
  const errorMessage = (queryError as unknown) ? (queryError instanceof Error ? queryError.message : 'Failed to load product. Please try again.') : null;

  useEffect(() => {
    if (!data) return;
    setProduct(data);
    const initialOptions: SelectedOptions = {
      cpu: data.cpuCoreConfigs[0]?.id || null,
      gpu: data.gpuCoreConfigs[0]?.id || null,
      storage: data.storageConfigs[0]?.id || null,
      ram: data.ramConfigs[0]?.id || null,
      display: data.displayConfigs[0]?.id || null,
      color: data.colorImageConfigs[0]?.id || null,
      region: data.dynamicRegions[0]?.name || null,
    };
    setSelectedOptions(initialOptions);
    if (data.displayConfigs[0]?.label === '13.6" Display') setActiveDetails("default");
    else if (data.displayConfigs[0]?.label === '15.3" Display') setActiveDetails("second");
  }, [data]);

  useEffect(() => {
    if (!product) return;

    let price = parseFloat(product.basePrice);

    const addOptionPrice = (
      optionId: string | null,
      options: OptionConfig[] | ColorConfig[] | RegionConfig[],
      key: keyof SelectedOptions
    ) => {
      if (!optionId) return 0;
      const option =
        key === "region"
          ? (options as RegionConfig[]).find((opt) => opt.name === optionId)
          : (options as OptionConfig[] | ColorConfig[]).find((opt) => opt.id === optionId);
      return option ? parseFloat(option.price.toString()) : 0;
    };

    price += addOptionPrice(selectedOptions.cpu, product.cpuCoreConfigs, "cpu");
    price += addOptionPrice(selectedOptions.gpu, product.gpuCoreConfigs, "gpu");
    price += addOptionPrice(selectedOptions.storage, product.storageConfigs, "storage");
    price += addOptionPrice(selectedOptions.ram, product.ramConfigs, "ram");
    price += addOptionPrice(selectedOptions.display, product.displayConfigs, "display");
    price += addOptionPrice(selectedOptions.color, product.colorImageConfigs, "color");
    price += addOptionPrice(selectedOptions.region, product.dynamicRegions, "region");

    // Update active details based on display
    const displayOption = product.displayConfigs.find((d) => d.id === selectedOptions.display);
    if (displayOption?.label === '13.6" Display') setActiveDetails("default");
    else if (displayOption?.label === '15.3" Display') setActiveDetails("second");

    setTotalPrice(price);
  }, [product, selectedOptions]);

  const handleOptionChange = (category: keyof SelectedOptions, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: value }));
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Adding to cart:", {
        product: product?.name,
        options: selectedOptions,
        totalPrice,
      });
      alert("Product added to cart!");
    } catch {
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShopNow = () => {
    // Add your shop now logic here
    console.log("Shop Now clicked:", {
      product: product?.name,
      options: selectedOptions,
      totalPrice,
    });
    // For example, redirect to checkout or open shop modal
    alert("Redirecting to shop...");
  };

  const handleWhatApp = () => {
    // Add your WhatsApp logic here
    const message = `Hi! I'm interested in ${product?.name} with the following configuration:
    
Product: ${product?.name}
Total Price: $${totalPrice.toLocaleString()}
    
Please let me know more details!`;
    
    const whatsappUrl = `https://wa.me/01343159931?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6 flex"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Product</h2>
          <p className="text-gray-600">Please wait while we fetch the details...</p>
        </div>
      </div>
    );

  if (queryError)
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!product) return null;

  const selectedColorConfig = product.colorImageConfigs.find((opt) => opt.id === selectedOptions.color);

  // Helper component for option selection
  const OptionButton = ({
    option,
    category,
    isSelected,
    showPrice = true,
  }: {
    option: OptionConfig | RegionConfig;
    category: keyof SelectedOptions;
    isSelected: boolean;
    showPrice?: boolean;
  }) => (
    <button
      type="button"
      onClick={() => handleOptionChange(category, "id" in option ? option.id : option.name)}
      className={`w-full p-2 max-sm:text-[12px] font text-left border-1 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isSelected
          ? "border-gray-600 bg-gray-50 shadow-md"
          : "border-gray-200 border-1 bg-white hover:border-blue-300 hover:shadow-sm"
      }`}
      aria-pressed={isSelected}
    >
      <div className="font-medium text-gray-900">{"label" in option ? option.label : option.name}</div>
      {showPrice && option.price > 0 && (
        <div className="text-sm text-blue-600 mt-1 font-medium">+${option.price.toLocaleString()}</div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12 max-sm:mb-6">
          <h1 className="text-4xl md:text-5xl font-bold  mb-2 text-gray-900">{product.name}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="order-1 lg:order-1">
            <div className="">
              <div className=" rounded-2xl   aspect-square flex items-center justify-center overflow-hidden  ">
                {selectedColorConfig?.image ? (
                  
                  <Image
                    src={selectedColorConfig.image}
                    alt={`${product.name} in ${selectedColorConfig.color}`}
                    className=" h-full object-contain transition-opacity duration-300"
                    width={500}
                    height={500}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-product.png";
                    }}
                    
                  />

                  
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-500 text-lg">Image not available</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-2">
                
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                  {product.colorImageConfigs.map((color) => (
                    <div key={color.id} className="text-center">
                      <button
                        type="button"
                        onClick={() => handleOptionChange("color", color.id)}
                        className={`relative p-2 border-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2  focus:ring-offset-2 ${
                          selectedOptions.color === color.id 
                            ? "border-gray-600 shadow-lg transform scale-110" 
                            : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                        }`}
                        title={color.color}
                        aria-label={`Select ${color.color} color`}
                      >
                        <div
                          className="w-14 h-14 rounded-lg shadow-inner"
                          style={{ backgroundColor: color.color }}
                        />
                        {selectedOptions.color === color.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                      {color.price > 0 && (
                        <div className="text-sm text-blue-600 font-medium mt-2">
                        {color.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Product Configuration */}
          <div className="order-2 lg:order-2 max-sm:mt-[-15px]">
          <div className="border-t border-gray-200 ">
                <div className="bg-gray-50 rounded-xl p-4 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-700">Total Price:</span>
                    <span className="text-xl font-medium text-gray-900">{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Starting at {parseFloat(product.basePrice).toLocaleString()}
                  </div>
                </div>

                {/* Button Group */}
                <div className="space-y-4">
                  {/* Primary Action Button - Add to Cart */}
                  
                 

                  {/* Secondary Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Shop Now Button */}
                    <button
                      onClick={handleShopNow}
                      className="py-2 px-6 font-medium text-base rounded-full border border-gray-300 text-black  active:transform active:scale-[0.98] shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      <span className="flex items-center justify-center">
                        <ShopNowLogo />
                        Shop Now
                      </span>
                    </button>
                    <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`w-full py-2  px-6 font-medium border border-gray-300 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      addingToCart
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : " text-black hover:bg-white active:transform active:scale-[0.98] shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {addingToCart ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Adding to Cart...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 mr-2"></ShoppingCart>
                        Add to Cart
                      </span>
                    )}
                  </button>

                    {/* WhatsApp Button */}
                    
                  </div>
                  <button
                      onClick={handleWhatApp}
                      className="py-2 px-6 font-semibold text-base w-full rounded-full text-green-600  active:transform active:scale-[0.98]  hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2  focus:ring-green-400 focus:ring-offset-2 mb-4 border-2 border-gray-200   "
                    >
                      <span className="flex items-center justify-center w-full">
                        <WhatsappLogo />
                        
                        WhatsApp
                      </span>
                    </button>
                </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Performance Options */}
              <div className="grid md:grid-cols-3 gap-6 mb-4">
                {/* CPU */}
                <div>
                  <h3 className="text-base font-medium max-sm:text-[12px] mb-2 text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Processor
                  </h3>
                  <div className="space-y-2">
                    {product.cpuCoreConfigs.map((cpu) => (
                      <OptionButton
                        key={cpu.id}
                        option={cpu}
                        category="cpu"
                        isSelected={selectedOptions.cpu === cpu.id}
                        showPrice={false}
                      />
                    ))}
                  </div>
                </div>

                {/* GPU */}
                <div>
                  <h3 className="text-base font-medium max-sm:text-[12px] text-gray-900 flex mb-2 items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v8a1 1 0 01-1 1M7 4V3a1 1 0 00-1 1v8a1 1 0 001 1m0 0v2a1 1 0 001 1h8a1 1 0 001-1v-2M7 14h10" />
                    </svg>
                    Graphics
                  </h3>
                  <div className="grid grid-cols-1 max-sm:grid-cols-2  gap-2 ">
                    {product.gpuCoreConfigs.map((gpu) => (
                      <OptionButton
                        key={gpu.id}
                        option={gpu}
                        category="gpu"
                        isSelected={selectedOptions.gpu === gpu.id}
                        showPrice={false}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Storage & RAM Options - FIXED */}
              <div className="grid md:grid-cols-2 gap-6 ">
                {/* Storage */}
                <div>
                  <h3 className="text-base font-medium max-sm:text-[12px] mb-2 text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    Storage
                  </h3>
                  <div className="grid grid-cols-3 max-sm:gird-cols-3 gap-2">
                    {product.storageConfigs.map((storage) => (
                      <OptionButton
                        key={storage.id}
                        option={storage}
                        category="storage"
                        isSelected={selectedOptions.storage === storage.id}
                        showPrice={false}
                      />
                    ))}
                  </div>
                </div>

                {/* RAM */}
                <div>
                  <h3 className="text-base font-medium max-sm:text-[12px] mb-2 text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2  text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Memory
                  </h3>
                  <div className="grid grid-cols-4  gap-2">
                    {product.ramConfigs.map((ram) => (
                      <OptionButton
                        key={ram.id}
                        option={ram}
                        category="ram"
                        isSelected={selectedOptions.ram === ram.id}
                        showPrice={false}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Display & Region Options */}
              <div className="grid md:grid-cols-2 gap-6 mb-2 mt-1">
                {/* Display */}
                <div>
                  <h3 className="text-base font-medium max-sm:text-[12px] mb-2 text-gray-900 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Display
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.displayConfigs.map((display) => (
                      <OptionButton
                        key={display.id}
                        option={display}
                        category="display"
                        isSelected={selectedOptions.display === display.id}
                        showPrice={false}
                      />
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <h3 className="text-base font-medium max-sm:text-[12px] mb-2 text-gray-900 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Region
                  </h3>
                  <div className="grid grid-cols-2 max-sm:grid-cols-3 gap-2">
                    {product.dynamicRegions.map((region) => (
                      <OptionButton
                        key={region.name}
                        option={region}
                        category="region"
                        isSelected={selectedOptions.region === region.name}
                        showPrice={false}
                      />
                    ))}
                  </div>
                </div>
              </div>

             

              
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 pt-8">
              <h2 className="text-3xl max-sm:text font-bold max-sm:font-medium mb-6 text-gray-900">Technical Specifications</h2>
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-4 px-6 font-semibold max-sm:text-[13px] border-b-2 transition-all duration-200 focus:outline-none ${
                    activeDetails === "default" 
                      ? "border-black-600 text-black-600" 
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveDetails("default")}
                >
                  Model Specifications
                </button>
                <button
                  className={`py-4 px-6 font-semibold text-[13px] border-b-2 transition-all duration-200 focus:outline-none ${
                    activeDetails === "second" 
                      ? "border-black text-black" 
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveDetails("second")}
                >
                  Model Specifications
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {activeDetails === "default" ? (
                  <div className="space-y-1">
                    {product.details.map((detail, index) => (
                      <div 
                        key={detail.id} 
                        className={`flex py-3 px-4 rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <span className="font max-sm:text-[12px] text-gray-600 w-48 flex-shrink-0">{detail.label}:</span>
                        <span className="text-gray-900 max-sm:text-[10px] text- ">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {product.secondDetails.map((detail, index) => (
                      <div 
                        key={detail.id} 
                        className={`flex py-3 px-4 rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <span className=" text-gray-600 w-48 max-sm:text-[12px] flex-shrink-0">{detail.seconddetails}:</span>
                        <span className="text-gray-900 max-sm:text-[10px]">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Macbookdetails;