'use client'
import React, { useEffect, useState } from 'react';
import { CreditCard, Truck, RefreshCw, Tag, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FeaturesBanner() {
  type FeatureItem = { id: string | number; text: string };
  const [items, setItems] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/text/textget`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const features = [
    { icon: CreditCard, title: '36 Months EMI', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { icon: Truck, title: 'Fastest Home Delivery', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { icon: RefreshCw, title: 'Exchange Facility', color: 'text-green-600', bgColor: 'bg-green-50' },
    { icon: Tag, title: 'Best Price Deals', color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { icon: Headphones, title: 'After Sell Service', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  return (
    <>
      {/* Features Grid - Hidden on mobile */}
      <div className="w-full  mx-auto px-4 py-6 max-sm:hidden">
        <Card className="shadow-sm">
          <CardContent className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className={` p-3 rounded-xl flex-shrink-0`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-foreground font-medium text-base leading-tight">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marquee Section */}
      {!loading && items.length > 0 && (
        <div className="mt-6 overflow-hidden relative bg-muted/50 py-3  ">
          <div className="flex whitespace-nowrap animate-scroll " >
            {/* First set of items */}
            {items.map((item) => (
              <Badge 
                key={`first-${item.id}`} 
                variant="secondary"
                className=" mx-2 px-4 py-1.5 text-sm font-normal border  border-black/10"
              >
                {item.text}
              </Badge>
            ))}
            {/* Duplicate for seamless loop */}
            {items.map((item) => (
              <Badge 
                key={`second-${item.id}`} 
                variant="secondary"
                className=" px-4 py-1.5 text-sm font-normal "
              >
                {item.text}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(20);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}