import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
}

interface Order {
  id: string;
  productId: string;
  amount: number;
  status: string;
  purchaseDate: Date;
}

interface RecentOrdersProps {
  orders: Order[];
  products: Product[];
}

export function RecentOrders({ orders, products }: RecentOrdersProps) {
  const recentOrders = [...orders]
    .sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime())
    .slice(0, 5);

  if (recentOrders.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pago';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelado';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Vendas Recentes</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentOrders.map((order) => {
            const product = products.find(p => p.id === order.productId);
            return (
              <div
                key={order.id}
                className="p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {product?.name || 'Produto removido'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Pedido #{order.id.slice(0, 8)}...
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 ml-4">
                    {formatCurrency(order.amount)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(order.purchaseDate)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
