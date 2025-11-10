'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

// Fallback local image (if needed)
const ipad = '/fallback-image.jpg';

const AppleProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}/landingetproduct/get`);
        console.log('Landing Product Data:', res.data);

        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
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

  return (
    <div className="lg-mx-25 px-4 py-8 bg-gray-100 mt-4">
      {loading ? (
        <div className="text-center text-gray-600">Loading products...</div>
      ) : (
        <div className="relative">
          {/* Horizontal Scroll Container */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className="flex-none w-72 snap-start"
              >
                <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
                  {/* Product Image */}
                  <div className="relative w-48 h-48 mb-4">
                    <Image
                      src={product.image || ipad}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      priority
                    />
                  </div>

                  {/* Product Name */}
                  <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                    {product.name}
                  </h2>

                  {/* Product Price */}
                  <p className="text-lg font-medium text-gray-700 text-center mb-4">
                    ৳{product.price}
                  </p>

                  {/* View Button */}
                  <Link href={`/category/product/${product.productlink || '#'}`} className="w-full">
                    <button className="w-full px-4 py-2 rounded-2xl bg-white text-black border border-gray-400 font-medium hover:bg-orange-700 hover:text-white transition-colors duration-200">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppleProduct;