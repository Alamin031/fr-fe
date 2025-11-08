'use client'

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ShoppingBag, CreditCard, Bell, Calendar, Minus, Plus, MessageCircle, X } from 'lucide-react';
import useOrderStore from '../../../../store/store';
import toast, { Toaster } from 'react-hot-toast';

import { useaddtobagStore, useSidebarStore  } from '../../../../store/store';

interface StorageConfig {
  id: { $numberDouble: string };
  name: string;
  shortDetails: string;
  inStock: boolean;
  basicPrice: string;
  prices: Array<{ [key: string]: string }>;
  colorStocks: Array<{ [key: string]: boolean }>;
  _id: { $oid: string };
}

interface ImageConfig {
  colorHex: string;
  colorName: string;
  id: { $numberDouble: string };
  image: string;
  inStock: boolean;
  _id: { $oid: string };
}

interface Detail {
  id: { $numberDouble: string };
  label: string;
  value: string;
  _id?: { $oid: string };
}

interface DynamicInputItem {
  label: string;
  price: string;
  inStock: boolean;
}

interface DynamicInput {
  type: string;
  items: DynamicInputItem[];
  _id?: { $oid: string };
}

interface PreOrderConfig {
  isPreOrder: boolean;
  availabilityDate?: string;
  estimatedShipping?: string;
  preOrderDiscount?: { $numberInt: string };
  maxPreOrderQuantity?: { $numberInt: string };
  _id?: { $oid: string };
}

interface Product {
  _id: { $oid: string };
  name: string;
  basePrice: { $numberInt: string };
  description: string;
  accessories: string;
  accessoriesType: string;
  storageConfigs: StorageConfig[];
  imageConfigs: ImageConfig[];
  details: Detail[];
  dynamicInputs: DynamicInput[];
  preOrderConfig: PreOrderConfig | null;
  createdAt: { $date: { $numberLong: string } };
  updatedAt: { $date: { $numberLong: string } };
  __v: { $numberInt: string };
}

// WhatsApp Icon Component
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

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

// Helper function to safely convert string prices to numbers (supports MongoDB numeric wrappers)
const parsePrice = (price: unknown): number => {
  // Handle undefined or null
  if (price === undefined || price === null) return 0;

  // If it's already a number, return it
  if (typeof price === 'number') return Math.max(0, price);

  // If it's a string, trim and parse
  if (typeof price === 'string') {
    const trimmed = price.trim();
    if (trimmed === '') return 0;
    const cleanString = trimmed.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleanString);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  }

  // If it's an object, try to unwrap common MongoDB numeric wrappers
  if (typeof price === 'object') {
    try {
      const p: any = price;
      const candidates = [
        p.$numberInt,
        p.$numberDouble,
        p.$numberLong,
        p.$numberDecimal,
        p.value,
      ];

      for (const candidate of candidates) {
        if (candidate === undefined || candidate === null) continue;
        if (typeof candidate === 'number') return Math.max(0, candidate);
        if (typeof candidate === 'string') {
          const fromCandidate = parsePrice(candidate); // recursive call will handle string parsing
          if (fromCandidate !== 0) return fromCandidate;
        }
      }
    } catch (err) {
      // ignore and fall through to return 0
    }
  }

  // Fallback
  return 0;
};

// Price Breakdown Component
const PriceBreakdown = ({ 
  product, 
  basePrice, 
  selectedStorage, 
  selectedColor, 
  selectedDynamicInputs, 
  quantity 
}: {
  product: Product | null;
  basePrice: number;
  selectedStorage: string;
  selectedColor: string;
  selectedDynamicInputs: {[key: string]: string};
  quantity: number;
}) => {
  if (!product) return null;

  // Calculate individual components
  const breakdown = {
    base: basePrice,
    storage: 0,
    color: 0,
    dynamic: 0
  };

  // Storage basic price
  if (selectedStorage && product.storageConfigs) {
    const storageConfig = product.storageConfigs.find(config => 
      config.shortDetails === selectedStorage
    );
    if (storageConfig && storageConfig.basicPrice) {
      breakdown.storage = parsePrice(storageConfig.basicPrice);
    }
  }

  // Color-specific price
  if (selectedStorage && selectedColor && product.storageConfigs && product.imageConfigs) {
    const storageConfig = product.storageConfigs.find(config => 
      config.shortDetails === selectedStorage
    );
    const colorConfig = product.imageConfigs.find(config => 
      config.colorName === selectedColor
    );
    
    if (storageConfig && colorConfig && storageConfig.prices) {
      const colorId = colorConfig.id.$numberDouble;
      storageConfig.prices.forEach(priceObj => {
        Object.entries(priceObj).forEach(([key, value]) => {
          if (key === colorId) {
            breakdown.color += parsePrice(value);
          }
        });
      });
    }
  }

  // Dynamic inputs prices
  if (product.dynamicInputs) {
    Object.values(selectedDynamicInputs).forEach(itemLabel => {
      for (const group of product.dynamicInputs) {
        const item = group.items.find(item => item.label === itemLabel);
        if (item) {
          breakdown.dynamic += parsePrice(item.price);
          break;
        }
      }
    });
  }

  const unitPrice = breakdown.base + breakdown.storage + breakdown.color + breakdown.dynamic;
  const total = unitPrice * quantity;

  return (
    <div className="space-y-2">
      {/* Base Price */}
     

      {/* Storage Price */}
     
      

      {/* Color Price */}
     

      {/* Dynamic Inputs Prices */}
     
      {/* Unit Price */}
     

      {/* Quantity and Total */}
     

      {/* Total Price */}
      <div className="flex items-baseline justify-between pt-2 border-t">
        <p className="text-lg font-bold">Total Amount</p>
        <p className="text-2xl font-bold text-black">৳{total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default function IpadDetails() {
  const { addOrder , clearOrder} = useOrderStore();
    const { toggleSidebar } = useSidebarStore();
  
  const { addOrderbag } = useaddtobagStore();
  const params = useParams();
  const router = useRouter();
  const productName = params?.productName as string | undefined;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedStorageDetails, setSelectedStorageDetails] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedDynamicInputs, setSelectedDynamicInputs] = useState<{[key: string]: string}>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToBag, setIsAddingToBag] = useState<boolean>(false);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [isWhatsAppOrdering, setIsWhatsAppOrdering] = useState<boolean>(false);
  const [stockStatus, setStockStatus] = useState<{[key: string]: string}>({});
  const [retryCount, setRetryCount] = useState<number>(0);
  
  // Notify dialog states
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState<boolean>(false);
  const [notifyName, setNotifyName] = useState<string>('');
  const [notifyEmail, setNotifyEmail] = useState<string>('');
  const [notifyNumber, setNotifyNumber] = useState<string>('');

  // CONFIGURE YOUR CONTACT DETAILS HERE
  const WHATSAPP_NUMBER = '8801234567890';

  // Debounce rapid selections
  const debouncedDynamicInputs = useDebounce(selectedDynamicInputs, 300);
  const debouncedSelectedStorage = useDebounce(selectedStorage, 300);
  const debouncedSelectedColor = useDebounce(selectedColor, 300);

  // Get base price as number
  const basePriceNumber = useMemo(() => {
      if (!product) return 0;
  const basePrice = parsePrice(product.basePrice);
  console.log('Base Price:', basePrice);
  return basePrice;;
  }, [product]);

  // Get price for selected storage and color - UPDATED VERSION
  const getAdditionalPrice = useMemo(() => {
    if (!product) return 0;
    
    let additionalPrice = 0;
    
    // Storage basic price
    if (debouncedSelectedStorage && product.storageConfigs) {
      const storageConfig = product.storageConfigs.find(config => 
        config.shortDetails === debouncedSelectedStorage
      );
      
      if (storageConfig?.basicPrice) {
        additionalPrice += parsePrice(storageConfig.basicPrice);
      }
    }
    
    // Storage + Color combination price
    if (debouncedSelectedStorage && selectedColor && product.storageConfigs && product.imageConfigs) {
      const storageConfig = product.storageConfigs.find(config => 
        config.shortDetails === debouncedSelectedStorage
      );
      
      const colorConfig = product.imageConfigs.find(config => 
        config.colorName === selectedColor
      );
      
      if (storageConfig?.prices && colorConfig) {
        const colorId = colorConfig.id.$numberDouble;
        
        // Look through all price objects to find one with our color ID
        storageConfig.prices.forEach(priceObj => {
          if (priceObj && typeof priceObj === 'object') {
            Object.entries(priceObj).forEach(([key, value]) => {
              // Compare as strings since both are strings
              if (key === colorId && value !== undefined) {
                additionalPrice += parsePrice(value);
              }
            });
          }
        });
      }
    }
    
    // Dynamic inputs prices
    if (product.dynamicInputs) {
      Object.values(debouncedDynamicInputs).forEach(itemLabel => {
        for (const group of product.dynamicInputs) {
          const item = group.items?.find(item => item.label === itemLabel);
          if (item?.price) {
            additionalPrice += parsePrice(item.price);
            break;
          }
        }
      });
    }
    
    return additionalPrice;
  }, [product, debouncedSelectedStorage, selectedColor, debouncedDynamicInputs]);

  // Calculate total price with memoization (including quantity)
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    
    const basePrice = basePriceNumber;
    const additionalPrice = getAdditionalPrice;
    
    return (basePrice + additionalPrice) * quantity;
  }, [product, basePriceNumber, getAdditionalPrice, quantity]);

  // Get stock status
  const getStockStatus = useMemo(() => {
    if (!product) return {};
    
    const status: {[key: string]: string} = {};
    
    // Check storage stock
    if (product.storageConfigs) {
      const selectedStorageItem = product.storageConfigs.find(config => 
        config.shortDetails === selectedStorage
      );
      if (selectedStorageItem && !selectedStorageItem.inStock) {
        status.storage = 'Out of Stock';
      }
    }
    
    // Check color stock
    if (product.imageConfigs) {
      const selectedColorItem = product.imageConfigs.find(config => 
        config.colorName === selectedColor
      );
      if (selectedColorItem && !selectedColorItem.inStock) {
        status.color = 'Out of Stock';
      }
    }
    
    // Check dynamic inputs stock
    if (product.dynamicInputs) {
      Object.entries(selectedDynamicInputs).forEach(([groupType, itemLabel]) => {
        const group = product.dynamicInputs.find(input => input.type === groupType);
        if (group) {
          const item = group.items.find(item => item.label === itemLabel);
          if (item && !item.inStock) {
            status[groupType] = 'Out of Stock';
          }
        }
      });
    }
    
    return status;
  }, [product, selectedStorage, selectedColor, selectedDynamicInputs]);

  // Check if any selected item is out of stock
  const isAnyItemOutOfStock = useMemo(() => {
    return Object.values(getStockStatus).some(status => status === 'Out of Stock');
  }, [getStockStatus]);

  // Check if storage is in stock
  const isStorageInStock = useMemo(() => {
    const selectedStorageItem = product?.storageConfigs?.find(config => 
      config.shortDetails === selectedStorage
    );
    return selectedStorageItem?.inStock ?? true;
  }, [product, selectedStorage]);

  // Handle quantity changes
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    // Check if there's a max pre-order quantity limit
    if (product?.preOrderConfig?.isPreOrder && product.preOrderConfig.maxPreOrderQuantity?.$numberInt !== "0") {
      const maxQty = parseInt(product.preOrderConfig.maxPreOrderQuantity.$numberInt) || 99;
      if (newQuantity > maxQty) return;
    }
    setQuantity(newQuantity);
  };

  useEffect(() => {
    if (!productName) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/accessories/getBySlug/${productName}`);
        console.log('Fetch response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        console.log('Fetched product data:', data);
        
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
        dynamicInputs: selectedDynamicInputs,
        quantity: quantity
      },
      totalPrice: totalPrice,
      timestamp: new Date().toISOString()
    };

    try {
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

const notify = () => toast('Here is your toast.');
      
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
      productId: product?._id?.$oid,
      productName: product?.name,
      storage: selectedStorage,
      color: selectedColor,
      dynamicInputs: selectedDynamicInputs,
      totapricelPrice: totalPrice,
      quantity: quantity
    };

    

    // Ensure we use a valid image URL (prefer selected color image, fallback to first image or empty string)
    const selectedImage = product?.imageConfigs?.find(cfg => cfg.colorName === selectedColor)?.image
      || product?.imageConfigs?.[0]?.image
      || '';

      // const id = parseInt(product?._id)
      
      const date = new Date();

  // Format date and time: YYYYMMDDTHHMMSS
  const dateTimeStr = date.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);

  // Generate random 6-character string
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Combine date-time and random string
  const randomId = `${dateTimeStr}-${randomPart}`;
  const id = parseInt(randomId)
    addOrderbag({
      productId: id,
      image : selectedImage,
      productName: product?.name || '',
      storage: selectedStorage,
      color: selectedColor,
      dynamicInputs: selectedDynamicInputs,
      price: totalPrice || 0,
      quantity: quantity
    });

    console.log(selectedStorage)

    try {
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
    
    setIsOrdering(true);
  // Prepare order data
  const orderData = {
    productId: product?._id.$oid,
    productName: product?.name,
    storage: selectedStorage,
    color: selectedColor,
    dynamicInputs: selectedDynamicInputs,
    totalPrice: totalPrice,
    quantity: quantity
  };

  // Ensure we use a valid image URL (prefer selected color image, fallback to first image or empty string)
  const selectedImage = product?.imageConfigs?.find(cfg => cfg.colorName === selectedColor)?.image
    || product?.imageConfigs?.[0]?.image
    || '';

  clearOrder();
  addOrder({
    productName: product?.name || '',
    price: totalPrice,
    color: selectedColor,
    image: selectedImage,
    quantity: quantity,
    storage: selectedStorage,
    productId: product?._id.$oid || '',
    dynamicInputs: selectedDynamicInputs
  });
  router.push('/checkout');
        router.push("/checkout");


    try {
      console.log('Creating order:', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert('Proceeding to checkout...');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    if (isAnyItemOutOfStock) {
      alert('Cannot order out of stock items');
      return;
    }
    
    setIsWhatsAppOrdering(true);
    
    try {
      // Get selected color details
      const selectedColorConfig = product?.imageConfigs.find(config => config.colorName === selectedColor);
      
      // Prepare comprehensive order details
      const orderDetails = `
🛒 *ORDER REQUEST - ${product?.name}*

📦 *Product Details:*
• Product: ${product?.name}
• Storage: ${selectedStorage}
• Color: ${selectedColor} ${selectedColorConfig?.colorHex ? `(${selectedColorConfig.colorHex})` : ''}
• Quantity: ${quantity}

⚙️ *Selected Options:*
${Object.entries(selectedDynamicInputs).map(([key, value]) => `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join('\n')}

💰 *Pricing Breakdown:*
• Base Price: ৳${basePriceNumber.toFixed(2)}
• Additional Charges: ৳${getAdditionalPrice.toFixed(2)}
• Unit Price: ৳{(totalPrice / quantity).toFixed(2)}
• Quantity: ${quantity}
• *Total Amount: ৳${totalPrice.toFixed(2)}*

📋 *Please provide your details:*
• Full Name:
• Phone Number:
• Delivery Address:
• Preferred Delivery Date:

Thank you! 🎉
      `.trim();

      // Encode the message for WhatsApp URL
      const encodedMessage = encodeURIComponent(orderDetails);
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Optional: Track WhatsApp orders
      console.log('WhatsApp order initiated:', {
        product: product?.name,
        storage: selectedStorage,
        color: selectedColor,
        quantity: quantity,
        totalPrice: totalPrice
      });
      
    } catch (error) {
      console.error('Error preparing WhatsApp order:', error);
      alert('Failed to open WhatsApp. Please try again.');
    } finally {
      setIsWhatsAppOrdering(false);
    }
  };

  // Floating chat handlers
  const handleFloatingWhatsAppClick = () => {
    const message = encodeURIComponent('Hi! I need help with a product.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
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
            <CardContent className="p-10">
              <Image
                src={product.imageConfigs.find(config => config.colorName === selectedColor)?.image || product.imageConfigs[0]?.image || '/placeholder-image.jpg'}
                alt={product.name}
                width={400}
                height={400}
                className="w-full  object-cover"
                priority
              />
            </CardContent>
          </Card>
          
          {/* Color Selection */}
          <div className="flex gap-3 justify-center items-center">
            {product.imageConfigs?.map(config => (
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

          {/* Price Breakdown */}
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
            <PriceBreakdown 
              product={product}
              basePrice={basePriceNumber}
              selectedStorage={selectedStorage}
              selectedColor={selectedColor}
              selectedDynamicInputs={selectedDynamicInputs}
              quantity={quantity}
            />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={product.preOrderConfig?.isPreOrder && product.preOrderConfig.maxPreOrderQuantity?.$numberInt !== "0" 
                  ? parseInt(product.preOrderConfig.maxPreOrderQuantity.$numberInt) 
                  : 99}
                value={quantity}
                onChange={(e) => handleQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-8 text-center border-0 focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={product.preOrderConfig?.isPreOrder && 
                  product.preOrderConfig.maxPreOrderQuantity?.$numberInt !== "0" && 
                  quantity >= parseInt(product.preOrderConfig.maxPreOrderQuantity.$numberInt)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {product.preOrderConfig?.isPreOrder && product.preOrderConfig.maxPreOrderQuantity?.$numberInt !== "0" && (
              <span className="text-xs text-muted-foreground">
                Max: {product.preOrderConfig.maxPreOrderQuantity.$numberInt}
              </span>
            )}
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
          ) : product.preOrderConfig?.isPreOrder ? (
            <div className="grid grid-cols-1 gap-3">
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
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                onClick={handleWhatsAppOrder}
                disabled={isWhatsAppOrdering}
              >
                <WhatsAppIcon />
                {isWhatsAppOrdering ? 'Opening...' : 'Order via WhatsApp'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={toggleSidebar}>
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
                </button>
                
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
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                onClick={handleWhatsAppOrder}
                disabled={isWhatsAppOrdering}
              >
                <WhatsAppIcon />
                {isWhatsAppOrdering ? 'Opening...' : 'Order via WhatsApp'}
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
                                                className='max-sm:text-[10px]'

                      >
                        {config.name} 
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dynamic Inputs */}
            {product.dynamicInputs && product.dynamicInputs.map((group) => (
              <Card key={group.type}>
                <CardHeader>
                  <CardTitle className="text-[15px] capitalize mt-[-16px] ">
                    {group.type}
                    {getStockStatus[group.type] && (
                      <span className="text-red-500 text-[10px] mt-2 ml-2">({getStockStatus[group.type]})</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 mt-[-14px] gap-2 max-sm:mt-[-24px]  ">
                    {group.items.map((item, index) => (
                      <Button
                        key={index}
                        variant={selectedDynamicInputs[group.type] === item.label ? 'default' : 'outline'}
                        onClick={() => handleDynamicInputSelect(group.type, item.label, item.inStock)}
                        className='max-sm:text-[10px]'
                      >
                        {item.label} 
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.details.map((detail, index) => (
                  <div key={detail._id?.$oid || index} className="flex justify-between py-2 border-b last:border-0">
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

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <button
          onClick={handleFloatingWhatsAppClick}
          className="group relative flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mb-10 max-sm:mb-30"
          aria-label="Chat on WhatsApp"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full text-white">
            <WhatsAppIcon />
          </div>
        </button>
      </div>
    </div>
  );
}