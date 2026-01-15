'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { getCurrentUser } from '@/data/mockData';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useDiscount } from '@/contexts/DiscountContext';
import { ProductCategory } from '@/types';
import { AdminStats } from './components/AdminStats';
import { DiscountManager } from './components/DiscountManager';
import { TopProducts } from './components/TopProducts';
import { RecentOrders } from './components/RecentOrders';
import { ProductsTable } from './components/ProductsTable';

interface Product {
  id: string;
  name: string;
  slug: string;
  type: string;
  price: number;
  image: string;
  description: string;
  category: ProductCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  status: string;
  purchaseDate: Date;
}

export default function AdminDashboardPage() {
  const user = getCurrentUser();
  const { discountConfig, setGeneralDiscount, setCategoryDiscount, removeDiscount } = useDiscount();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do banco de dados
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Carregando produtos
        const productsResponse = await fetch('/api/products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Verificar se é admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
          <Link href="/">
            <Button variant="primary">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calcular estatísticas apenas com dados reais
  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map(order => order.userId)).size;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calcular valor total de produtos ativos
  const totalValueAvailable = products
    .filter(product => product.isActive)
    .reduce((sum, product) => sum + product.price, 0);

  // Produtos mais vendidos
  const productSales = products.map(product => {
    const sales = orders.filter(order => order.productId === product.id).length;
    const revenue = orders
      .filter(order => order.productId === product.id)
      .reduce((acc, order) => acc + order.amount, 0);
    return { product, sales, revenue };
  }).sort((a, b) => b.revenue - a.revenue);


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-8">
        <Container>
          {/* Modern Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600">Visão geral completa de vendas, produtos e descontos</p>
              </div>
              <div className="hidden md:flex items-center space-x-3">
                <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500">Última atualização</div>
                  <div className="text-sm font-semibold">Agora mesmo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <AdminStats
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            totalCustomers={totalCustomers}
            averageOrderValue={averageOrderValue}
            totalValueAvailable={totalValueAvailable}
            productsCount={products.length}
          />

          {/* Discount Management */}
          <DiscountManager
            discountConfig={discountConfig}
            setGeneralDiscount={setGeneralDiscount}
            setCategoryDiscount={setCategoryDiscount}
            removeDiscount={removeDiscount}
          />

          {/* Top Products and Recent Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TopProducts productSales={productSales} />
            <RecentOrders orders={orders} products={products} />
          </div>

          {/* All Products Table */}
          <ProductsTable productSales={productSales} />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
