'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate, daysRemaining, isAccessValid } from '@/lib/utils';
import Link from 'next/link';

export default function MyAccountPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/entrar?redirect=/minha-conta');
    }
  }, [loading, isAuthenticated, router]);

  // Carregar dados do usuário após autenticação confirmada
  useEffect(() => {
    const loadUserData = async () => {
      if (!user || !isAuthenticated) {
        return;
      }

      setIsLoadingData(true);
      try {
        // Buscar pedidos reais do banco de dados
        const ordersResponse = await fetch(`/api/orders/user?userId=${user.id}`);
        if (ordersResponse.ok) {
          const userOrders = await ordersResponse.json();
          setOrders(userOrders);

          // Se não tiver pedidos, obter produtos recomendados
          if (userOrders.length === 0) {
            const productsResponse = await fetch('/api/products');
            if (productsResponse.ok) {
              const allProducts = await productsResponse.json();
              const recommendedIds = allProducts
                .filter((p: any) => p.badge === 'popular' || p.badge === 'best-seller')
                .slice(0, 4);
              setRecommendedProducts(recommendedIds);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadUserData();
  }, [user, isAuthenticated]);

  // Aguardando verificação de autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-100 rounded w-24 mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Se não estiver autenticado, a página será redirecionada pelo useEffect
  // mas mantemos esse check como fallback
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 md:py-12 px-4 sm:px-0">
        <Container>
          {/* Page Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Minha Conta</h1>
            <p className="text-gray-600 text-sm md:text-base">Gerencie suas compras e acessos</p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 md:mb-10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-semibold mb-1">{user?.name || 'Usuário'}</h2>
                  <p className="text-gray-600 text-sm md:text-base break-all">{user?.email || 'email@example.com'}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card>
              <CardContent className="py-6 md:py-8">
                <div className="text-3xl md:text-4xl font-bold mb-2">{orders.length}</div>
                <div className="text-sm text-gray-600">Produtos Comprados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6 md:py-8">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {formatCurrency(orders.reduce((acc, order) => acc + order.amount, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Investido</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6 md:py-8">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {orders.filter(order => isAccessValid(order.expiryDate)).length}
                </div>
                <div className="text-sm text-gray-600">Acessos Ativos</div>
              </CardContent>
            </Card>
          </div>

          {/* My Purchases or Products Section */}
          {orders.length === 0 ? (
            <>
              <div className="mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Minhas Compras</h2>
                <Card>
                  <CardContent className="py-12 md:py-16 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm md:text-base">Você ainda não comprou nenhum produto</p>
                    <Link href="/">
                      <Button variant="primary">Explorar Produtos</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Recommended Products */}
              {recommendedProducts.length > 0 && (
                <div className="mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Produtos Recomendados</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {recommendedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Minhas Compras</h2>
              <div className="space-y-4 md:space-y-6">
                {orders.map((order) => {
                  const isActive = isAccessValid(order.expiryDate);
                  const remainingDays = daysRemaining(order.expiryDate);

                  return (
                    <Card key={order.id} hover>
                      <div className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                          {/* Product Info */}
                          <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-accent rounded-xl overflow-hidden flex-shrink-0">
                              <img
                                src={order.product.image}
                                alt={order.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base md:text-lg font-semibold mb-1 truncate">
                                {order.product.name}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-600 mb-3">
                                Comprado em {formatDate(order.purchaseDate)}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {isActive ? (
                                  <>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Ativo
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {remainingDays} dias restantes
                                    </span>
                                  </>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Expirado
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Link href={`/minha-conta/produto/${order.productId}`} className="w-full">
                              <Button
                                variant={isActive ? 'primary' : 'outline'}
                                className="w-full"
                                disabled={!isActive}
                              >
                                {isActive ? 'Acessar Conteúdo' : 'Ver Detalhes'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
