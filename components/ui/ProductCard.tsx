import React, { memo, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatCurrency, translateProductType, translateCategory } from '@/lib/utils';
import { Button } from './Button';
import { useCart } from '@/contexts/CartContext';
import { useDiscount } from '@/contexts/DiscountContext';

interface ProductCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
}

const badgeStyles = {
  'new': 'bg-success text-white',
  'popular': 'bg-warning text-white',
  'best-seller': 'bg-black text-white',
};

const badgeLabels = {
  'new': '✨ Novo',
  'popular': '🔥 Popular',
  'best-seller': '⭐ Mais Vendido',
};

function ProductCardComponent({ product, onBuy }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const { getProductPrice } = useDiscount();
  
  // Memoizar estado do carrinho para este produto
  const isInCart = useMemo(
    () => items.some(item => item.product.id === product.id),
    [items, product.id]
  );

  // Memoizar preço com desconto
  const priceInfo = useMemo(
    () => getProductPrice(product),
    [product, getProductPrice]
  );

  const hasDiscount = priceInfo.hasDiscount;
  const discountPercentage = priceInfo.discountPercentage;

  const handleAddToCart = useCallback(() => {
    if (onBuy) {
      onBuy(product);
    } else {
      addToCart(product);
    }
  }, [product, onBuy, addToCart]);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-gray-300">
      {product.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${badgeStyles[product.badge]}`}>
            {badgeLabels[product.badge]}
          </span>
        </div>
      )}

      {hasDiscount && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-danger text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        </div>
      )}

      <Link href={`/produto/${product.slug}`}>
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-accent to-gray-100 overflow-hidden cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full font-semibold text-sm shadow-xl">
              Ver Detalhes →
            </div>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">
            {translateCategory(product.category)}
          </span>
          <span className="text-xs text-gray-500">
            {translateProductType(product.type)}
          </span>
        </div>

        <Link href={`/produto/${product.slug}`}>
          <h3 className="text-xl font-bold text-black mb-2 hover:text-gray-700 transition-colors cursor-pointer line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.shortDescription}
        </p>

        {product.soldCount && product.soldCount > 0 && (
          <div className="flex items-center mb-4 text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1.5 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-medium">{product.soldCount.toLocaleString('pt-BR')}</span>
            <span className="ml-1">pessoas já compraram</span>
          </div>
        )}

        {product.features && product.features.length > 0 && (
          <ul className="space-y-2 mb-6">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <svg
                  className="w-5 h-5 mr-2 text-success flex-shrink-0 mt-0.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              {hasDiscount && (
                <div className="text-sm text-gray-500 line-through mb-1">
                  {formatCurrency(priceInfo.originalPrice)}
                </div>
              )}
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-black">
                  {formatCurrency(priceInfo.finalPrice)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Acesso por 1 ano
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            variant={isInCart ? "secondary" : "primary"}
            size="md"
            className="w-full shadow-lg hover:shadow-xl"
            disabled={isInCart}
          >
            {isInCart ? '✓ No Carrinho' : 'Adicionar ao Carrinho'}
          </Button>

          <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Compra 100% segura
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoizar o componente para evitar re-renders desnecessários
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-render se product props forem iguais
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.onBuy === nextProps.onBuy
  );
});
