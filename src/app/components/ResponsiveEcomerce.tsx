'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Menu, X, Search, ShoppingCart, Heart, User, ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import logo from './../../../public/WhatsApp_Image_2025-08-23_at_19.59.58__1_-removebg-preview (1).png'

const accessoriesCategories = [
  { name: 'Mobile Accessories', href: '/category/mobile-accessories' },
  { name: 'Chargers & Cables', href: '/category/chargers-cables' },
  { name: 'Cases & Protection', href: '/category/cases-protection' },
  { name: 'Audio & Headphones', href: '/category/audio-headphones' },
  { name: 'Stands & Mounts', href: '/category/stands-mounts' },
  { name: 'Screen Protection', href: '/category/screen-protection' },
  { name: 'Power Banks', href: '/category/power-banks' },
  { name: 'Wireless Accessories', href: '/category/wireless-accessories' }
];

const AppleNavbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [searchParams]);

  const handleSearch = (query: string): void => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setIsMobileSearchOpen(false);
  };

  const navigationLinks = [
    { name: 'iPhone', href: '/category/iphone' },
    { name: 'Mac', href: '/category/macbook' },
    { name: 'iPad', href: '/category/ipad' },
    { 
      name: 'Accessories', 
      href: '/category/accessories',
      children: accessoriesCategories
    }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 lg:mr-8">
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="Logo" className="w-35 h-35" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 mr-8">
            {navigationLinks.map((link) => (
              link.children ? (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className="flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors whitespace-nowrap py-2 px-1"
                  >
                    {link.name}
                    <ChevronDown size={16} className="ml-1" />
                  </Link>
                  <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg mt-2 w-56">
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors whitespace-nowrap py-2 px-1"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Search for iPhone, Mac, iPad..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <Link href="/wishlist" className="hidden sm:block p-2 hover:bg-gray-100 text-gray-700 rounded-lg">
              <Heart size={20} />
            </Link>
            <Link href="/cart" className="p-2 relative text-gray-700 hover:bg-gray-100 rounded-lg">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </Link>
            <Link href="/deshboard" className="hidden sm:block p-2 hover:bg-gray-100 text-gray-700 rounded-lg">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="py-2">
            {navigationLinks.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between items-center border-b border-gray-100">
                  <Link
                    href={item.href}
                    className="block flex-1 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <button
                      onClick={() => setIsAccessoriesOpen(!isAccessoriesOpen)}
                      className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronDown size={16} />
                    </button>
                  )}
                </div>

                {item.children && isAccessoriesOpen && (
                  <div className="pl-6 bg-gray-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile search overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Search for iPhone, Mac, iPad..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppleNavbar;
