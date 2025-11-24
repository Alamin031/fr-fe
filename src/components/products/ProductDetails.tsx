'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';

interface ProductDetailsProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  isLoading?: boolean;
}

export function ProductDetails({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
  isLoading = false,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Thumbnail Images */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 border-2 border-gray-200 rounded cursor-pointer hover:border-blue-600"
              >
                <Image
                  src={img}
                  alt={`Product ${idx}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          {product.brand && (
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              {product.brand.name}
            </p>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          {product.shortDescription && (
            <p className="text-gray-600">{product.shortDescription}</p>
          )}
        </div>

        {/* Price */}
        <div className="border-t border-b border-gray-200 py-4">
          <p className="text-4xl font-bold text-gray-900">
            ৳{product.basePrice.toLocaleString()}
          </p>
          {product.priceHistory && product.priceHistory.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Original: <span className="line-through">৳{product.priceHistory[0].oldPrice}</span>
            </p>
          )}
        </div>

        {/* Product Highlights */}
        {product.highlights && product.highlights.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              {product.highlights.map((highlight, idx) => (
                <li key={idx} className="text-gray-700">
                  {highlight.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Options */}
        <div className="space-y-4">
          {/* Color Selection */}
          {product.imageConfigs && product.imageConfigs.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Color:
              </label>
              <div className="flex gap-2">
                {product.imageConfigs.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => setSelectedColor(config.colorName)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                      selectedColor === config.colorName
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: config.colorHex }}
                    />
                    {config.colorName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Selection */}
          {product.storageConfigs && product.storageConfigs.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Storage:
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.storageConfigs.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => setSelectedStorage(config.name)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedStorage === config.name
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!config.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!config.inStock}
                  >
                    {config.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center border-0 outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onAddToCart?.(product, quantity)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition font-semibold"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
          <button
            onClick={() => onAddToWishlist?.(product.id)}
            className={`px-6 py-3 rounded-lg border-2 transition font-semibold ${
              isInWishlist
                ? 'bg-red-50 border-red-600 text-red-600'
                : 'border-gray-300 text-gray-600 hover:border-red-600'
            }`}
          >
            <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition">
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="pt-4 border-t border-gray-200">
            <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0
                ? `${product.stock} in stock`
                : 'Out of stock'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
