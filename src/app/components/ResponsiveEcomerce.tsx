'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu,  Search, User, ChevronDown, Home, Grid, Percent,
  ShoppingBag, Clock, TrendingUp, Smartphone, Laptop, Tablet, Headphones,
  
} from 'lucide-react';
import Image from 'next/image';
import logo from './../../../public/WhatsApp_Image_2025-08-23_at_19.59.58__1_-removebg-preview (1).png';
import { useaddtobagStore } from '../../../store/store';
import { useSidebarStore } from '../../../store/store';
import AddTobag from '@/components/utils/Addtobag';
import axios from 'axios';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';



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

// Interfaces based on your MongoDB schema
interface ImageConfig {
  colorHex?: string;
  colorName?: string;
  id: number;
  image?: string;
  inStock?: boolean;
}

interface StorageConfig {
  basicPrice?: string;
  colorStocks?: any[];
  id: number;
  inStock?: boolean;
  name?: string;
  prices?: any[];
  shortDetails?: string;
}

interface Product {
  _id: string;
  name: string;
  basePrice?: number;
  description?: string;
  accessories?: string;
  accessoriesType?: string;
  storageConfigs: StorageConfig[];
  imageConfigs: ImageConfig[];
  dynamicInputs: any[];
  details: any[];
  preOrderConfig?: any;
  productlinkname?: string;
  type: 'iphone' | 'macbook' | 'ipad' | 'accessory';
  createdAt?: string;
  updatedAt?: string;
}

interface SearchClickData {
  query: string;
  timestamp: string;
  resultsCount?: number;
  userAgent: string;
  screenResolution: string;
  sessionId?: string;
}

interface SearchSuggestion {
  id: string;
  name: string;
  category?: string;
  image?: string;
  price?: number;
  type: 'product' | 'category' | 'recent' | 'trending';
  productType?: 'iphone' | 'macbook' | 'ipad' | 'accessory';
}

const AppleNavbar = () => {
  const { order } = useaddtobagStore();
  const { toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Mock trending searches
    setTrendingSearches([
      { id: '1', name: 'iPhone 15 Pro', type: 'trending', productType: 'iphone' },
      { id: '2', name: 'MacBook Air M2', type: 'trending', productType: 'macbook' },
      { id: '3', name: 'AirPods Pro', type: 'trending', productType: 'accessory' },
      { id: '4', name: 'iPad Air', type: 'trending', productType: 'ipad' },
    ]);
  }, []);

  // Save to recent searches
  const saveToRecentSearches = (query: string) => {
    const newSearch: SearchSuggestion = {
      id: `recent-${Date.now()}`,
      name: query,
      type: 'recent'
    };

    const updated = [newSearch, ...recentSearches.filter(s => s.name !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  // Track search click data
  const trackSearchClick = async (data: SearchClickData) => {
    try {
      await fetch('/api/analytics/search-clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to track search click:', error);
    }
  };

  // Search products using your API
  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      return [];
    }
  };

  // Get product image - uses first available image from imageConfigs
  const getProductImage = (product: Product): string | undefined => {
    if (product.imageConfigs && product.imageConfigs.length > 0) {
      return product.imageConfigs[0].image;
    }
    return undefined;
  };

  // Get product price - uses basePrice or first storage config price
  const getProductPrice = (product: Product): number | undefined => {
    if (product.basePrice) {
      return product.basePrice;
    }
    if (product.storageConfigs && product.storageConfigs.length > 0) {
      const firstConfig = product.storageConfigs[0];
      if (firstConfig.basicPrice) {
        return parseFloat(firstConfig.basicPrice);
      }
    }
    return undefined;
  };

  // Check if product is in stock
  const isProductInStock = (product: Product): boolean => {
    // Check image configs for stock
    if (product.imageConfigs && product.imageConfigs.length > 0) {
      const inStockImage = product.imageConfigs.find(config => config.inStock === true);
      if (inStockImage) return true;
    }
    
    // Check storage configs for stock
    if (product.storageConfigs && product.storageConfigs.length > 0) {
      const inStockStorage = product.storageConfigs.find(config => config.inStock === true);
      if (inStockStorage) return true;
    }
    
    return false;
  };

  // Enhanced search handler with click tracking
  const handleSearch = async (query: string, source: 'enter' | 'click' | 'suggestion' = 'enter'): Promise<void> => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      setIsSearchDialogOpen(false);
      return;
    }

    try {
      setLoading(true);
      
      // Save to recent searches
      saveToRecentSearches(trimmedQuery);

      const results = await searchProducts(trimmedQuery);
      
      // Track search click data
      const searchData: SearchClickData = {
        query: trimmedQuery,
        timestamp: new Date().toISOString(),
        resultsCount: results.length,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        sessionId: sessionStorage.getItem('sessionId') || generateSessionId(),
      };

      await trackSearchClick(searchData);

      // Navigate to search results page with the query
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setIsSearchDialogOpen(false);
      setSearchQuery('');

    } catch (error) {
      console.error('Search error:', error);
      // Fallback: still navigate to search page even if tracking fails
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setIsSearchDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Generate session ID for tracking
  const generateSessionId = (): string => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
    return sessionId;
  };

  // Handle input change with debounced search suggestions
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length > 1) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          setLoading(true);
          const results = await searchProducts(value);
          setSearchResults(results);
        } catch (error) {
          console.error('Search suggestion error:', error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce
    } else {
      setSearchResults([]);
    }
  };

  // Handle search suggestion click
  const handleSuggestionClick = (product: Product | SearchSuggestion) => {
    if ('_id' in product) {
      // It's a Product from API - navigate to product detail page
      if (product.productlinkname) {
        router.push(`/category/product/${product.productlinkname}`);
        setIsSearchDialogOpen(false);
      } else {
        // Fallback to search if no product link name
        setSearchQuery(product.name);
        handleSearch(product.name, 'suggestion');
      }
    } else {
      // It's a SearchSuggestion
      setSearchQuery(product.name);
      handleSearch(product.name, 'suggestion');
    }
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  // Get icon for product type
  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'iphone': return Smartphone;
      case 'macbook': return Laptop;
      case 'ipad': return Tablet;
      case 'accessory': return Headphones;
      default: return Search;
    }
  };

  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Get product display name
  const getProductDisplayName = (product: Product) => {
    return product.name;
  };

  interface NavChild {
    name: string;
    href: string;
  }

  interface NavLink {
    name: string;
    href: string;
    children?: NavChild[];
  }

  const navigationLinks: NavLink[] = [
    { name: 'iPhone', href: '/category/iphone' },
    { name: 'Mac', href: '/category/macbook' },
    { name: 'iPad', href: '/category/ipad' },
    {
      name: 'Accessories',
      href: '/category/accessories',
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
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full py-6">
                <div className="space-y-4">
                  {navigationLinks.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <Link
                        href={item.href}
                        className="flex items-center justify-between w-full text-sm font-medium py-2 hover:text-primary transition-colors"
                        onClick={() => !item.children && setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                        {item.children && <ChevronDown size={16} />}
                      </Link>
                      {item.children && (
                        <div className="ml-4 space-y-1 border-l-2 border-muted pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block text-sm text-muted-foreground py-1 hover:text-primary transition-colors"
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
              </ScrollArea>
            </SheetContent>
          </Sheet>

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
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium">
                      {link.name}
                      <ChevronDown size={16} className="ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {link.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link href={child.href} className="cursor-pointer">
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button key={link.name} variant="ghost" asChild>
                  <Link href={link.href} className="font-medium">
                    {link.name}
                  </Link>
                </Button>
              )
            ))}
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
              <Input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setIsSearchDialogOpen(true)}
                placeholder="Search for iPhone, Mac, iPad..."
                className="pl-10 pr-4 cursor-pointer"
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
            >
              <Search size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="relative"
            >
              <ShoppingBag size={20} />
              {order.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {order.length}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <Link href="/deshboard">
                <User size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Search size={20} />
              Search Products
            </DialogTitle>
          </DialogHeader>
          
          {/* Search Input */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery, 'enter')}
                placeholder="Search for iPhone, Mac, iPad, Accessories..."
                className="pl-10 pr-4 text-base h-12"
                autoFocus
              />
            </div>
          </div>

          <ScrollArea className="max-h-[400px] px-6 pb-6">
            {/* Loading State */}
            {loading && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2">
                    <Skeleton className="w-10 h-10 rounded" />
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
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Found {searchResults.length} results
                </h4>
                {searchResults.map((product) => {
                  const ProductIcon = getProductTypeIcon(product.type);
                  const productImage = getProductImage(product);
                  const productPrice = getProductPrice(product);
                  const inStock = isProductInStock(product);
                  
                  return (
                    <div
                      key={product._id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleSuggestionClick(product)}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={productImage} />
                        <AvatarFallback className="bg-muted">
                          <ProductIcon size={20} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{getProductDisplayName(product)}</p>
                        <div className="flex items-center gap-2 mt-1">
                        
                          {!inStock && (
                            <Badge variant="outline" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                       
                      </div>
                      <Search size={16} className="text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!loading && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8">
                <Search size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => handleSearch(searchQuery, 'enter')}
                >
                  Search Anyway
                </Button>
              </div>
            )}

            {/* Recent Searches */}
            {!loading && !searchQuery && recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearRecentSearches}
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>
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
            )}

            {/* Trending Searches */}
            {!loading && !searchQuery && (
              <div className="space-y-3 mt-6">
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
                        <TrendIcon size={12} />
                        {trend.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Categories */}
            {!loading && !searchQuery && (
              <div className="space-y-3 mt-6">
                <h4 className="text-sm font-medium text-muted-foreground">Quick Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'iPhone', icon: Smartphone, type: 'iphone' },
                    { name: 'MacBook', icon: Laptop, type: 'macbook' },
                    { name: 'iPad', icon: Tablet, type: 'ipad' },
                    { name: 'Accessories', icon: Headphones, type: 'accessory' },
                  ].map((category) => (
                    <Button
                      key={category.name}
                      variant="outline"
                      className="justify-start h-auto py-2 px-3 text-sm"
                      onClick={() => handleSuggestionClick({
                        id: category.type,
                        name: category.name,
                        type: 'category',
                        productType: category.type as any
                      })}
                    >
                      
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Mobile Bottom Nav */}
      <Card className="lg:hidden fixed bottom-4 left-4 right-4 z-40 shadow-lg">
        <CardContent className="p-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={`flex flex-col h-auto p-2 ${
                    active ? 'text-primary' : item.id === 'whatsapp' ? 'text-green-500' : 'text-muted-foreground'
                  }`}
                >
                  <Link
                    href={item.href}
                    {...(item.id === 'whatsapp' && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <Icon 
                      className={`w-4 h-4 mb-1 ${
                        active ? 'text-primary' : item.id === 'whatsapp' ? 'text-green-500' : 'text-muted-foreground'
                      }`}
                    />
                    <span className="text-[10px] font-medium">
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