import React from 'react';
import macbook from '@/../public/mba13-m4-skyblue-gallery1-202503.png'
import Image from 'next/image';
import Link from 'next/link';

const Macbook = () => {
    return (
        <div className='bg-gray-100 flex flex-col items-center justify-center mt-4'>
            <h1 className='text-5xl font-medium mt-20 max-md:text-3xl '>MacBook Air</h1>
            <p className='text-2xl mb-2 max-md:text-[14px] mt-4'>high performance with m4 chip
            </p>
         <div className="flex gap-4 justify-center my-4 mt-4 mb-10">
        <button className="px-9 py-2 rounded-2xl text-black hover:bg-orange-500 hover:text-white hover:border-orange-500 transition border-1 border-black max-md:px-5 max-md:text-[12px]">
          Learn More
        </button>
        <Link href={'/category/macbook/macbook-air-m4'} className="px-8 py-3 rounded-2xl bg-orange-500 text-white  transition max-md:px-5  max-md:text-[12px]">
          Buy Now
        </Link>
      </div>

            <div>
                <Image src={macbook} alt='macbook' />
            </div>

              <p className="flex justify-center mt-10 font-medium max-md:text-[12px] mb-4 bg-gradient-to-r from-black via-orange-300 via-pink-500 to-orange-500 
           bg-clip-text text-transparent ">
        Built for Apple Intelligence
      </p>

        </div>
    );
};

export default Macbook;