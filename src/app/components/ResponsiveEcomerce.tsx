'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Menu, X, Search, ShoppingCart, Heart, User
} from 'lucide-react';
import Image from 'next/image';
import logo from './../../../public/WhatsApp_Image_2025-08-23_at_19.59.58__1_-removebg-preview (1).png'

const AppleNavbar = () => {
  const router = useRouter();
  console.log()
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [searchParams]);

  // Handle search functionality
  const handleSearch = (query: string): void => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setIsMobileSearchOpen(false);
  };

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   handleSearch(searchQuery);
  // };

  const navigationLinks = [
    { name: 'iPhone', href: '/category/iphone' },
    { name: 'Mac', href: '/category/macbook' },
    { name: 'iPad', href: '/category/ipad' },
    { name: 'Apple Watch', href: '/category/apple-watch' },
    { name: 'AirPods', href: '/category/airpods' },
    { name: 'Accessories', href: '/category/accessories' }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top announcement bar - Apple style */}
      {/* <div className="bg-gray-900 text-white text-center py-2 text-sm hidden sm:block">
        <span className="font-medium">Get $200 credit toward iPhone 15 when you trade in iPhone 12 or later.</span>
        <Link href="/trade-in" className="ml-2 text-blue-400 hover:text-blue-300 underline">
          Learn more
        </Link>
      </div> */}

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - Apple-inspired design */}
          <div className="flex-shrink-0 lg:mr-8">
            <Link href="/" className="flex items-center">
<Image src={logo} alt="Logo" className="w-35 h-35" />
              {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                AppleHub
              </h1> */}
            </Link>
          </div>

          {/* Desktop navigation links - Made more visible */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 mr-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors whitespace-nowrap py-2 px-1"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search bar - Responsive behavior */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(searchQuery);
                  }
                }}
                placeholder="Search for iPhone, Mac, iPad..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Action buttons - Responsive spacing */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle search"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            
            <Link href="/wishlist" className="hidden sm:block p-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors">
              <Heart size={20} />
            </Link>
            
            <Link href="/cart" className="p-2 relative text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </Link>
            
            <Link href="/deshboard" className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search bar - Slides down when search icon is clicked */}
      {isMobileSearchOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(searchQuery);
                }
              }}
              placeholder="Search for iPhone, Mac, iPad..."
              autoFocus
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base"
            />
            <button 
              onClick={() => handleSearch(searchQuery)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          {/* Mobile navigation links */}
          <div className="py-2">
            {[
              ...navigationLinks,
              { name: 'Account', href: '/account' },
              { name: 'Wishlist', href: '/wishlist' },
              { name: 'Orders', href: '/orders' },
              { name: 'Help', href: '/help' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppleNavbar;