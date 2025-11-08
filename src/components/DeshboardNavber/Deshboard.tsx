'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ Get session in nav
import { 
  Home, Smartphone, Tablet, LaptopMinimal, Headphones,
  SquarePlus, Clipboard, Bell, Package, ChevronLeft, ChevronRight,
  Globe, Users, Shuffle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NavSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession(); // ✅ Access role here

  const isActive = (href: string) => pathname === href;
  const handleNavigation = (href: string) => router.push(href);
const allowedRoles = ['admin', 'management'];

  // ✅ ইউজারের রোল চেক
  const hasAccess = allowedRoles.includes(session?.user?.role || '');
  console.log(hasAccess)
  // Only show admin items if user is admin
  const isAdmin = session?.user.role === 'admin';
  // Similarly, you could add `isManager`, etc.

  return (
    <div className="flex h-screen">
      <aside
        className={cn(
          "border-r bg-background transition-all duration-300 ease-in-out flex flex-col",
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          {sidebarOpen && <h2 className="font-semibold text-lg">Menu</h2>}
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="icon"
            className={cn("ml-auto", !sidebarOpen && "mx-auto")}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <NavItem name="Dashboard" icon={Home} href="/deshboard" active={isActive('/deshboard')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
            <NavItem name="Transition" icon={Shuffle} href="/deshboard/transition" active={isActive('/deshboard/transition')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />

            {/* AdminManagement items — show if user is admin or manager, etc. */}
            {hasAccess && (
              <>
                <NavItem name="Landing Page" icon={Globe} href="/deshboard/landingpage" active={isActive('/deshboard/landingpage')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="iPhone" icon={Smartphone} href="/deshboard/addproduct" active={isActive('/deshboard/addproduct')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="iPad" icon={Tablet} href="/deshboard/ipadaddproduct" active={isActive('/deshboard/ipadaddproduct')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="MacBook" icon={LaptopMinimal} href="/deshboard/macbookadd" active={isActive('/deshboard/macbookadd')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Accessories" icon={Headphones} href="/deshboard/accessories" active={isActive('/deshboard/accessories')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Update Data" icon={SquarePlus} href="/deshboard/updata" active={isActive('/deshboard/updata')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Order" icon={Clipboard} href="/deshboard/orderdata" active={isActive('/deshboard/orderdata')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Notify" icon={Bell} href="/deshboard/notify" active={isActive('/deshboard/notify')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="PreOrder" icon={Package} href="/deshboard/preorder" active={isActive('/deshboard/preorder')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
              </>
            )}

            {/* Admin-only item */}
            {isAdmin && (
              <NavItem name="Role" icon={Users} href="/deshboard/role" active={isActive('/deshboard/role')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
            )}
          </div>
        </nav>

        <div className="border-t p-4">
          {sidebarOpen && <p className="text-xs text-muted-foreground text-center">© 2025 Dashboard</p>}
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 bg-muted/30">
        {/* Your page content (e.g., children from layout) */}
      </main>
    </div>
  );
};

const NavItem = ({ name, icon: Icon, href, active, onClick, sidebarOpen }) => (
  <Button
    onClick={() => onClick(href)}
    variant={active ? "default" : "ghost"}
    className={cn("w-full justify-start relative group", !sidebarOpen && "justify-center px-2")}
  >
    <Icon className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
    {sidebarOpen && <span>{name}</span>}
    {!sidebarOpen && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border z-50">
        {name}
      </div>
    )}
  </Button>
);

export default NavSidebar;