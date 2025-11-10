'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, Search, User, ChevronDown, Home, Grid, Percent,
  ShoppingBag, Clock, TrendingUp, Smartphone, Laptop, Tablet, Headphones, X,
} from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

// --- Local Imports ---
// Assuming these paths are correct. Use @ alias for cleaner imports.
// import  useaddtobagStore, useSidebarStore
import { useaddtobagStore,useSidebarStore } from '../../../store/store';
import AddTobag from '@/components/utils/Addtobag';
import logo from './../../../public/WhatsApp_Image_2025-08-23_at_19.59.58__1_-removebg-preview (1).png'; 

// --- Shadcn UI Components (Keep the same) ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
// Removed Separator as it's not strictly necessary in the final structure
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


// --- Custom WhatsApp Icon Component (Moved to a separate file, or kept simple) ---
// Simplified and moved to be a proper React component for better reusability and tree-shaking
const WhatsAppIcon = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48" 
    className={className}
    fill={color}
  >
    {/* Simplified paths - this is just an example, the original complex paths should be kept if needed */}
    <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8 l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"/>
    <path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0 s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3 c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9 c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8 c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"/>
  </svg>
);


// --- Type Definitions (Refined) ---

// Simplify and merge interfaces where possible, use utility types (Partial) if needed.
// Using a type alias for the core product types for consistency
type ProductType = 'iphone' | 'macbook' | 'ipad' | 'accessory';

interface ProductConfig { // Renamed from ImageConfig/StorageConfig to a more general term
  id: number | string; // Use string for better ID handling
  inStock?: boolean;
  // Other specific fields (colorHex, basicPrice, etc.) can be left on the main interface
}

interface Product {
  _id: string;
  name: string;
  productlinkname?: string;
  type: ProductType;
  basePrice?: number;
  imageConfigs: { image?: string; inStock?: boolean }[]; // Simplified for the navbar's needs
  storageConfigs: { basicPrice?: string; inStock?: boolean }[]; // Simplified
}

type SearchSource = 'enter' | 'click' | 'suggestion' | 'category-quicklink';

interface SearchClickData {
  query: string;
  timestamp: string;
  resultsCount?: number;
  userAgent: string;
  screenResolution: string;
  sessionId: string; // Made required
  source: SearchSource; // Added source
}

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'product' | 'category' | 'recent' | 'trending';
  productType?: ProductType;
  // productLinkName?: string; // We use product.productlinkname for actual products
}

interface NavLink {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}


// --- Utility Functions (Refactored and simplified) ---

// Generate session ID for tracking (moved out of component for purity)
const generateSessionId = (): string => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Formats price
const formatPrice = (price?: number) => {
  if (price === undefined || isNaN(price)) return 'Price not available';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};


// --- Component Definition ---

