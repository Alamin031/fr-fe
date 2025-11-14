'use client'
import Image from 'next/image';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Types
interface BannerData {
  section1?: string[]; // Sidebar products
  section2?: string[]; // Main slider
}

const AUTO_SLIDE_INTERVAL = 5000;

const HeroBannerSlider: React.FC = () => {
  // Data State
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Refs for managing intervals without triggering re-renders
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    let isMounted = true;
    const fetchBannerData = async () => {
      try {
        // Ensure URI is defined, fallback gracefully if env is missing during dev
        const baseUri = process.env.NEXT_PUBLIC_BASE_URI || '';
        const res = await fetch(`${baseUri}/lendingbenar`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          next: { revalidate: 60 } // Optional: revalidate every minute if using App router server components elsewhere
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        if (isMounted) {
            if (!Array.isArray(data) || data.length === 0) {
             throw new Error("Banner data is empty");
            }
            setBannerData(data[0]);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Banner fetch error:', err);
          setError(err instanceof Error ? err.message : "Failed to load banner");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBannerData();
    return () => { isMounted = false; };
  }, []);

  // Memoized data for cleaner render logic
  const sliderImages = useMemo(() => bannerData?.section2 || [], [bannerData]);
  const sidebarProducts = useMemo(() => bannerData?.section1 || [], [bannerData]);
  const hasMultipleSlides = sliderImages.length > 1;

  // --- Carousel Navigation Logic ---
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, [sliderImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  }, [sliderImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    handleManualInteraction();
  };

  // Temporarily pause auto-slide on manual interaction (clicks/swipes)
  const handleManualInteraction = useCallback(() => {
    // Clear existing Interaction timeout if user clicks rapidly
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    // Pause
    setIsPaused(true);
    // Resume after delay
    interactionTimeout.current = setTimeout(() => {
      setIsPaused(false);
    }, AUTO_SLIDE_INTERVAL); // Wait one full interval before resuming
  }, []);

  const onNextClick = () => {
    nextSlide();
    handleManualInteraction();
  };

  const onPrevClick = () => {
    prevSlide();
    handleManualInteraction();
  };

  // --- Auto Slide Effect ---
  useEffect(() => {
    if (!hasMultipleSlides || isPaused) return;

    slideInterval.current = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [hasMultipleSlides, isPaused, nextSlide]);

  // --- Keyboard & Touch Support ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Only listen if the user might be interacting with the slider to avoid hijacking page scroll
        if (sliderImages.length <= 1) return;
        if (e.key === 'ArrowLeft') {
            onPrevClick();
        } else if (e.key === 'ArrowRight') {
            onNextClick();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderImages.length]); // Dep intentionally missing click handlers to avoid re-binding

  // Touch handlers
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end on new touch
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) onNextClick();
    if (isRightSwipe) onPrevClick();
  };

  // --- Render States ---

  if (loading) {
    return <BannerSkeleton />;
  }

  if (error || (!sliderImages.length && !sidebarProducts.length)) {
    return null; // Or return a specific error component if preferred, but often better to just collapse the section if it fails.
  }

  return (
    <section 
        className="w-full  mx-auto p-4" 
        aria-label="Promotional Banner"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* MAIN SLIDER AREA (Takes up 8/12 columns on large screens) */}
        <div 
          className={`relative overflow-hidden rounded-2xl shadow-2xl bg-gray-900 group ${sidebarProducts.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured Offers"
        >
          {/* Aspect Ratio Container */}
          <div className="relative aspect-[16/8] sm:aspect-[16/7] lg:aspect-auto lg:h-[400px]">
            {sliderImages.length > 0 ? (
                sliderImages.map((imageUrl, index) => (
                <div
                    key={`${imageUrl}-${index}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${sliderImages.length}`}
                    aria-hidden={index !== currentSlide}
                    className={`absolute inset-0 will-change-[opacity] transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                    <Image
                        src={imageUrl}
                        alt="" // Decorative unless data provides specific alt text
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                </div>
                ))
            ) : (
                 // Fallback if no images in section 2 but data loaded
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                    No images available
                </div>
            )}
          </div>

          {/* Controls Overlay */}
          {hasMultipleSlides && (
            <>
              {/* Gradient overlays for better text/arrow visibility */}
              <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* Arrows - Visible on mobile, show-on-hover on desktop */}
              <button
                onClick={onPrevClick}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/90 text-gray-900 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={onNextClick}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/90 text-gray-900 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                      index === currentSlide 
                        ? 'w-8 bg-orange-500' 
                        : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentSlide}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* SIDEBAR PRODUCTS (Takes up 4/12 columns on large screens) */}
        {sidebarProducts.length > 0 && (
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 h-full">
            {sidebarProducts.slice(0, 2).map((imageUrl, index) => (
              <div
                key={`sidebar-${index}`}
                className="relative overflow-hidden rounded-2xl shadow-md bg-gray-100 group/card h-40 sm:h-48 lg:h-auto"
              >
                <Image
                  src={imageUrl}
                  alt="Featured product"
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

// Separated Skeleton for cleaner main component
const BannerSkeleton = () => (
  <div className="w-full  mx-auto p-4 animate-pulse" aria-busy="true">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8 bg-gray-200 rounded-2xl h-[200px] sm:h-[300px] lg:h-[400px]" />
      <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
        <div className="bg-gray-200 rounded-2xl h-40 lg:h-auto" />
        <div className="bg-gray-200 rounded-2xl h-40 lg:h-auto" />
      </div>
    </div>
  </div>
);

export default HeroBannerSlider;