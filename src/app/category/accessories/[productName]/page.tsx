'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Package, ShoppingBag, CreditCard } from 'lucide-react';

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

export default function Page() {
  const params = useParams();
  const productName = params?.productName as string | undefined;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedStorageDetails, setSelectedStorageDetails] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedDynamicInputs, setSelectedDynamicInputs] = useState<{[key: string]: string}>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isAddingToBag, setIsAddingToBag] = useState<boolean>(false);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  useEffect(() => {
    if (!productName) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/getproduct/accessoriesdetails/product?name=${productName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        
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
  }, [productName]);

  const handleStorageSelect = (config: StorageConfig) => {
    setSelectedStorage(config.shortDetails);
    setSelectedStorageDetails(config.shortDetails);
  };

  const handleDynamicInputSelect = (groupType: string, itemLabel: string) => {
    setSelectedDynamicInputs(prev => ({
      ...prev,
      [groupType]: itemLabel
    }));
  };

  useEffect(() => {
    if (!product) return;

    let price = parseFloat(product.basePrice);
    
    if (selectedStorage) {
      const storage = product.storageConfigs.find(config => config.shortDetails === selectedStorage);
      if (storage) price += parseFloat(storage.price);
    }
    
    if (selectedColor) {
      const color = product.imageConfigs.find(config => config.colorName === selectedColor);
      if (color) price += parseFloat(color.price);
    }
    
    Object.keys(selectedDynamicInputs).forEach(groupType => {
      const selectedItemLabel = selectedDynamicInputs[groupType];
      const group = product.dynamicInputs.find(input => input.type === groupType);
      if (group) {
        const item = group.items.find(item => item.label === selectedItemLabel);
        if (item) price += parseFloat(item.price);
      }
    });
    
    setTotalPrice(price);
  }, [selectedStorage, selectedColor, selectedDynamicInputs, product]);

  const handleAddToBag = async () => {
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
    setIsOrdering(true);
    
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

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive">
        <AlertDescription>Error: {error}</AlertDescription>
      </Alert>
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
              />
            </CardContent>
          </Card>
          
          {/* Color Selection */}
          
          <div className="flex gap-3 justify-center items-center ">
                  {product.imageConfigs.map(config => (
                    <button
                      key={config._id.$oid}
                      className={`relative w-10 h-10 rounded-full border-2  ${
                        selectedColor === config.colorName 
                          ? 'border-black ring-2 ring-offset-1 ring-black' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${!config.inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ backgroundColor: config.colorHex }}
                      onClick={() => config.inStock && setSelectedColor(config.colorName)}
                      title={config.colorName + (config.inStock ? '' : ' (Out of Stock)')}
                      disabled={!config.inStock}
                    >
                      {selectedColor === config.colorName && (
                        <CheckCircle2 className="absolute -top-1 -right-1 w-5 h-5 text-black bg-white rounded-full" />
                      )}
                    </button>
                    
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3 font-medium flex justify-center items-center">{selectedColor}</p>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            {selectedStorageDetails && (
              <Badge variant="secondary" className="text-sm">
                {selectedStorageDetails}
              </Badge>
            )}
          </div>

          {/* Total Price Card */}
          
          <div className="flex items-baseline justify-between mt-[-10px]" >
                <div>
                  <p className="text-sm font-medium ">Total Price</p>
                  <p className="text-2xl font-bold mt-1">৳{totalPrice.toFixed(2)}</p>
                </div>
              </div>
          <div className="grid grid-cols-2 gap-3 bg-white">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full"
              onClick={handleAddToBag}
              disabled={isAddingToBag}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {isAddingToBag ? 'Adding...' : 'Add to Bag'}
            </Button>
            <Button 
              size="lg" 
              className="w-full bg-black text-white border border-gray-300"
              onClick={handleOrderNow}
              disabled={isOrdering}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              {isOrdering ? 'Processing...' : 'Order Now'}
            </Button>
          </div>

          
          <div className='grid grid-cols-2 gap-2'>
            {/* Storage Configuration */}
            {product.storageConfigs && product.storageConfigs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[15px] mt-[-16px]">{product.accessoriesType}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 mt-[-14px] gap-2 flex-wrap max-sm:mt-[-24px]">
                    {product.storageConfigs.map(config => (
                      <Button
                        key={config._id.$oid}
                        variant={selectedStorage === config.shortDetails ? 'default' : 'outline'}
                        className={`${!config.inStock ? 'opacity-50' : ''}`}
                        onClick={() => handleStorageSelect(config)}
                        disabled={!config.inStock}
                      >
                        {config.label} {!config.inStock && '(Out of Stock)'}
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
                  <CardTitle className="text-[15px] capitalize mt-[-16px]">{group.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 mt-[-14px] gap-2 max-sm:mt-[-24px]">
                    {group.items.map((item) => (
                      <Button
                        key={item._id.$oid}
                        variant={selectedDynamicInputs[group.type] === item.label ? 'default' : 'outline'}
                        onClick={() => handleDynamicInputSelect(group.type, item.label)}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Now and Add to Bag buttons */}
         
          {/* Pre-order Information */}
          {product.preOrderConfig.isPreOrder && (
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
          )}

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