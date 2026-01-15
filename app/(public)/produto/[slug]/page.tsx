'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { getProductBySlug } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';
import { useDiscount } from '@/contexts/DiscountContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductHero } from './components/ProductHero';
import { BenefitsSection, DeliverablesSection, HighlightsSection, FAQSection } from './components/ProductSections';
import { ProductCTA } from './components/ProductCTA';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  const [scrollY, setScrollY] = useState(0);
  const { addToCart, items } = useCart();
  const { getProductPrice } = useDiscount();
  const router = useRouter();

  const isInCart = product ? items.some(item => item.product.id === product.id) : false;
  const priceInfo = product ? getProductPrice(product) : null;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuy = () => {
    if (!isInCart && product) {
      addToCart(product);
    }
    router.push('/carrinho');
  };

  if (!product || !priceInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <Link href="/">
              <Button variant="primary">Ver Todos os Produtos</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        <ProductHero
          product={product}
          priceInfo={priceInfo}
          scrollY={scrollY}
          isInCart={isInCart}
          onBuy={handleBuy}
        />

        <BenefitsSection benefits={product.benefits} />

        <DeliverablesSection deliverables={product.deliverables} />

        <HighlightsSection highlights={product.highlights} />

        <FAQSection faqs={product.faqs} />

        <ProductCTA
          priceInfo={priceInfo}
          isInCart={isInCart}
          onBuy={handleBuy}
        />
      </main>

      <Footer />
    </div>
  );
}
