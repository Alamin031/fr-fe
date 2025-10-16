'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Package, ShoppingBag, CreditCard, Bell, Calendar } from 'lucide-react';
import useOrderStore from '../../../../../store/store';


interface StorageConfig {
  label: string;
  price: string;
  shortDetails: string;
  inStock: boolean;
  _id: { $oid: string };
}

interface ImageConfig {
  image: string;
  price: string;
  colorName: string;
  colorHex: string;
  inStock: boolean;
  _id: { $oid: string };
}

interface Detail {
  label: string;
  value: string;
  _id: { $oid: string };
}

interface DynamicInputItem {
  label: string;
  price: string;
  _id: { $oid: string };
  inStock: boolean; 
}

interface DynamicInput {
  type: string;
  items: DynamicInputItem[];
  _id: { $oid: string };
}

interface PreOrderConfig {
  isPreOrder: boolean;
  availabilityDate: string;
  estimatedShipping: string;
  preOrderDiscount: { $numberInt: string };
  maxPreOrderQuantity: { $numberInt: string };
  _id: { $oid: string };
}

interface Product {
  _id: { $oid: string };
  name: string;
  basePrice: string;
  storageConfigs: StorageConfig[];
  imageConfigs: ImageConfig[];
  details: Detail[];
  accessories: string;
  accessoriesType: string;
  description: string;
  dynamicInputs: DynamicInput[];
  preOrderConfig: PreOrderConfig;
  createdAt: { $date: { $numberLong: string } };
  updatedAt: { $date: { $numberLong: string } };
  __v: { $numberInt: string };
  productlinkname: string;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Type guard for Product
const isProduct = (data: unknown): data is Product => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'basePrice' in data &&
    'storageConfigs' in data &&
    'imageConfigs' in data
  );
};

export default function Page() {
  const {addOrder} = useOrderStore()
  const params = useParams();
  const productName = params?.productName as string | undefined;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedStorageDetails, setSelectedStorageDetails] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedDynamicInputs, setSelectedDynamicInputs] = useState<{[key: string]: string}>({});
  const [isAddingToBag, setIsAddingToBag] = useState<boolean>(false);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [stockStatus, setStockStatus] = useState<{[key: string]: string}>({});
  const [retryCount, setRetryCount] = useState<number>(0);
  
  // Notify dialog states
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState<boolean>(false);
  const [notifyName, setNotifyName] = useState<string>('');
  const [notifyEmail, setNotifyEmail] = useState<string>('');
  const [notifyNumber, setNotifyNumber] = useState<string>('');

  // Debounce rapid selections
  const debouncedDynamicInputs = useDebounce(selectedDynamicInputs, 300);
  const debouncedSelectedStorage = useDebounce(selectedStorage, 300);
  const debouncedSelectedColor = useDebounce(selectedColor, 300);

  // Calculate total price with memoization
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    
    let price = parseFloat(product.basePrice);
    
    // Storage price
    if (debouncedSelectedStorage) {
      const storage = product.storageConfigs.find(config => config.shortDetails === debouncedSelectedStorage);
      if (storage) price += parseFloat(storage.price);
    }
    
    // Color price
    if (debouncedSelectedColor) {
      const color = product.imageConfigs.find(config => config.colorName === debouncedSelectedColor);
      if (color) price += parseFloat(color.price);
    }
    
    // Dynamic inputs prices
    Object.values(debouncedDynamicInputs).forEach(itemLabel => {
      // Find the item in any group
      for (const group of product.dynamicInputs) {
        const item = group.items.find(item => item.label === itemLabel);
        if (item) {
          price += parseFloat(item.price);
          break;
        }
      }
    });
    
    return price;
  }, [product, debouncedSelectedStorage, debouncedSelectedColor, debouncedDynamicInputs]);

  // Get stock status
  const getStockStatus = useMemo(() => {
    if (!product) return {};
    
    const status: {[key: string]: string} = {};
    
    // Check storage stock
    const selectedStorageItem = product.storageConfigs.find(config => 
      config.shortDetails === selectedStorage
    );
    if (selectedStorageItem && !selectedStorageItem.inStock) {
      status.storage = 'Out of Stock';
    }
    
    // Check color stock
    const selectedColorItem = product.imageConfigs.find(config => 
      config.colorName === selectedColor
    );
    if (selectedColorItem && !selectedColorItem.inStock) {
      status.color = 'Out of Stock';
    }
    
    // Check dynamic inputs stock
    Object.entries(selectedDynamicInputs).forEach(([groupType, itemLabel]) => {
      const group = product.dynamicInputs.find(input => input.type === groupType);
      if (group) {
        const item = group.items.find(item => item.label === itemLabel);
        if (item && !item.inStock) {
          status[groupType] = 'Out of Stock';
        }
      }
    });
    
    return status;
  }, [product, selectedStorage, selectedColor, selectedDynamicInputs]);

  // Check if any selected item is out of stock
  const isAnyItemOutOfStock = useMemo(() => {
    return Object.values(getStockStatus).some(status => status === 'Out of Stock');
  }, [getStockStatus]);
  

  // Check if storage is in stock
  const isStorageInStock = useMemo(() => {
    const selectedStorageItem = product?.storageConfigs.find(config => 
      config.shortDetails === selectedStorage
    );
    return selectedStorageItem?.inStock ?? true;
  }, [product, selectedStorage]);

  useEffect(() => {
    if (!productName) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/getproduct/accessoriesdetails/product?name=${productName}&retry=${retryCount}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        
        if (!isProduct(data)) {
          throw new Error('Invalid product data format');
        }
        
        setProduct(data);
        setError(null);
        
        // Set default selections
        if (data.storageConfigs?.[0]) {
          setSelectedStorage(data.storageConfigs[0].shortDetails);
          setSelectedStorageDetails(data.storageConfigs[0].shortDetails);
        }
        if (data.imageConfigs?.[0]) setSelectedColor(data.imageConfigs[0].colorName);
        
        // Set default dynamic inputs
        const defaultSelections: {[key: string]: string} = {};
        
        data.dynamicInputs?.forEach((group: DynamicInput) => {
          if (group.items?.[0]) {
            defaultSelections[group.type] = group.items[0].label;
          }
        });
        
        setSelectedDynamicInputs(defaultSelections);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchProduct();
  }, [productName, retryCount]);

  const handleStorageSelect = (config: StorageConfig) => {
    setSelectedStorage(config.shortDetails);
    setSelectedStorageDetails(config.shortDetails);
  };

  const notify = () => {
    setIsNotifyDialogOpen(true);
  };

  const handleNotifySubmit = async () => {
    // Prepare the notification data
    const notifyData = {
      name: notifyName,
      email: notifyEmail,
      phone: notifyNumber,
      product: product?.name,
      productId: product?._id.$oid,
      selectedOptions: {
        storage: selectedStorage,
        color: selectedColor,
        dynamicInputs: selectedDynamicInputs
      },
      totalPrice: totalPrice,
      timestamp: new Date().toISOString()
    };

    // Log the data to console
    // console.log('🔔 NOTIFY DIALOG SUBMITTED:', notifyData);
    
    

    // Here you can add your API call to save this data
    try {
      // Example API call:
      const response = await fetch('/api/notifypost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notifyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save notification');
      }

      // Simulate API call

      
      console.log('✅ Notification data saved successfully!');
      
    } catch (error) {
      console.error('❌ Error saving notification:', error);
    }

    // Reset form and close dialog
    setNotifyName('');
    setNotifyEmail('');
    setNotifyNumber('');
    setIsNotifyDialogOpen(false);
    
    alert('Thank you! We will notify you when this product is back in stock!');
  };

  const handleDynamicInputSelect = (groupType: string, itemLabel: string, inStock: boolean) => {
    // Update selected item
    setSelectedDynamicInputs(prev => ({
      ...prev,
      [groupType]: itemLabel
    }));
  };

  const handleAddToBag = async () => {
    if (isAnyItemOutOfStock) {
      alert('Cannot add out of stock items to bag');
      return;
    }
    
    setIsAddingToBag(true);
    
    // Prepare order data
    const orderData = {
      productId: product?._id.$oid,
      productName: product?.name,
      storage: selectedStorage,
      color: selectedColor,
      dynamicInputs: selectedDynamicInputs,
      totalPrice: totalPrice,
      quantity: 1
    };

    try {
      // Add your API call here to add to bag
      // await fetch('/api/cart/add', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData) 
      // });
      
      console.log('Adding to bag:', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert('Product added to bag successfully!');
    } catch (error) {
      console.error('Error adding to bag:', error);
      alert('Failed to add to bag. Please try again.');
    } finally {
      setIsAddingToBag(false);
    }
  };

  const handleOrderNow = async () => {
    if (isAnyItemOutOfStock) {
      alert('Cannot order out of stock items');
      return;
    }
    console.log('oderr')
    
    setIsOrdering(true);
    // addOrder({
    //   productId: product?._id.$oid,
    //   productName: product?.name || '',
    //   price: totalPrice,
    //   storage: selectedStorage,
    //   color: selectedColor,
    //   sim: selectedSim.type,
    //   region: selectedRegion.name,
    //   // dynamicInputs: 

    //   quantity: quantity, // Add quantity to order
    //   image: currentImage || selectedColor.image || '' // Add current image to order
    // });
    
    // Prepare order data
    const orderData = {
      productId: product?._id.$oid,
      productName: product?.name,
      storage: selectedStorage,
      color: selectedColor,
      dynamicInputs: selectedDynamicInputs,
      totalPrice: totalPrice,
      quantity: 1
    };

    try {
      // Add your API call here to create order
      // await fetch('/api/orders/create', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData) 
      // });
      
      console.log('Creating order:', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to checkout page
      // window.location.href = '/checkout';
      alert('Proceeding to checkout...');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  // Loading state
  if (!product && !error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="flex gap-3 justify-center">
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-6">
            <div>
              <div className="bg-gray-200 h-8 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-200 h-6 rounded w-1/4"></div>
            </div>
            
            <div className="bg-gray-200 h-12 rounded"></div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-200 h-32 rounded"></div>
              <div className="bg-gray-200 h-32 rounded"></div>
            </div>
            
            <div className="bg-gray-200 h-48 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Alert variant="destructive" className="mb-4 max-w-md mx-auto">
        <AlertDescription>Error: {error}</AlertDescription>
      </Alert>
      <Button 
        onClick={() => { 
          setError(null); 
          setRetryCount(prev => prev + 1); 
        }}
        className="bg-black hover:bg-gray-800 text-white"
      >
        Retry Loading
      </Button>
    </div>
  );
  
  if (!product) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image Section */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-0">
              <Image
                src={product.imageConfigs.find(config => config.colorName === selectedColor)?.image || product.imageConfigs[0].image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </CardContent>
          </Card>
          
          {/* Color Selection */}
          <div className="flex gap-3 justify-center items-center">
            {product.imageConfigs.map(config => (
              <button
                key={config._id.$oid}
                className={`relative w-5 h-5 rounded-full border-2 ${
                  selectedColor === config.colorName 
                    ? 'border-black ring-2 ring-offset-1 ring-black' 
                    : 'border-gray-300 hover:border-gray-400'
                } ${!config.inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ backgroundColor: config.colorHex }}
                onClick={() => config.inStock && setSelectedColor(config.colorName)}
                title={config.colorName + (config.inStock ? '' : ' (Out of Stock)')}
                disabled={!config.inStock}
                aria-label={`Select ${config.colorName} color${!config.inStock ? ' - Out of Stock' : ''}`}
                aria-disabled={!config.inStock}
              >
                {selectedColor === config.colorName && (
                  <CheckCircle2 className="absolute -top-1 -right-1 w-2 h-2 text-black bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3 font-medium flex justify-center items-center">
            {selectedColor}
            {getStockStatus.color && (
              <span className="text-red-500 text-xs ml-2">({getStockStatus.color})</span>
            )}
          </p>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            {selectedStorageDetails && (
              <Badge variant="secondary" className="text-sm">
                {selectedStorageDetails}
                {getStockStatus.storage && (
                  <span className="text-red-500 text-xs ml-2">({getStockStatus.storage})</span>
                )}
              </Badge>
            )}
          </div>

          {/* Total Price Card */}
          <div className="flex items-baseline justify-between mt-[-10px]">
            <div>
              <p className="text-sm font-medium">Total Price</p>
              <p className="text-2xl font-bold mt-1">৳{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {isAnyItemOutOfStock ? (
            <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full bg-black hover:bg-gray-900 text-white"
                  onClick={notify}
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Notify Me
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Get Notified When Back in Stock</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={notifyName}
                      onChange={(e) => setNotifyName(e.target.value)}
                      className="col-span-3"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="col-span-3"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="number" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="number"
                      type="tel"
                      value={notifyNumber}
                      onChange={(e) => setNotifyNumber(e.target.value)}
                      className="col-span-3"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsNotifyDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleNotifySubmit}
                    disabled={!notifyName || !notifyEmail || !notifyNumber}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : product.preOrderConfig.isPreOrder ? (
            <Button 
              size="lg" 
              className="w-full bg-black hover:bg-gray-950 text-white"
              onClick={handleOrderNow}
              disabled={isOrdering}
              aria-label={isOrdering ? "Processing pre-order" : "Pre-order now"}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {isOrdering ? 'Processing...' : 'Pre-order Now'}
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                onClick={handleAddToBag}
                disabled={isAddingToBag}
                aria-label={isAddingToBag ? "Adding product to bag" : "Add product to bag"}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {isAddingToBag ? 'Adding...' : 'Add to Bag'}
              </Button>
              <Button 
                size="lg" 
                className="w-full bg-black text-white border border-gray-300 hover:bg-gray-800"
                onClick={handleOrderNow}
                disabled={isOrdering}
                aria-label={isOrdering ? "Processing order" : "Order now"}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {isOrdering ? 'Processing...' : 'Order Now'}
              </Button>
            </div>
          )}

          <div className='grid grid-cols-2 gap-2'>
            {/* Storage Configuration */}
            {product.storageConfigs && product.storageConfigs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[15px] mt-[-16px]">
                    {product.accessoriesType}
                    {getStockStatus.storage && (
                      <span className="text-red-500 text-[10px] mt-2 ml-2">({getStockStatus.storage})</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 mt-[-14px] gap-2 flex-wrap max-sm:mt-[-24px]">
                    {product.storageConfigs.map(config => (
                      <Button
                        key={config._id.$oid}
                        variant={selectedStorage === config.shortDetails ? 'default' : 'outline'}
                        onClick={() => handleStorageSelect(config)}
                        className={!config.inStock ? 'opacity-60' : ''}
                      >
                        {config.label} 
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dynamic Inputs */}
            {product.dynamicInputs.map((group) => (
              <Card key={group._id.$oid}>
                <CardHeader>
                  <CardTitle className="text-[15px] capitalize mt-[-16px]">
                    {group.type}
                    {getStockStatus[group.type] && (
                      <span className="text-red-500 text-[10px] mt-2 ml-2">({getStockStatus[group.type]})</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 mt-[-14px] gap-2 max-sm:mt-[-24px]">
                    {group.items.map((item) => (
                      <Button
                        key={item._id.$oid}
                        variant={selectedDynamicInputs[group.type] === item.label ? 'default' : 'outline'}
                        onClick={() => handleDynamicInputSelect(group.type, item.label, item.inStock)}
                        className={!item.inStock ? 'opacity-60' : ''}
                      >
                        {item.label} 
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pre-order Information */}
          {/* {product.preOrderConfig.isPreOrder && (
            <Alert className="bg-amber-50 border-amber-200">
              <Package className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                <p className="font-semibold mb-1">Pre-order Available</p>
                {product.preOrderConfig.availabilityDate && (
                  <p className="text-sm">
                    Available from: {new Date(product.preOrderConfig.availabilityDate).toLocaleDateString()}
                  </p>
                )}
                {product.preOrderConfig.preOrderDiscount.$numberInt !== "0" && (
                  <p className="text-sm font-medium text-green-700 mt-1">
                    Pre-order Discount: {product.preOrderConfig.preOrderDiscount.$numberInt}%
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )} */}

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.details.map(detail => (
                  <div key={detail._id.$oid} className="flex justify-between py-2 border-b last:border-0">
                    <span className="text-sm font-medium text-muted-foreground">{detail.label}</span>
                    <span className="text-sm font-semibold text-right">{detail.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Product Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: product.description }} className="prose prose-gray max-w-none" />
        </CardContent>
      </Card>
    </div>
  );
}