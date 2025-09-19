'use client'
import React from 'react';
import appleiphon from '@/../public/Adobe Express - file.png';
import Image from 'next/image';
import Link from 'next/link';

const PhoneHome = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 mt-4">
      <h1 className="text-5xl font-medium mb-2 flex justify-center max-md:text-4xl pt-20">
        iPhone
      </h1>
      <p className="text-2xl mb-2 max-md:text-[14px] ">
        Introducing the iPhone 16 lineup
      </p>

      <div className="flex gap-4 justify-center my-4">
        <button className="px-9 py-2 rounded-2xl text-black hover:bg-orange-500 hover:text-white hover:border-orange-500 transition border-1 border-black max-md:px-4 max-md:text-[12px]">
          Learn More
        </button>
        <Link href={'category/iphone'} className="px-8 py-3 rounded-2xl bg-orange-500 text-white  transition max-md:px-4  max-md:text-[12px]">
          Buy Now
        </Link>
      </div>

      <p className="flex justify-center mt-2 font-medium max-md:text-[12px] mb-4 bg-gradient-to-r from-black via-orange-300 via-pink-500 to-orange-500 
           bg-clip-text text-transparent">
        Built for Apple Intelligence
      </p>

      {/* Responsive wrapper: stack normally on desktop, reverse on mobile */}
      <div className="flex flex-col-reverse md:flex-col items-center">
        {/* Image */}
        <div className="mt-4">
          <Image
            src={appleiphon}
            alt="Apple iPhone"
            className="w-[300px] h-auto md:w-[500px] min-lg:w-[700px]"
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneHome;
