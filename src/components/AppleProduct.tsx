'use client';

import React from 'react';
import Image from 'next/image';

// Fixed import paths - should be relative to public folder
import ipad from '@/../public/hero__ecv967jz1y82_large-removebg-preview.png';
import iphon from '@/../public/iphon.png';
import applywatch from '@/../public/welcome_hero_endframe__d71hj6st53gy_xlarge-removebg-preview.png';
import macmin from '@/../public/zokAT5JkBbdn1T5OXZkJ1xvNenKPSGkW0wV4aOXh-removebg-preview.png';
import axios from 'axios';

const products = [
  {
    id: 1,
    title: "iPad Pro",
    image: ipad,
    description: "The ultimate iPad experience"
  },
  {
    id: 2,
    title: "iPhone 14",
    image: iphon,
    description: "Big and bigger"
  },
  {
    id: 3,
    title: "Apple Watch",
    image: applywatch,
    description: "Your essential companion"
  },
  {
    id: 4,
    title: "Mac Mini",
    image: macmin,
    description: "More muscle. More hustle"
  },
];

 const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/lendingbenar/LendingProductget`,);

console.log("Lending Product Data:", response);
const AppleProduct = () => {
  return (
    <div className=" mx-auto px-4 py-8 bg-gray-100 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="relative w-48 h-48 mb-4">
              <Image 
                src={product.image} 
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority={product.id <= 2} // Prioritize first two images
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              {product.title}
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              {product.description}
            </p>
            <div className="flex  sm:flex-row gap-3 w-full text-nowrap max-md:text-[12px]">
              <button className="flex-1 px-4 py-2 rounded-2xl border border-black hover:bg-gray-200 text-gray-900  transition-colors duration-200 max-md:py-0 max-md:rounded-[10px] ">
                Learn More
              </button>
              <button className="flex-1 px-2 py-2 rounded-2xl bg-orange-500 text-white hover:bg-orange-700  transition-colors duration-200 max-md:rounded-[10px]">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppleProduct;