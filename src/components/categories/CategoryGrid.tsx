'use client';

import { Category } from '@/types';
import { CategoryCard } from './CategoryCard';

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
  error?: Error | null;
  cols?: 2 | 3 | 4;
}

export function CategoryGrid({
  categories,
  isLoading = false,
  error = null,
  cols = 4,
}: CategoryGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[cols]} gap-6`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">
          Error loading categories: {error.message}
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No categories available.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[cols]} gap-6`}>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
