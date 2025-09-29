'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import useOrderStore from '../../../../../store/store';

type StorageConfig = {
  id: string;
  label: string;
  price: number | string;
  inStock: boolean;
  shortDetails?: string;
};

type ColorConfig = {
  id: string;
  color: string;
  image: string;
  price: number | string;
  inStock: boolean;
};

type SimConfig = {
  id: string;
  type: string;
  price: number | string;
  inStock: boolean;
};

type RegionConfig = {
  name: string;
  price: number | string;
  inStock: boolean;
};

type Detail = {
  id: string;
  label: string;
  value: string;
};

type Product = {
  name: string;
  basePrice: number | string;
  storageConfigs?: StorageConfig[];
  colorImageConfigs?: ColorConfig[];
  simConfigs?: SimConfig[];
  dynamicRegions?: RegionConfig[];
  details?: Detail[];
};

const Page = () => {
  const params = useParams();
  const productName = params?.productName as string | undefined;
  const { addOrder , clearOrder} = useOrderStore()

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStorage, setSelectedStorage] = useState<StorageConfig | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorConfig | null>(null);
  const [selectedSim, setSelectedSim] = useState<SimConfig | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionConfig | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Order Now click handler
  const handleOrderNow = () => {
    if (!selectedStorage || !selectedColor || !selectedSim || !selectedRegion) {
      alert('Please select all required options before ordering.');
      return;
    }
    // const storagePrice = Number(selectedStorage?.label) || 0;
    clearOrder()
    // Create order data
     addOrder({
      productId: productName || '',
      productName: product?.name || '',
      price: totalPrice,
      storage: selectedStorage.label,
      color: selectedColor.color,
      sim: selectedSim.type,
      region: selectedRegion.name,
      totalPrice: totalPrice    });

    // Store order data in localStorage for checkout
    // localStorage.setItem('currentOrder', JSON.stringify(orderData));
    
    // Navigate to checkout page
    window.location.href = '/checkout';
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `/api/getproduct/ipaddetails/product?name=${productName}`
        );
        const data: Product = await response.json();
        setProduct(data);

        // Set default selections
        if (data.storageConfigs?.length) {
          setSelectedStorage(data.storageConfigs[0]);
        }
        if (data.colorImageConfigs?.length) {
          setSelectedColor(data.colorImageConfigs[0]);
          setCurrentImage(data.colorImageConfigs[0].image);
        }
        if (data.simConfigs?.length) {
          setSelectedSim(data.simConfigs[0]);
        }
        if (data.dynamicRegions?.length) {
          setSelectedRegion(data.dynamicRegions[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    if (productName) {
      fetchProduct();
    }
  }, [productName]);

  // Calculate total price
  useEffect(() => {
    if (product) {
      const basePrice = Number(product.basePrice) || 0;
      const storagePrice = Number(selectedStorage?.price) || 0;
      const colorPrice = Number(selectedColor?.price) || 0;
      const simPrice = Number(selectedSim?.price) || 0;
      const regionPrice = Number(selectedRegion?.price) || 0;

      setTotalPrice(basePrice + storagePrice + colorPrice + simPrice + regionPrice);
    }
  }, [product, selectedStorage, selectedColor, selectedSim, selectedRegion]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={currentImage || product.colorImageConfigs?.[0]?.image || ''}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnail Gallery */}
          <div>
            <div className="flex gap-3 items-center justify-center">
              {product.colorImageConfigs?.map((config) => (
                <button
                  key={config.id}
                  onClick={() => {
                    setSelectedColor(config);
                    setCurrentImage(config.image);
                  }}
                  disabled={!config.inStock}
                  className={`w-10 h-10 max-sm:w-5 max-sm:h-5 rounded-full border transition-all ${
                    selectedColor?.id === config.id
                      ? 'border-gray-500 '
                      : 'border-gray-300'
                  } ${!config.inStock && 'opacity-50 cursor-not-allowed'}`}
                  style={{ backgroundColor: config.color }}
                  title={config.inStock ? 'Available' : 'Out of Stock'}
                />
              ))}
            </div>
          </div>
         
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text font-semibold text-gray-900">
              <span>{product.name}</span>
              {selectedStorage?.shortDetails && (
                <span className="ml-1">{selectedStorage.shortDetails}</span>
              )}
            </h1>
            <p className="text-[20px] font-semibold text-gray-700 mt-2">
              ৳{totalPrice.toLocaleString()}
            </p>
            
            {/* Dynamic Price Breakdown */}
            <div className="mt-3 text-sm text-gray-600">
              {/* <div className="flex justify-between">
                <span>Base Price:</span>
                <span>৳{Number(product.basePrice).toLocaleString()}</span>
              </div> */}
              {/* {selectedStorage && Number(selectedStorage.price) > 0 && (
                <div className="flex justify-between">
                  <span>Storage ({selectedStorage.label}):</span>
                  <span>+৳{Number(selectedStorage.price).toLocaleString()}</span>
                </div>
              )} */}
              {selectedColor && Number(selectedColor.price) > 0 && (
                <div className="flex justify-between">
                  <span>Color ({selectedColor.color}):</span>
                  <span>+৳{Number(selectedColor.price).toLocaleString()}</span>
                </div>
              )}
              {selectedSim && Number(selectedSim.price) > 0 && (
                <div className="flex justify-between">
                  <span>Network ({selectedSim.type}):</span>
                  <span>+৳{Number(selectedSim.price).toLocaleString()}</span>
                </div>
              )}
              {selectedRegion && Number(selectedRegion.price) > 0 && (
                <div className="flex justify-between">
                  <span>Region ({selectedRegion.name}):</span>
                  <span>+৳{Number(selectedRegion.price).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Storage Options */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Storage</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-sm:grid-cols-4">
              {product.storageConfigs?.map((storage) => (
                <button
                  key={storage.id}
                  onClick={() => setSelectedStorage(storage)}
                  className={`p-2 rounded-lg border text-[13px] font-medium transition-all ${
                    selectedStorage?.id === storage.id
                      ? 'border-gray-400 bg-blue-50 text-blue-700'
                      : storage.inStock
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  {storage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Options */}
          

          {/* SIM Configuration */}
          <div className="flex gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Network</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.simConfigs?.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => sim.inStock && setSelectedSim(sim)}
                    disabled={!sim.inStock}
                    className={`p-2 rounded-lg border-1 text-[13px] transition-all ${
                      selectedSim?.id === sim.id
                        ? 'border-gray-500 bg-blue-50 text-black'
                        : sim.inStock
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {sim.type}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Region</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.dynamicRegions?.map((region, idx) => (
                  <button
                    key={idx}
                    onClick={() => region.inStock && setSelectedRegion(region)}
                    disabled={!region.inStock}
                    className={`p-2 rounded-lg border text-[13px] font-medium transition-all ${
                      selectedRegion?.name === region.name
                        ? 'border-gray-500 bg-blue-50 text-black'
                        : region.inStock
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add to Cart Buttons */}
          <div>
            <div className="flex gap-3 mb-4">
              <button className="w-full bg-white text-black border-gray-400 border-1 py-4 max-sm:py-2 px-6 rounded-lg font-medium text-[13px] hover:bg-blue-700 transition-colors">
                Add to Bag
              </button>
              <button 
                onClick={handleOrderNow}
                className="w-full bg-white text-black text-[13px] border-1 border-gray-400 py-4 max-sm:p-2 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {selectedStorage?.inStock === false ? 'Pre Order' : 'Order Now'}
              </button>
            </div>

            {/* WhatsApp and Messenger Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const phoneNumber = '8801343159931'; // Your WhatsApp number
                  const message = `Hi, I'm interested in ${product.name} ${
                    selectedStorage?.label || ''
                  } - ${selectedColor?.color || ''} for ৳${totalPrice.toLocaleString()}`;
                  window.open(
                    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                    '_blank'
                  );
                }}
                className="flex-1 border-[#25D366] border-1 text-[13px] bg-white text-[#25D366] py-3 max-sm:py-2 px-6 max-sm:px-3 rounded-lg font-semibold hover:bg-[#20BA5A] transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4 max-sm:w-3 max-sm:h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-[13px] max-sm:text-[11px]">WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  const message = `Hi, I'm interested in ${product.name} ${
                    selectedStorage?.label || ''
                  } - ${selectedColor?.color || ''} for ৳${totalPrice.toLocaleString()}`;
                  window.open(
                    `https://m.me/?text=${encodeURIComponent(message)}`,
                    '_blank'
                  );
                }}
                className="flex-1 bg-white text-[#0084FF] border-[#0084FF] border py-3 max-sm:py-2 px-6 max-sm:px-3 rounded-lg font-semibold hover:bg-[#0073E6] transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5 max-sm:w-3 max-sm:h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.974 12-11.11C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
                </svg>
                <span className="text-[13px] max-sm:text-[11px]">Messenger</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-16">
        <h2 className="text-2xl max-sm:text-[15px] font-bold text-gray-900 mb-6">
          Technical Specifications
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {product.details?.map((detail, idx) => (
              <div
                key={detail.id}
                className={`grid grid-cols-3 gap-4 p-4 ${
                  idx % 2 === 0 ? 'bg-gray-50' : ''
                }`}
              >
                <div className="font-semibold text-[13px] text-gray-700">
                  {detail.label}
                </div>
                <div className="col-span-2 text-[11px] text-gray-600">
                  {detail.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;