'use client'
import Image from 'next/image';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface BannerData {
  section1?: string[];
  section2?: string[];
  [key: string]: unknown;
}

const HeroBannerSlider: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Fetch banner data from API
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/lendingbenar`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: 'no-store'
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error("No banner data received");
        }
        
        setBannerData(data[0]);
      } catch (err) {
        console.error('Banner fetch error:', err);
        setError(err instanceof Error ? err.message : "Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  const sliderImages = useMemo(() => bannerData?.section2 || [], [bannerData?.section2]);
  const sidebarProducts = useMemo(() => bannerData?.section1 || [], [bannerData?.section1]);

  // Navigation handlers with useCallback
  const nextSlide = useCallback(() => {
    if (sliderImages.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, [sliderImages.length]);

  const prevSlide = useCallback(() => {
    if (sliderImages.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  }, [sliderImages.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-slide with pause functionality
  useEffect(() => {
    if (sliderImages.length <= 1 || isPaused) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length, isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-60 sm:h-80 lg:h-[300px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-[10px]" />
          <div className="lg:col-span-1 flex gap-4 lg:flex-col">
            <div className="flex-1 h-48 lg:h-[142px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-[10px]" />
            <div className="flex-1 h-48 lg:h-[142px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-[10px]" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-[10px] p-6 sm:p-8 text-center">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 font-semibold text-lg mb-2">Unable to Load Banner</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!bannerData || (sliderImages.length === 0 && sidebarProducts.length === 0)) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="bg-gray-50 border-2 border-gray-200 rounded-[10px] p-8 text-center">
          <p className="text-gray-600 font-medium">No banner content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Slider */}
        {sliderImages.length > 0 && (
          <div 
            className="lg:col-span-2 relative overflow-hidden rounded-[10px] shadow-2xl bg-gray-900 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            role="region"
            aria-label="Image carousel"
          >
            {/* Slides */}
            <div className="relative h-60 sm:h-80 lg:h-[300px]">
              {sliderImages.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  aria-hidden={index !== currentSlide}
                >
                  <Image
                    src={imageUrl}
                    alt={`Banner slide ${index + 1} of ${sliderImages.length}`}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    quality={90}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 66vw"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Show only if more than 1 slide */}
            {sliderImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-3 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-900 rounded-full p-2 sm:p-3 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 z-20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Previous slide"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-3 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-900 rounded-full p-2 sm:p-3 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 z-20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Next slide"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
                  {sliderImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                        index === currentSlide 
                          ? 'bg-orange-500 w-8 sm:w-10 h-2.5 sm:h-3' 
                          : 'bg-white/70 hover:bg-white w-2.5 sm:w-3 h-2.5 sm:h-3'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={index === currentSlide}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Sidebar Product Tiles */}
        {sidebarProducts.length > 0 && (
          <div className="lg:col-span-1 flex gap-4 lg:flex-col overflow-x-auto lg:overflow-visible scrollbar-hide pb-2 lg:pb-0">
            {sidebarProducts.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="relative overflow-hidden rounded-[10px] shadow-xl min-w-[200px] sm:min-w-[250px] lg:min-w-0 h-48 sm:h-56 lg:h-[142px] group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 bg-gray-900"
              >
                <Image
                  src={imageUrl}
                  alt={`Featured product ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  quality={85}
                  sizes="(max-width: 1024px) 250px, 33vw"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBannerSlider;