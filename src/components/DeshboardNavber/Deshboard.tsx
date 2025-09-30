'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  BarChart3, 
  SquarePlus,
  FileText, 
  Mail, 
  Tablet,
  LaptopMinimal,
  Smartphone,
  Clipboard, // ✅ added for Order Massage
} from 'lucide-react';

const NavSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Users', icon: Users, href: '/users' },
    { name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { name: 'Reports', icon: FileText, href: '/reports' },
    { name: 'Messages', icon: Mail, href: '/messages' },
    { name: 'iPhone', icon: Smartphone, href: '/deshboard/addproduct' },
    { name: 'iPad', icon: Tablet, href: '/deshboard/ipadaddproduct' },
    { name: 'MacBook', icon: LaptopMinimal, href: '/deshboard/macbookadd' },
    { name: 'Updata Data', icon: SquarePlus, href: '/deshboard/updata' },
    { name: 'Order', icon: Clipboard, href: '/deshboard/orderdata' }, // ✅ new item
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div
      className={`
        ${sidebarOpen ? 'w-64' : 'w-16'}
        bg-white shadow-lg transition-all duration-300 ease-in-out 
        h-screen fixed md:relative
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className=" m-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
      >
        {sidebarOpen ? '<' : '>'}
      </button>

      {/* Navigation Menu */}
      <nav className="mt-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-colors group relative ${
                    active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'} ${
                      active
                        ? 'text-blue-700'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}

                  {/* Tooltip when collapsed */}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default NavSidebar;
