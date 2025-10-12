'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, X, Search, ShoppingCart, Heart, User, ChevronDown, Home, Grid, Percent,
} from 'lucide-react';
import Image from 'next/image';
import logo from './../../../public/WhatsApp_Image_2025-08-23_at_19.59.58__1_-removebg-preview (1).png';

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
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);

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

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'category', label: 'Category', icon: Grid, href: '/category' },
    { id: 'offer', label: 'Offer', icon: Percent, href: '/offers' },
    { id: 'signin', label: 'Sign In', icon: User, href: '/deshboard' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 -ml-2 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 lg:mr-8">
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="Logo" className="w-35 h-35" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-1 mr-8">
            {navigationLinks.map((link) => (
              link.children ? (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium text-gray-700 rounded-md ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                  >
                    {link.name}
                    <ChevronDown size={16} className="ml-1 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="absolute left-0 hidden group-hover:block pt-2">
                    <div className="bg-white rounded-md shadow-lg border p-2 w-64 animate-in fade-in-0 zoom-in-95">
                      <div className="grid gap-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block select-none rounded-sm px-3 py-2 text-sm text-gray-700 outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium text-gray-700 rounded-md ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Search for iPhone, Mac, iPad..."
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
              aria-label="Toggle search"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <Link 
              href="/wishlist" 
              className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>
            <Link 
              href="/cart" 
              className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-semibold leading-none text-white">
                3
              </span>
            </Link>
            <Link 
              href="/deshboard" 
              className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
              aria-label="User account"
            >
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile side menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-in fade-in-0"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-xl lg:hidden animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              {navigationLinks.map((item) => (
                <div key={item.name} className="mb-2">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => !item.children && setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <button
                        onClick={() => setIsAccessoriesOpen(!isAccessoriesOpen)}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                      >
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${isAccessoriesOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  {item.children && isAccessoriesOpen && (
                    <div className="ml-4 mt-1 space-y-1 animate-in fade-in-0 slide-in-from-top-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => setIsMobileMenuOpen(false)}
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
        </>
      )}

      {/* Mobile search overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t px-4 py-3 animate-in fade-in-0 slide-in-from-top-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Search for iPhone, Mac, iPad..."
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex justify-around items-center h-16 sm:h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-inset"
              >
                <Icon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 transition-colors ${
                    active ? 'text-orange-500' : 'text-gray-500'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span 
                  className={`text-[10px] sm:text-xs font-medium ${
                    active ? 'text-orange-500' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </nav>
  );
};

export default AppleNavbar;