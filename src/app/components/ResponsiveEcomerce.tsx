'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, X, Search , Heart, User, ChevronDown, Home, Grid, Percent,
  ShoppingBag,
} from 'lucide-react';
import Image from 'next/image';
import logo from './../../../public/WhatsApp_Image_2025-08-23_at_19.59.58__1_-removebg-preview (1).png';
import { useaddtobagStore } from '../../../store/store';
console.log("useaddtobagStore", useaddtobagStore);
import { useSidebarStore } from '../../../store/store';
import AddTobag from '@/components/utils/Addtobag';
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

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ className = "w-10 h-10", strokeWidth = 2 }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    x="0px" 
    y="0px" 
    width="100" 
    height="100" 
    viewBox="0 0 48 48"
  >
    <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6 C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path>
    <path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6 C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3 L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path>
    <path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3 L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24 c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2 c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path>
    <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8 l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path>
    <path 
      fill="#fff" 
      fillRule="evenodd" 
      d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0 s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3 c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9 c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8 c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" 
      clipRule="evenodd"
    ></path>
  </svg>
);

const AppleNavbar = () => {
  const { order } = useaddtobagStore();
  const { toggleSidebar } = useSidebarStore();
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
    { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, href: 'https://wa.me/8801343159931' },
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
                  className="inline-flex font-medium  items-center justify-center h-10 px-4 py-2 text-sm  text-gray-700 rounded-md ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
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
            {/* <Link 
              href="/wishlist" 
              className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link> */}
            <button
            onClick={toggleSidebar}

              className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs mt-[2px]  font-semibold leading-none text-white">
                {order.length}
              </span>
            </button>
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
                className="inline-flex items-center justify-center mt-[-8px] h-10 w-10 rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
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
                {...(item.id === 'whatsapp' && { target: '_blank', rel: 'noopener noreferrer' })}
                className="flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-inset"
              >
                <Icon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 transition-colors ${
                    active ? 'text-orange-500' : item.id === 'whatsapp' ? 'text-green-500' : 'text-gray-500'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span 
                  className={`text-[10px] sm:text-xs font-medium ${
                    active ? 'text-orange-500' : item.id === 'whatsapp' ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      <>
      <AddTobag></AddTobag>
      </>
    </nav>
  );
};

export default AppleNavbar;