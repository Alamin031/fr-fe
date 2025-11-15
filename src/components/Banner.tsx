'use client'
import Image from 'next/image';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Types
interface BannerData {
  section1?: string[];
  section2?: string[];
}

const AUTO_SLIDE_INTERVAL = 5000;

const NextArrow: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-lg z-10 transition hidden md:block"
    aria-label="Next Slide"
  >
    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
  </button>
);

const PrevArrow: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-lg z-10 transition hidden md:block"
    aria-label="Previous Slide"
  >
    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
  </button>
);

const HeroBannerSlider: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBannerData = async () => {
      try {
        const baseUri = process.env.NEXT_PUBLIC_BASE_URI || '';
        const res = await fetch(`${baseUri}/lendingbenar`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        if (isMounted) {
          if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Banner data is empty');
          }
          setBannerData(data[0]);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load banner');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBannerData();
    return () => {
      isMounted = false;
    };
  }, []);

  const sliderImages = useMemo(() => bannerData?.section2 || [], [bannerData]);
  const sidebarProducts = useMemo(() => bannerData?.section1 || [], [bannerData]);
  const hasMultipleSlides = sliderImages.length > 1;

  const nextSlide = useCallback(() => {
    if (sliderImages.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, [sliderImages.length]);

  const prevSlide = useCallback(() => {
    if (sliderImages.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  }, [sliderImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    handleManualInteraction();
  };

  const handleManualInteraction = useCallback(() => {
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    setIsPaused(true);
    interactionTimeout.current = setTimeout(() => setIsPaused(false), AUTO_SLIDE_INTERVAL);
  }, []);

  const onNextClick = () => {
    nextSlide();
    handleManualInteraction();
  };

  const onPrevClick = () => {
    prevSlide();
    handleManualInteraction();
  };

  useEffect(() => {
    if (!hasMultipleSlides || isPaused) return;

    slideInterval.current = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [hasMultipleSlides, isPaused, nextSlide]);

  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) onNextClick();
    if (distance < -minSwipeDistance) onPrevClick();
  };

  if (loading) return <BannerSkeleton />;
  if (error || (!sliderImages.length && !sidebarProducts.length)) return null;

  const showSidebar = sidebarProducts.length > 0;

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 mx-auto pt-2 md:pt-4 pb-b md:pb-8">
      <div
        className="grid grid-cols-1 "
        style={{ gridTemplateColumns: showSidebar ? '1fr 0' : '1fr' }}
      >
        <div
          className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderImages.map((imageUrl, index) => (
              <div key={index} className="w-full h-[180px] sm:h-[260px] md:h-[360px] lg:h-[450px] relative flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={`Banner Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {hasMultipleSlides && <PrevArrow onClick={onPrevClick} />}
          {hasMultipleSlides && <NextArrow onClick={onNextClick} />}

          {hasMultipleSlides && (
            <div className="absolute bottom-2 left-0 w-full px-4">
              <div className="flex items-center space-x-1 w-full max-w-xs mx-auto rounded-full bg-white/40 backdrop-blur-sm ">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-1 flex-grow rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-orange-500'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const BannerSkeleton = () => (
  <div className="w-full px-2 sm:px-4 md:px-6 mx-auto pt-2 md:pt-4 pb-4 md:pb-8">
    <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg bg-gray-200">
      {/* Main banner skeleton */}
      <div className="w-full h-[180px] sm:h-[260px] md:h-[360px] lg:h-[450px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
      
      {/* Navigation arrows skeleton */}
      <div className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 hidden md:block">
        <div className="w-10 h-10 bg-white/30 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 hidden md:block">
        <div className="w-10 h-10 bg-white/30 rounded-full animate-pulse"></div>
      </div>
      
      {/* Dots indicator skeleton */}
      <div className="absolute bottom-2 left-0 w-full px-4">
        <div className="flex items-center space-x-1 w-full max-w-xs mx-auto rounded-full bg-white/40 backdrop-blur-sm p-2">
          <div className="h-1 flex-grow rounded-full bg-white/50 animate-pulse"></div>
          <div className="h-1 flex-grow rounded-full bg-white/50 animate-pulse"></div>
          <div className="h-1 flex-grow rounded-full bg-white/50 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);
export default HeroBannerSlider;
