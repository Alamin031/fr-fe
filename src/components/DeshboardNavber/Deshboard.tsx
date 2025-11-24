'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ Get session in nav
import {
  Home, Smartphone, Tablet, LaptopMinimal, Headphones,
  SquarePlus, Clipboard, Bell, Package, ChevronLeft, ChevronRight,
  Globe, Users, Shuffle, Layers, Award, Gift, FileText,
  HelpCircle, Star, Zap, Search, TrendingUp
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

            {/* Products Section */}
            {hasAccess && (
              <>
                <div className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground", !sidebarOpen && "hidden")}>
                  Products
                </div>
                <NavItem name="Landing Page" icon={Globe} href="/deshboard/landingpage" active={isActive('/deshboard/landingpage')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="iPhone" icon={Smartphone} href="/deshboard/addproduct" active={isActive('/deshboard/addproduct')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="iPad" icon={Tablet} href="/deshboard/ipadaddproduct" active={isActive('/deshboard/ipadaddproduct')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="MacBook" icon={LaptopMinimal} href="/deshboard/macbookadd" active={isActive('/deshboard/macbookadd')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Accessories" icon={Headphones} href="/deshboard/accessories" active={isActive('/deshboard/accessories')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Update Data" icon={SquarePlus} href="/deshboard/updata" active={isActive('/deshboard/updata')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
              </>
            )}

            {/* Management Section */}
            {hasAccess && (
              <>
                <div className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground mt-4", !sidebarOpen && "hidden")}>
                  Management
                </div>
                <NavItem name="Categories" icon={Layers} href="/deshboard/categories" active={isActive('/deshboard/categories')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Brands" icon={Award} href="/deshboard/brands" active={isActive('/deshboard/brands')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Orders" icon={Clipboard} href="/deshboard/orderdata" active={isActive('/deshboard/orderdata')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Warranty" icon={Package} href="/deshboard/warranty" active={isActive('/deshboard/warranty')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Reviews" icon={Star} href="/deshboard/reviews" active={isActive('/deshboard/reviews')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
              </>
            )}

            {/* Content Section */}
            {hasAccess && (
              <>
                <div className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground mt-4", !sidebarOpen && "hidden")}>
                  Content
                </div>
                <NavItem name="Policies" icon={FileText} href="/deshboard/policies" active={isActive('/deshboard/policies')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="FAQs" icon={HelpCircle} href="/deshboard/faqs" active={isActive('/deshboard/faqs')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Giveaways" icon={Gift} href="/deshboard/giveaways" active={isActive('/deshboard/giveaways')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
              </>
            )}

            {/* Marketing Section */}
            {hasAccess && (
              <>
                <div className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground mt-4", !sidebarOpen && "hidden")}>
                  Marketing
                </div>
                <NavItem name="Loyalty" icon={Zap} href="/deshboard/loyalty" active={isActive('/deshboard/loyalty')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="SEO" icon={Search} href="/deshboard/seo" active={isActive('/deshboard/seo')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="Marketing" icon={TrendingUp} href="/deshboard/marketing" active={isActive('/deshboard/marketing')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
              </>
            )}

            {/* Notifications */}
            {hasAccess && (
              <>
                <div className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground mt-4", !sidebarOpen && "hidden")}>
                  Other
                </div>
                <NavItem name="Notifications" icon={Bell} href="/deshboard/notify" active={isActive('/deshboard/notify')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
                <NavItem name="PreOrder" icon={Package} href="/deshboard/preorder" active={isActive('/deshboard/preorder')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
              </>
            )}

            {/* Admin-only item */}
            {isAdmin && (
              <>
                <div className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground mt-4", !sidebarOpen && "hidden")}>
                  Admin
                </div>
                <NavItem name="User Roles" icon={Users} href="/deshboard/role" active={isActive('/deshboard/role')} onClick={handleNavigation} sidebarOpen={sidebarOpen} />
              </>
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
