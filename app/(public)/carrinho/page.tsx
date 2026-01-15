'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { useDiscount } from '@/contexts/DiscountContext';
import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { createCheckoutSession } from '@/app/actions/checkout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CartItem } from './components/CartItem';
import { CartSummary } from './components/CartSummary';

export default function CartPage() {
  const { items, removeFromCart, getTotal, getSuggestedProducts, clearCart, isHydrated } = useCart();
  const { getProductPrice, discountConfig, isHydrated: discountHydrated } = useDiscount();
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Memoizar cálculos de totais
  const { totalOriginal, totalWithDiscount, totalSavings, hasAnyDiscount } = useMemo(() => {
    let totalOrig = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      const priceInfo = getProductPrice(item.product);
      totalOrig += priceInfo.originalPrice;
      totalDiscount += priceInfo.finalPrice;
    });

    return {
      totalOriginal: totalOrig,
      totalWithDiscount: totalDiscount,
      totalSavings: totalOrig - totalDiscount,
      hasAnyDiscount: totalOrig - totalDiscount > 0,
    };
  }, [items, getProductPrice]);

  // Memoizar sugestões
  const suggestedProducts = useMemo(
    () => getSuggestedProducts(),
    [getSuggestedProducts]
  );

  // Memoizar callbacks
  const handleRemoveFromCart = useCallback((productId: string) => {
    removeFromCart(productId);
  }, [removeFromCart]);

  const handleClearCart = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      clearCart();
    }
  }, [clearCart]);

  const handleCheckout = useCallback(async () => {
    if (!user) {
      router.push('/entrar?redirect=/carrinho');
      return;
    }

    setIsLoading(true);
    try {
      const productIds = items.map(item => item.product.id);
      const { url } = await createCheckoutSession(user.id, productIds);

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [user, items, router]);

  // Aguardar hidratação completa antes de renderizar conteúdo dinâmico
  if (!isHydrated || !discountHydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow py-8 md:py-12 px-4 sm:px-6 lg:px-0">
          <Container>
            <div className="animate-pulse space-y-8">
              <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
                  ))}
                </div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center py-8 md:py-20 px-4 sm:px-6 lg:px-8">
          <Container size="sm">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Seu carrinho está vazio</h1>
              <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                Adicione produtos incríveis ao seu carrinho
              </p>
              <Link href="/" className="w-full">
                <Button variant="primary" size="lg" className="w-full">
                  Ver Produtos
                </Button>
              </Link>

              {suggestedProducts.length > 0 && (
                <div className="mt-12 md:mt-20">
                  <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8 text-left">Comece por aqui</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {suggestedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow py-8 md:py-12 px-4 sm:px-6 lg:px-0">
        <Container>
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Carrinho</h1>
            <p className="text-gray-600 text-sm md:text-base">{items.length} {items.length === 1 ? 'produto' : 'produtos'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => {
                  const priceInfo = getProductPrice(item.product);
                  return (
                    <CartItem
                      key={item.product.id}
                      product={item.product}
                      priceInfo={priceInfo}
                      onRemove={handleRemoveFromCart}
                    />
                  );
                })}
              </div>
            </div>

            <CartSummary
              totalOriginal={totalOriginal}
              totalWithDiscount={totalWithDiscount}
              totalSavings={totalSavings}
              hasDiscount={hasAnyDiscount}
              discountConfig={discountConfig}
              isLoading={isLoading}
              onCheckout={handleCheckout}
              onClearCart={handleClearCart}
            />
          </div>

          {suggestedProducts.length > 0 && (
            <div className="mt-20 pt-20 border-t border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Você também pode gostar</h2>
                <p className="text-gray-600">Materiais complementares selecionados para você</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {suggestedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
