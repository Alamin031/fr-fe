'use client'
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Smartphone, Laptop, Tablet, Plus, ExternalLink, Search, X } from 'lucide-react';
import Image from 'next/image';

const DashboardFeatures = () => {
    const [iphoneData, setIphoneData] = useState([]);
    const [macbookData, setMacbookData] = useState([]);
    const [ipadData, setIpadData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [landingPageProducts, setLandingPageProducts] = useState([]);


    const fetchIphoneData = async () => {
        try {
            console.log("Fetching iPhone data...");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/iphonelist`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log("✅ iPhone Data Fetched Successfully:", data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching iPhone data:', error);
            throw error;
        }
    }

    const fetchMacbookData = async () => {
        try {
            console.log("Fetching MacBook data...");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/macbooklist`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log("✅ MacBook Data Fetched Successfully:", data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching MacBook data:', error);
            throw error;
        }
    }

    const fetchIpadData = async () => {
        try {
            console.log("Fetching iPad data...");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/ipadlist`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log("✅ iPad Data Fetched Successfully:", data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching iPad data:', error);
            throw error;
        }
    }

    useEffect(() => {
        const fetchAllData = async () => {
            // console.log("🚀 Starting data fetch for all devices...");
            setLoading(true);
            setError(null);
            
            try {
                const [iphoneResult, macbookResult, ipadResult] = await Promise.all([
                    fetchIphoneData(),
                    fetchMacbookData(),
                    fetchIpadData()
                ]);

                setIphoneData(iphoneResult);
                setMacbookData(macbookResult);
                setIpadData(ipadResult);
                
                console.log("✅ All data fetched successfully!");
            } catch (error) {
                console.error("❌ Error fetching data:", error);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Search functionality
    const filterProducts = (products: any[], query: string) => {
        if (!query.trim()) return products;

        const lowercasedQuery = query.toLowerCase();
        return products.filter(product => 
            product.name?.toLowerCase().includes(lowercasedQuery) ||
            product.sku?.toLowerCase().includes(lowercasedQuery) ||
            product.basePrice?.toString().includes(lowercasedQuery) ||
            product.storageConfigs?.some((storage: any) => 
                storage.storage?.toLowerCase().includes(lowercasedQuery) ||
                storage.size?.toLowerCase().includes(lowercasedQuery)
            ) ||
            product.colorImageConfigs?.some((color: any) => 
                color.color?.toLowerCase().includes(lowercasedQuery)
            )
        );
    };

    // Memoized filtered data
    const filteredData = useMemo(() => {
        const allProducts = [...iphoneData, ...macbookData, ...ipadData];
        return filterProducts(allProducts, searchQuery);
    }, [iphoneData, macbookData, ipadData, searchQuery]);

    const filteredIphoneData = useMemo(() => 
        filterProducts(iphoneData, searchQuery), 
        [iphoneData, searchQuery]
    );

    const filteredMacbookData = useMemo(() => 
        filterProducts(macbookData, searchQuery), 
        [macbookData, searchQuery]
    );

    const filteredIpadData = useMemo(() => 
        filterProducts(ipadData, searchQuery), 
        [ipadData, searchQuery]
    );

    const handleAddToLandingPage = async (product: any, category: string) => {
        try {
            // console.log('Adding to landing page:', { product, category });
            
            const landingPageData = {
                name: product.name,
                price: product.basePrice,
                image: product.colorImageConfigs?.[0]?.image || '',
                category: category,
            };

            console.log('Landing page data:', landingPageData);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/landingetproduct/LendingProductpost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(landingPageData),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to landing page');
            }

            // Here you can implement your logic to add to landing page
            // For now, we'll just show a success message
            alert(`✅ ${product.name} added to landing page!`);

        } catch (error) {
            console.error('❌ Error adding to landing page:', error);
            alert('❌ Failed to add product to landing page');
        }
    };

    useEffect(() => {
  const fetchLandingPageProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/landingetproduct/landingetproductget`);
      const data = await response.json();
      setLandingPageProducts(data);
      console.log('Landing Page Products:', data);
    } catch (error) {
      console.error('Error fetching landing page products:', error);
    }
  };
  
  fetchLandingPageProducts();
}, []);


    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'iphone': return <Smartphone className="h-4 w-4" />;
            case 'macbook': return <Laptop className="h-4 w-4" />;
            case 'ipad': return <Tablet className="h-4 w-4" />;
            default: return null;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'iphone': return 'iPhone';
            case 'macbook': return 'MacBook';
            case 'ipad': return 'iPad';
            default: return 'Unknown';
        }
    };

    const SearchBar = () => (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                placeholder="Search products by name, SKU, price, storage, or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
            />
            {searchQuery && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setSearchQuery('')}
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    );

    const ProductTable = ({ data, category, showCategory = true }: { data: any[], category?: string, showCategory?: boolean }) => {
        if (loading) {
            return (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {searchQuery 
                            ? `No products found for "${searchQuery}" in ${category ? getCategoryLabel(category) : 'this category'}.`
                            : `No products available for ${category ? getCategoryLabel(category) : 'this category'}.`
                        }
                    </AlertDescription>
                </Alert>
            );
        }

        return (
            <div className="space-y-4">
                {searchQuery && (
                    <div className="text-sm text-muted-foreground">
                        Found {data.length} product{data.length !== 1 ? 's' : ''} matching "{searchQuery}"
                    </div>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            {showCategory && <TableHead>Category</TableHead>}
                            <TableHead>Price</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Storage</TableHead>
                            <TableHead>Colors</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => {
                            const itemCategory = category || 
                                (iphoneData.includes(item) ? 'iphone' : 
                                 macbookData.includes(item) ? 'macbook' : 'ipad');
                            
                            return (
                                <TableRow key={item._id || index}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            {item.colorImageConfigs?.[0]?.image ? (
                                                <Image
                                                    src={item.colorImageConfigs[0].image} 
                                                    alt={item.name}
                                                    width={48}
                                                    height={48}
                                                    className="h-12 w-12 object-contain rounded-lg border"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23e5e7eb" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                                                    <span className="text-xs text-muted-foreground">No Image</span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {item.colors?.length || 0} color{item.colors?.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    {showCategory && (
                                        <TableCell>
                                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                                {getCategoryIcon(itemCategory)}
                                                {getCategoryLabel(itemCategory)}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    <TableCell className="font-medium">
                                        ৳{parseFloat(item.basePrice).toLocaleString('en-BD', {minimumFractionDigits: 2})}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground font-mono">
                                        {item.sku}
                                    </TableCell>
                                    <TableCell>
                                        {item.storageConfigs?.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                {item.storageConfigs.slice(0, 3).map((storage: any, idx: number) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {storage.storage || storage.size}
                                                    </Badge>
                                                ))}
                                                {item.storageConfigs.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{item.storageConfigs.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                                            {item.colorImageConfigs?.slice(0, 2).map((color: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: color.color || '#ccc' }}
                                                    title={color.colorName || 'Color'}
                                                />
                                            ))}
                                            {item.colorImageConfigs?.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{item.colorImageConfigs.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleAddToLandingPage(item, itemCategory)}
                                            size="sm"
                                            className="gap-1 border"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add to Landing
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const StatsCard = ({ title, value, icon, description }: { title: string, value: number, icon: React.ReactNode, description?: string }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </CardContent>
        </Card>
    );

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Product Inventory</h1>
                    <p className="text-muted-foreground">
                        Manage and view all your Apple products in one place
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/landingpage">
                        <ExternalLink className="h-4 w-4" />
                        View Landing Page
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Products"
                    value={iphoneData.length + macbookData.length + ipadData.length}
                    icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
                    description="All available products"
                />
                <StatsCard
                    title="iPhone"
                    value={iphoneData.length}
                    icon={<Smartphone className="h-4 w-4 text-muted-foreground" />}
                    description="Smartphone devices"
                />
                <StatsCard
                    title="MacBook"
                    value={macbookData.length}
                    icon={<Laptop className="h-4 w-4 text-muted-foreground" />}
                    description="Laptop computers"
                />
                <StatsCard
                    title="iPad"
                    value={ipadData.length}
                    icon={<Tablet className="h-4 w-4 text-muted-foreground" />}
                    description="Tablet devices"
                />
            </div>

            {/* Products Table with Tabs */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Product Management</CardTitle>
                            <CardDescription>
                                Browse and manage all products by category
                            </CardDescription>
                        </div>
                        <div className="w-full sm:w-96">
                            <SearchBar />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all" className="flex items-center gap-2">
                                All Products
                                <Badge variant="secondary" className="ml-1">
                                    {searchQuery ? filteredData.length : iphoneData.length + macbookData.length + ipadData.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="iphone" className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4" />
                                iPhone
                                <Badge variant="secondary" className="ml-1">
                                    {searchQuery ? filteredIphoneData.length : iphoneData.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="macbook" className="flex items-center gap-2">
                                <Laptop className="h-4 w-4" />
                                MacBook
                                <Badge variant="secondary" className="ml-1">
                                    {searchQuery ? filteredMacbookData.length : macbookData.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="ipad" className="flex items-center gap-2">
                                <Tablet className="h-4 w-4" />
                                iPad
                                <Badge variant="secondary" className="ml-1">
                                    {searchQuery ? filteredIpadData.length : ipadData.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="all">
                            <ProductTable 
                                data={filteredData} 
                                showCategory={true}
                            />
                        </TabsContent>
                        
                        <TabsContent value="iphone">
                            <ProductTable 
                                data={filteredIphoneData} 
                                category="iphone"
                                showCategory={false}
                            />
                        </TabsContent>
                        
                        <TabsContent value="macbook">
                            <ProductTable 
                                data={filteredMacbookData} 
                                category="macbook"
                                showCategory={false}
                            />
                        </TabsContent>
                        
                        <TabsContent value="ipad">
                            <ProductTable 
                                data={filteredIpadData} 
                                category="ipad"
                                showCategory={false}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardFeatures;