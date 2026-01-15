import React from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

interface ProductHeroProps {
  product: Product;
  priceInfo: any;
  scrollY: number;
  isInCart: boolean;
  onBuy: () => void;
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

export function ProductHero({ product, priceInfo, scrollY, isInCart, onBuy }: ProductHeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
      </div>

      <Container className="relative z-10 text-center text-white">
        {product.badge && (
          <div className="mb-6 flex justify-center">
            <span className={`inline-block px-4 py-2 text-sm font-bold rounded-full ${badgeStyles[product.badge]}`}>
              {badgeLabels[product.badge]}
            </span>
          </div>
        )}

        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
          {product.name}
        </h1>

        <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
          {product.shortDescription}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          {priceInfo.hasDiscount && (
            <div className="text-xl text-white/60 line-through">
              {formatCurrency(priceInfo.originalPrice)}
            </div>
          )}
          <div className="text-5xl font-bold">
            {formatCurrency(priceInfo.finalPrice)}
          </div>
          {priceInfo.hasDiscount && (
            <div className="bg-danger text-white px-4 py-2 rounded-full text-sm font-bold">
              -{priceInfo.discountPercentage}% OFF
            </div>
          )}
        </div>

        <Button
          onClick={onBuy}
          variant="secondary"
          size="lg"
          className="text-lg px-12"
        >
          {isInCart ? 'Ver Carrinho' : 'Comprar Agora'}
        </Button>

        {product.soldCount && product.soldCount > 0 && (
          <p className="mt-6 text-white/70">
            {product.soldCount.toLocaleString('pt-BR')} pessoas já compraram
          </p>
        )}
      </Container>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
