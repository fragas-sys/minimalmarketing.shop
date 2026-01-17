'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ui/ProductCard';
import { mockProducts } from '@/data/mockData';
import { ProductType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all');
  const [ownedProductIds, setOwnedProductIds] = useState<Set<string>>(new Set());
  const { user, isAuthenticated } = useAuth();

  // Buscar produtos que o usuário já possui
  useEffect(() => {
    async function fetchOwnedProducts() {
      if (!isAuthenticated) {
        setOwnedProductIds(new Set());
        return;
      }

      try {
        const response = await fetch('/api/orders/user', {
          credentials: 'include',
        });

        if (response.ok) {
          const userProducts = await response.json();
          // Filtrar apenas produtos com acesso válido
          const validProductIds = userProducts
            .filter((p: any) => p.hasValidAccess)
            .map((p: any) => p.productId);
          setOwnedProductIds(new Set(validProductIds));
        }
      } catch (error) {
        console.error('Erro ao buscar produtos do usuário:', error);
      }
    }

    fetchOwnedProducts();
  }, [isAuthenticated, user]);

  const filteredProducts = mockProducts.filter(product => {
    // Não mostrar produtos que o usuário já possui
    if (ownedProductIds.has(product.id)) {
      return false;
    }
    return selectedType === 'all' || product.type === selectedType;
  });

  const totalSold = mockProducts.reduce((acc, p) => acc + (p.soldCount || 0), 0);
  const featuredProducts = mockProducts
    .filter(p => {
      // Não mostrar produtos que o usuário já possui
      if (ownedProductIds.has(p.id)) {
        return false;
      }
      return p.badge === 'best-seller' || p.badge === 'popular';
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Minimal Hero - Super Clean */}
        <section className="pt-12 md:pt-20 pb-8 md:pb-12 border-b border-gray-100">
          <Container>
            <div className="max-w-3xl px-4 sm:px-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
                Materiais digitais para profissionais de marketing.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-2">
                Acesso por 1 ano.
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                {totalSold.toLocaleString('pt-BR')} materiais vendidos
              </p>
            </div>
          </Container>
        </section>

        {/* Featured Products - Big Visual */}
        <section className="py-8 md:py-16 bg-accent/30">
          <Container>
            <div className="mb-6 md:mb-8 px-4 sm:px-0">
              <h2 className="text-2xl md:text-3xl font-bold">Destaques</h2>
            </div>
            <div className="px-4 sm:px-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* All Products - The Heart */}
        <section className="py-8 md:py-16">
          <Container>
            {/* Filters - Clean and Minimal */}
            <div className="mb-6 md:mb-8 px-4 sm:px-0 border-b border-gray-200 pb-4 md:pb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Todos os produtos</h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    selectedType === 'all'
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black border border-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedType(ProductType.COURSE)}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    selectedType === ProductType.COURSE
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black border border-gray-200'
                  }`}
                >
                  Cursos
                </button>
                <button
                  onClick={() => setSelectedType(ProductType.TEMPLATES)}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    selectedType === ProductType.TEMPLATES
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black border border-gray-200'
                  }`}
                >
                  Templates
                </button>
                <button
                  onClick={() => setSelectedType(ProductType.AI_PROMPTS)}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    selectedType === ProductType.AI_PROMPTS
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black border border-gray-200'
                  }`}
                >
                  Prompts IA
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="px-4 sm:px-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 md:py-20">
                  <p className="text-gray-600 text-sm md:text-base">Nenhum produto encontrado.</p>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* Simple Value Props */}
        <section className="py-8 md:py-16 border-t border-gray-100">
          <Container>
            <div className="px-4 sm:px-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-bold mb-2">100%</div>
                  <div className="text-xs md:text-sm text-gray-600">Curadoria própria</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold mb-2">1 ano</div>
                  <div className="text-xs md:text-sm text-gray-600">De acesso</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold mb-2">24h</div>
                  <div className="text-xs md:text-sm text-gray-600">Suporte</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold mb-2">7 dias</div>
                  <div className="text-xs md:text-sm text-gray-600">Garantia</div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
