import React, { memo } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

interface CartItemProps {
  product: Product;
  priceInfo: {
    originalPrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    discountPercentage: number;
  };
  onRemove: (id: string) => void;
}

export const CartItem = memo(({ product, priceInfo, onRemove }: CartItemProps) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-colors relative">
    {priceInfo.hasDiscount && (
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-danger text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          -{priceInfo.discountPercentage}% OFF
        </div>
      </div>
    )}

    <div className="flex gap-6">
      <Link href={`/produto/${product.slug}`} className="flex-shrink-0">
        <div className="w-32 h-32 bg-accent rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/produto/${product.slug}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div>
            {priceInfo.hasDiscount && (
              <div className="text-sm text-gray-500 line-through mb-1">
                {formatCurrency(priceInfo.originalPrice)}
              </div>
            )}
            <div className="text-2xl font-bold">
              {formatCurrency(priceInfo.finalPrice)}
            </div>
          </div>

          <button
            onClick={() => onRemove(product.id)}
            className="text-sm text-gray-500 hover:text-danger transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  </div>
));

CartItem.displayName = 'CartItem';
