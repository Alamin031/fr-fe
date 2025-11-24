'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
          {product.isHot && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Hot
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onAddToWishlist?.(product.id)}
          className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
            isInWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand.name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-blue-600"
          >
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">
            ৳{product.basePrice.toLocaleString()}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(product)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
