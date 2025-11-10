'use client'
import React, { useEffect, useState } from 'react';
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

  
  return (
    <div className='mx-25 max-sm:mx-4' >
     
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
    </div>
  );
}