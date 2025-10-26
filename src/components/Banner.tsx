'use client'
import React, { useState, useEffect } from 'react';

interface BannerData {
  section1?: string[];
  section2?: string[];
  // allow additional fields from API without using `any`
  [key: string]: unknown;
}

const HeroBannerSlider: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Fetch banner data from API
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/lendingbenar`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch banner data");
        }

        const data = await res.json();
        setBannerData(data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  const sliderImages = bannerData?.section2 || [];
  const sidebarProducts = bannerData?.section1 || [];

  // Auto-slide functionality
  useEffect(() => {
    if (sliderImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const nextSlide = () => {
    if (sliderImages.length === 0) return;
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (sliderImages.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-96 lg:h-[500px] bg-gray-300 animate-pulse rounded-3xl"></div>
          <div className="lg:col-span-1 space-y-4">
            <div className="h-48 lg:h-[242px] bg-gray-300 animate-pulse rounded-3xl"></div>
            <div className="h-48 lg:h-[242px] bg-gray-300 animate-pulse rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!bannerData || (sliderImages.length === 0 && sidebarProducts.length === 0)) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="bg-gray-100 rounded-3xl p-8 text-center">
          <p className="text-gray-500">No banner data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Slider - Takes 2 columns on large screens */}
        {sliderImages.length > 0 && (
          <div className="lg:col-span-2 relative overflow-hidden rounded-[10px] shadow-2xl bg-black">
            {/* Slides */}
            <div className="relative h-96 max-sm:h-60 lg:h-[500px]">
              {sliderImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark overlay */}
                  
                  {/* Content overlay - Optional, remove if not needed */}
                  
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 max-sm:w-3 max-sm:h-3"  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 max-sm:w-2 max-sm:h-2 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide 
                      ? 'bg-orange-500 w-10 h-3' 
                      : 'bg-white/60 hover:bg-white/90 w-3 h-3'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Product Tiles - Takes 1 column on large screens */}
        {sidebarProducts.length > 0 && (
          <div className="lg:col-span-1 space-y-4 max-sm:flex max-sm:overflow-x-auto max-sm:flex-row max-sm:space-y-0 max-sm:space-x-4 max-sm:pb-2">
            {sidebarProducts.map((imageUrl, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-[10px] shadow-xl h-48 max-sm:h-30 lg:h-[242px] group cursor-pointer transition-transform duration-300 hover:scale-105 ${
                  index === 0 ? 'bg-gray-900' : 'bg-amber-100'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
               
                
                {/* Optional product info overlay */}
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBannerSlider;