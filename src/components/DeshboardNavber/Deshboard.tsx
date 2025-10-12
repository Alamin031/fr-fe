'use client'

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Smartphone,
  Tablet,
  LaptopMinimal,
  Headphones,
  SquarePlus,
  Clipboard,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NavSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'iPhone', icon: Smartphone, href: '/deshboard/addproduct' },
    { name: 'iPad', icon: Tablet, href: '/deshboard/ipadaddproduct' },
    { name: 'MacBook', icon: LaptopMinimal, href: '/deshboard/macbookadd' },
    { name: 'Accessories', icon: Headphones, href: '/deshboard/accessories' },
    { name: 'Update Data', icon: SquarePlus, href: '/deshboard/updata' },
    { name: 'Order', icon: Clipboard, href: '/deshboard/orderdata' }, 
  ];

  const isActive = (href) => pathname === href;

  const handleNavigation = (href) => {
    router.push(href);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r bg-background transition-all duration-300 ease-in-out flex flex-col",
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center border-b px-4">
          {sidebarOpen && (
            <h2 className="font-semibold text-lg">Menu</h2>
          )}
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="icon"
            className={cn("ml-auto", !sidebarOpen && "mx-auto")}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  variant={active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start relative group",
                    !sidebarOpen && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
                  {sidebarOpen && <span>{item.name}</span>}

                  {/* Tooltip for collapsed state */}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border z-50">
                      {item.name}
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          {sidebarOpen && (
            <p className="text-xs text-muted-foreground text-center">
              © 2025 Dashboard
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-muted/30">
        
      </main>
    </div>
  );
};

export default NavSidebar;