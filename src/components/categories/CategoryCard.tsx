'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer">
        {/* Category Image */}
        <div className="relative h-40 bg-gray-100 overflow-hidden">
          {category.image && (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        {/* Category Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {category.description}
            </p>
          )}
          <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
            Browse
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
