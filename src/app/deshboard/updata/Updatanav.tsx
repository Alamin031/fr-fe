'use client'
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

// shadcn/ui components (adjust import paths to your project structure)
import { Button } from "@/components/ui/button";


export default function Navbar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "iPhone", href: "/deshboard/updata/iphonupdata" },
    { name: "Mac", href: "/deshboard/updata/macupdata" },
    { name: "iPad", href: "/deshboard/updata/ipadupdata" },
   { name: "accessories", href: "/deshboard/updata/accessories" },


  ];

 

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold">YourBrand</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-1 text-sm font-medium transition-colors rounded-md hover:bg-slate-100 ${
                  pathname.startsWith(item.href) ? "bg-slate-100" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            
          </nav>

          {/* Actions / Mobile button */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Button size="sm">Search</Button>
            </div>

            <button
              className="md:hidden p-2 rounded-md hover:bg-slate-100"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-slate-100 ${
                  pathname.startsWith(item.href) ? "bg-slate-100" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-1">
              <details className="group">
                <summary className="cursor-pointer rounded-md px-3 py-2 text-base font-medium hover:bg-slate-100">
                  Accessories
                </summary>
                <div className="mt-2 space-y-1 pl-4">
                  
                </div>
              </details>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
