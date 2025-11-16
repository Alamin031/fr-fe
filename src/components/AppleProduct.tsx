'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

// Define interfaces for your product data
interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  image: string;
  productlink?: string;
  installment?: number;
  badges?: string[];
}

interface ApiResponse {
  data: Product[];
  success?: boolean;
  message?: string;
}

const IPAD_FALLBACK = '/fallback-image.jpg';

const AppleProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URI}/landingetproduct/get`
        );
        console.log('Landing Product Data:', res.data);

        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Format price to Bangladesh Taka
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate installment (assuming 12 months)
  const calculateInstallment = (price: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price / 12);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Header */}
      <div className=" mx-auto mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">APPLE</h1>
        
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className=" mx-auto grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const CardWrapper = product.productlink 
              ? ({ children }: { children: React.ReactNode }) => (
                  <Link href={`category/product/${product.productlink}` || '#'} className="block">
                    {children}
                  </Link>
                )
              : ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

            return (
              <CardWrapper key={product._id}>
                <div className="bg-white rounded-[50px] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
                  {/* Store Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[10px] max-sm:text-[5px]">FRIENDSTELECOM</span>
                      {/* <span className="text-xs text-gray-500">STORE</span> */}
                    </div>
                    <div className="flex items-center gap-1 max-sm:[5px]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <div className="text-xs max-sm:text-[5px]">
                        <div className="font-semibold">Apple Official</div>
                        <div className="text-gray-500 max-sm:text-[5px]">1 year warranty</div>
                      </div>
                    </div>
                  </div>
                   {/* Product Name */}
                  <div className="px-4 pt-4 flex justify-center">
                    <h3 className="text-xs max-sm:text-[10px] text-gray-500 mb-1 max-sm:mb-0 uppercase tracking-wide">
                      {product.name}
                    </h3>
                  </div>

                  {/* Product Image */}
                  <div className="relative p-8 max-sm:p-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white h-64 max-sm:h-30">
                    
                    <Image
                      src={product.image || IPAD_FALLBACK}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = IPAD_FALLBACK;
                      }}
                    />
                  </div>

                 

                  {/* Badges */}
                  <div className=" max-sm:pl-2 flex flex-wrap bg-gray-900 mx-5 max-sm:mx-0 gap-1 ">
                    <span className=" text-white text-[6px] max-sm:text-[4px] px-2 max-sm:px-0  py-1 rounded ">
                      100% ORIGINAL
                    </span>
                    <span className=" text-white text-[6px] max-sm:text-[4px] px-2 max-sm:px-0 max py-1 rounded">
                      FREE ONGKIR SE-INDONESIA
                    </span>
                    <span className=" text-white text-[6px] max-sm:text-[4px] px-2 py-1 max-sm:px-0 rounded">
                      GARANSI RESMI
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="px-6 pb-3">
                    <h2 className="text-xl max-sm:text-[10px] font-semibold mt-5 text-gray-900 mb-2 uppercase">
                      {product.name}
                    </h2>
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-1">discound Price</p>
                      <p className="text-xl max-sm:text-[10px] font-bold text-green-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    {/* <div>
                      <p className="text-xs text-gray-600 mb-1">price</p>
                      <div className="flex items-center gap-2">
                         <p className="text-sm font-semibold text-gray-900">
                          {calculateInstallment(product.price)}
                        </p> 
                         <span className="text-xs text-blue-600 font-medium">Kredivo</span> 
                      </div>
                    </div> */}
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-500 text-lg">No products available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default AppleProduct;