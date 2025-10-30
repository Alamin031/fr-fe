// components/Sidebar.jsx
import React from 'react';
import { useSidebarStore } from '../../../store/store';
import { useaddtobagStore } from '../../../store/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Package, Trash2, Home, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

const Addtobag = () => {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebarStore() as {
    isOpen: boolean;
    toggleSidebar: (open?: boolean) => void;
    closeSidebar: () => void;
  };
  const { order, removeOrder ,clearOrder } = useaddtobagStore();

  console.log(order);


  // Remove product by ID
  const handleRemoveItem = (productId: number) => {
    removeOrder(productId);
  };

  // Calculate total price
  const totalPrice = order.reduce((sum, item) => {
    return sum + (item.price * item.quantity || 0);
  }, 0);

  // Format price in Bangladeshi Taka (BDT)
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Render dynamic inputs in a clean UI
  const renderDynamicInputs = (dynamicInputs: unknown) => {
    if (!dynamicInputs) return null;

    try {
      // If it's a JSON string, parse it; otherwise use the value directly
      const parsed = typeof dynamicInputs === 'string' ? JSON.parse(dynamicInputs) : dynamicInputs;
      const inputsObj = (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
        ? (parsed as Record<string, unknown>)
        : null;

      if (!inputsObj) {
        return (
          <Badge variant="outline" className="text-xs font-normal bg-gray-50">
            {String(dynamicInputs)}
          </Badge>
        );
      }

      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(inputsObj).map(([key, value]) => (
            <Badge 
              key={key} 
              variant="outline" 
              className="text-xs font-normal bg-gray-100 text-black border-0"
            >
              {key}: {String(value)}
            </Badge>
          ))}
        </div>
      );
    } catch (error) {
      // Fallback for invalid JSON or other data types
      return (
        <Badge variant="outline" className="text-xs font-normal bg-gray-50">
          {String(dynamicInputs)}
        </Badge>
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleSidebar}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white">
        {/* Header */}
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Add To Bag
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto ">
          {order.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground p-6">
              <Package className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-center mt-2">
                Add some products to get started
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {order.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                        <Image
                          src={
                            item.image ??
                            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
                          }
                          width={64}
                          height={64}
                          alt={item.productName ?? 'Product image'}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-medium text-sm leading-tight truncate">
                          {item.productName}
                        </h3>

                        {/* Product Specs */}
                        <div className="space-y-1">
                          {item.storage && (
                            <Badge variant="secondary" className="text-xs font-normal">
                              {item.storage}
                            </Badge>
                          )}
                          {item.color && (
                            <Badge variant="secondary" className="text-xs font-normal">
                              {item.color}
                            </Badge>
                          )}
                          
                          {/* Dynamic Inputs - Improved UI */}
                          {item.dynamicInputs && renderDynamicInputs(item.dynamicInputs)}
                        </div>

                        {/* Price & Quantity */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-semibold text-sm">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => {
                          if (item.productId != null) handleRemoveItem(item.productId);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {order.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {/* Checkout Button */}
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>

            {/* Continue Shopping */}
            <Button
              variant="outline"
              className="w-full"
              onClick={closeSidebar}
            >
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Addtobag;