import React from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface ProductCTAProps {
  priceInfo: any;
  isInCart: boolean;
  onBuy: () => void;
}

export function ProductCTA({ priceInfo, isInCart, onBuy }: ProductCTAProps) {
  return (
    <section className="py-32 bg-black text-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <h2 className="text-5xl md:text-6xl font-bold">
            Pronto para começar?
          </h2>

          <div className="space-y-6">
            {priceInfo.hasDiscount && (
              <div className="flex items-center justify-center gap-4">
                <div className="text-2xl text-white/60 line-through">
                  De {formatCurrency(priceInfo.originalPrice)}
                </div>
                <div className="bg-danger text-white px-4 py-2 rounded-full text-sm font-bold">
                  -{priceInfo.discountPercentage}% OFF
                </div>
              </div>
            )}
            <div className="text-7xl font-bold">
              {formatCurrency(priceInfo.finalPrice)}
            </div>
            <p className="text-xl text-white/80">
              Acesso completo por 1 ano
            </p>
          </div>

          <Button
            onClick={onBuy}
            variant="secondary"
            size="lg"
            className="text-lg px-12"
          >
            {isInCart ? 'Ver Carrinho' : 'Comprar Agora'}
          </Button>

          <div className="pt-8 flex items-center justify-center gap-12 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Compra segura
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Acesso imediato
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              7 dias de garantia
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
