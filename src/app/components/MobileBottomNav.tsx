'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Percent, User } from 'lucide-react';

const MobileBottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      href: '/' 
    },
    { 
      id: 'category', 
      label: 'Category', 
      icon: Grid, 
      href: '/category' 
    },
    { 
      id: 'offer', 
      label: 'Offer', 
      icon: Percent, 
      href: '/offers' 
    },
    { 
      id: 'signin', 
      label: 'Sign In', 
      icon: User, 
      href: '/deshboard' 
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 sm:h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-95"
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
  );
};

export default MobileBottomNav;