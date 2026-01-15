import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatCurrency, translateProductType } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  type: string;
  image: string;
}

interface ProductSale {
  product: Product;
  sales: number;
  revenue: number;
}

interface TopProductsProps {
  productSales: ProductSale[];
}

export function TopProducts({ productSales }: TopProductsProps) {
  const productsWithSales = productSales.filter(item => item.sales > 0 || item.revenue > 0);

  if (productsWithSales.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Produtos Mais Vendidos</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {productsWithSales.slice(0, 5).map(({ product, sales, revenue }, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 font-bold text-gray-700 text-sm">
                  {index + 1}
                </div>
                <div className="w-12 h-12 bg-accent rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {translateProductType(product.type)}
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="font-bold text-gray-900">{formatCurrency(revenue)}</div>
                <div className="text-xs text-gray-500 mt-1">{sales} vendas</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