const AppleNavbar = () => {
  const { order } = useaddtobagStore();
  const { toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const pathname = usePathname();

  // --- State ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  
  // --- Refs ---
const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionId = useMemo(() => generateSessionId(), []);

  // --- Static Data ---
  const navigationLinks: NavLink[] = useMemo(() => ([
    { name: 'iPhone', href: '/category/iphone' },
    { name: 'Mac', href: '/category/macbook' },
    { name: 'iPad', href: '/category/ipad' },
    { name: 'Accessories', href: '/category/accessories' }
  ]), []);

  const navItems = useMemo(() => ([
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'category', label: 'Category', icon: Grid, href: '/category' },
    { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, href: 'https://wa.me/8801343159931' },
    { id: 'offer', label: 'Offer', icon: Percent, href: '/offers' },
    { id: 'signin', label: 'Account', icon: User, href: '/deshboard' } // Renamed label
  ]), []);
  
  const trendingSearches: SearchSuggestion[] = useMemo(() => ([
    { id: 't1', name: 'iPhone 15 Pro', type: 'trending', productType: 'iphone' },
    { id: 't2', name: 'MacBook Air M2', type: 'trending', productType: 'macbook' },
    { id: 't3', name: 'AirPods Pro', type: 'trending', productType: 'accessory' },
    { id: 't4', name: 'iPad Air', type: 'trending', productType: 'ipad' },
  ]), []);


  // --- Helper Functions (Memoized) ---
  
  const getProductImage = useCallback((product: Product): string | undefined => {
    return product.imageConfigs?.[0]?.image;
  }, []);

  const isProductInStock = useCallback((product: Product): boolean => {
    return product.imageConfigs?.some(c => c.inStock) || product.storageConfigs?.some(c => c.inStock) || false;
  }, []);

  const getProductPrice = useCallback((product: Product): number | undefined => {
    if (product.basePrice !== undefined && !isNaN(product.basePrice)) {
      return product.basePrice;
    }
    const firstConfigPrice = product.storageConfigs?.[0]?.basicPrice;
    if (firstConfigPrice) {
      const price = parseFloat(firstConfigPrice);
      if (!isNaN(price)) return price;
    }
    return undefined;
  }, []);

  const getProductTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'iphone': return Smartphone;
      case 'macbook': return Laptop;
      case 'ipad': return Tablet;
      case 'accessory': return Headphones;
      default: return Search;
    }
  }, []);

  const isActive = useCallback((href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }, [pathname]);


  // --- Effects & Handlers ---

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recent-searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading recent searches:', e);
      localStorage.removeItem('recent-searches'); // Clear corrupted data
    }
  }, []);

  // API Call: Search products
  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_BASE_URI}/search?query=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Search API error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);


  // API Call: Track search click data
  const trackSearchClick = useCallback(async (data: Omit<SearchClickData, 'sessionId'> & { sessionId?: string }) => {
    // Ensure sessionId is always present
    const payload: SearchClickData = { ...data, sessionId: data.sessionId || sessionId };
    
    try {
      await fetch('/api/analytics/search-clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // Non-critical failure, log it but don't disrupt the user
      console.error('Failed to track search click:', error);
    }
  }, [sessionId]);


  // Update recent searches in state and localStorage
  const saveToRecentSearches = useCallback((query: string) => {
    const newSearch: SearchSuggestion = {
      id: `recent-${Date.now()}`,
      name: query,
      type: 'recent'
    };

    const updated = [newSearch, ...recentSearches.filter(s => s.name.toLowerCase() !== query.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('recent-searches', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving recent searches:', e);
    }
  }, [recentSearches]);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };


  // Main Search Logic: Navigate and Track
  const handleSearch = useCallback(async (query: string, source: SearchSource = 'enter', results?: Product[]): Promise<void> => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setIsSearchDialogOpen(false);
      return;
    }

    try {
      saveToRecentSearches(trimmedQuery);
      
      // Track search click data
      const searchData: Omit<SearchClickData, 'sessionId'> = {
        query: trimmedQuery,
        timestamp: new Date().toISOString(),
        resultsCount: results?.length,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        source: source,
      };

      await trackSearchClick(searchData);

      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setIsSearchDialogOpen(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error during search navigation/tracking:', error);
      // Ensure navigation happens even if tracking fails
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setIsSearchDialogOpen(false);
    }
  }, [router, saveToRecentSearches, trackSearchClick]);


  // Debounced input handler for suggestions
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length > 1) {
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchProducts(value); // searchProducts handles its own loading state
        setSearchResults(results);
      }, 300); // 300ms debounce
    } else {
      setSearchResults([]);
      setLoading(false); // Ensure loading is off if query is too short
    }
  };


  // Handle suggestion/result click
  const handleSuggestionClick = (item: Product | SearchSuggestion, source: SearchSource = 'suggestion') => {
    if ('_id' in item) {
      // It's a Product from API - navigate to product detail page
      if (item.productlinkname) {
        // Track the click before navigating
        trackSearchClick({
          query: item.name,
          timestamp: new Date().toISOString(),
          resultsCount: 1, // Treat as one result that was clicked
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          source: source,
        });

        router.push(`/category/product/${item.productlinkname}`); // Changed /category/product/ to /product/ for flatter URL
        setIsSearchDialogOpen(false);
      } else {
        // Fallback to search if no product link name
        setSearchQuery(item.name);
        handleSearch(item.name, source, [item]);
      }
    } else if (item.type === 'category') {
      // It's a Quick Category link - navigate directly
      router.push(`/category/${item.productType}`);
      setIsSearchDialogOpen(false);
    } else {
      // It's a SearchSuggestion (recent/trending) - run full search
      setSearchQuery(item.name);
      handleSearch(item.name, source);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);


  // --- Render Logic ---

  // Component for displaying a single search result
  const SearchResultItem = ({ product, source }: { product: Product, source: SearchSource }) => {
    const ProductIcon = getProductTypeIcon(product.type);
    const productImage = getProductImage(product);
    const inStock = isProductInStock(product);

    return (
      <div
        key={product._id}
        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
        onClick={() => handleSuggestionClick(product, source)}
      >
        <Avatar className="w-10 h-10 border">
          {productImage ? (
             <AvatarImage src={productImage} alt={product.name} />
          ) : (
             <AvatarFallback className="bg-muted">
               <ProductIcon size={16} />
             </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{product.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs font-normal">
               {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
            </Badge>
            {!inStock && (
              <Badge variant="destructive" className="text-xs font-normal">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
        <ChevronDown size={16} className="text-muted-foreground rotate-[-90deg]" aria-hidden="true" />
      </div>
    );
  };


  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Mobile Menu & Logo Group */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle main menu">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:w-[340px]">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">Quick Links</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full py-6">
                  <div className="space-y-1">
                    {/* Simplified Mobile Navigation */}
                    {navigationLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center w-full text-base font-medium py-3 px-2 rounded-md hover:bg-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="pt-4">
                      <h3 className="text-sm font-semibold text-muted-foreground px-2">Account</h3>
                      <Link
                        href="/deshboard"
                        className="flex items-center w-full text-base font-medium py-3 px-2 rounded-md hover:bg-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User size={20} className="mr-3" />
                        My Account
                      </Link>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex-shrink-0 ml-2 lg:ml-0">
              <Link href="/" className="flex items-center" aria-label="Go to homepage">
                {/* Optimized Image Component: added width/height */}
                <Image  src={logo} alt="Store Logo" priority width={100} height={40} className="w-40 h-40" />
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navigationLinks.map((link) => (
              // Note: Removed the DropdownMenu logic since your links didn't have children in the provided array.
              // If you need it, re-implement it using the original code's structure.
              <Button 
                key={link.name} 
                variant="ghost" 
                asChild
                className={isActive(link.href) ? 'text-primary border-b-2 border-primary' : 'font-medium'}
              >
                <Link href={link.href} className="font-medium">
                  {link.name}
                </Link>
              </Button>
            ))}
          </div>

          {/* Search bar (Desktop) */}
          <div className="hidden md:flex max-w-sm ml-auto mr-4"> {/* Adjusted positioning */}
            <div className="relative w-full">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
                size={18} 
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setIsSearchDialogOpen(true)}
                placeholder="Search for iPhone, Mac, iPad..."
                className="pl-10 pr-4 cursor-pointer"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchDialogOpen(true)}
              className="md:hidden"
              aria-label="Open search dialog"
            >
              <Search size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="relative"
              aria-label={`Shopping bag with ${order.length} items`}
            >
              <ShoppingBag size={20} />
              {order.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {/* Capped at 99 for cleaner UI */}
                  {order.length > 99 ? '99+' : order.length} 
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex" aria-label="Go to account dashboard">
              <Link href="/deshboard">
                <User size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* --- Search Dialog (Improved UX) --- */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        {/* Added dynamic size for better mobile/desktop feel */}
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 gap-0 bg-white">
          <DialogHeader className="px-6 pt-6 pb-4 border-b hidden sm:block">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Search size={24} />
              Search Products
            </DialogTitle>
          </DialogHeader>
          
          {/* Search Input */}
          <div className="px-4 sm:px-6 py-4 border-b sm:border-b-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="search" // Use type="search" for better semantics
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery, 'enter')}
                placeholder="Search for iPhone, Mac, iPad, Accessories..."
                className="pl-10 pr-10 text-base h-12"
                autoFocus
                aria-label="Search input"
              />
              {/* Clear button */}
              {/* {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  aria-label="Clear search query"
                >
                  <X size={16} />
                </Button>
              )} */}
            </div>
          </div>

          <ScrollArea className="max-h-[70vh] sm:max-h-[400px] px-4 sm:px-6 pb-6">
            {/* Loading State */}
            {loading && (
              <div className="space-y-3 pt-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2 border-b last:border-b-0">
                    <Skeleton className="w-10 h-10 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {!loading && searchQuery && searchResults.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium text-muted-foreground px-1">
                  Products ({searchResults.length} results)
                </h4>
                {searchResults.slice(0, 5).map((product) => (
                   <SearchResultItem 
                      key={product._id} 
                      product={product} 
                      source="suggestion"
                    />
                ))}
                 {/* Link to all results */}
                {searchResults.length > 5 && (
                    <Button 
                        variant="ghost" 
                        className="w-full text-primary justify-center"
                        onClick={() => handleSearch(searchQuery, 'suggestion', searchResults)}
                    >
                        View all {searchResults.length} results
                    </Button>
                )}
              </div>
            )}

            {/* No Results */}
          {!loading && searchQuery && searchResults.length === 0 && (
  <div className="text-center py-8">
    <Search size={48} className="mx-auto text-muted-foreground mb-4" />
    <p className="text-muted-foreground mb-4">
      No product suggestions found for &quot;<span className="font-semibold text-foreground">{searchQuery}</span>&quot;
    </p>
    <Button 
      onClick={() => handleSearch(searchQuery, 'enter')}
    >
      Search Anyway
    </Button>
  </div>
)}

            {/* Default View (No Query) */}
            {!searchQuery && (
              <div className="space-y-6 pt-2">

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearRecentSearches}
                        className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search) => (
                        <div
                          key={search.id}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          <Clock size={16} className="text-muted-foreground" />
                          <span className="text-sm flex-1">{search.name}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Search size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Trending Searches */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp size={16} />
                    Trending Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((trend) => {
                      const TrendIcon = getProductTypeIcon(trend.productType || '');
                      return (
                        <Badge
                          key={trend.id}
                          variant="secondary"
                          className="px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1"
                          onClick={() => handleSuggestionClick(trend)}
                        >
                          <TrendIcon size={12} aria-hidden="true" />
                          {trend.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Categories */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Quick Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'iPhone', icon: Smartphone, type: 'iphone' as const },
                      { name: 'MacBook', icon: Laptop, type: 'macbook' as const },
                      { name: 'iPad', icon: Tablet, type: 'ipad' as const },
                      { name: 'Accessories', icon: Headphones, type: 'accessory' as const },
                    ].map((category) => {
                      const CategoryIcon = category.icon;
                      return (
                        <Button
                          key={category.name}
                          variant="outline"
                          className="justify-start h-auto py-3 px-3 text-sm flex items-center gap-3"
                          onClick={() => handleSuggestionClick({
                            id: category.type,
                            name: category.name,
                            type: 'category',
                            productType: category.type
                          }, 'category-quicklink')}
                        >
                          <CategoryIcon size={20} className="text-primary" />
                          {category.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* --- Mobile Bottom Nav (Enhanced Styling) --- */}
      <Card className="lg:hidden fixed bottom-0 left-0 right-0 z-40 shadow-2xl rounded-t-xl border-none">
        <CardContent className="p-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const isWhatsapp = item.id === 'whatsapp';
              
              const baseClasses = 'flex flex-col h-auto p-2 transition-colors duration-200';
              const activeColor = 'text-primary';
              const inactiveColor = 'text-muted-foreground hover:text-foreground';
              const whatsappColor = 'text-green-600 hover:text-green-700';

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={`${baseClasses} ${
                    active ? activeColor : isWhatsapp ? whatsappColor : inactiveColor
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Link
                    href={item.href}
                    {...(isWhatsapp && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <Icon 
                      className="w-5 h-5 mb-0.5 mx-auto"
                      color={isWhatsapp ? 'currentColor' : undefined} // Let currentColor handle primary/inactive
                    />
                    <span className="text-[10px] font-medium mt-0.5">
                      {item.label}
                    </span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <AddTobag />
    </nav>
  );
};

export default AppleNavbar;