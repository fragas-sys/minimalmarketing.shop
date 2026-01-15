import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, translateProductType } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  isActive: boolean;
}

interface ProductSale {
  product: Product;
  sales: number;
  revenue: number;
}

interface ProductsTableProps {
  productSales: ProductSale[];
}

export function ProductsTable({ productSales }: ProductsTableProps) {
  if (productSales.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4 text-lg">Nenhum produto cadastrado</p>
            <Button variant="primary" size="sm">
              + Criar Primeiro Produto
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Todos os Produtos</h2>
          </div>
          <Button variant="primary" size="sm">
            + Novo Produto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Produto</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Tipo</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">Preço</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">Vendas</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">Receita</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {productSales.map(({ product, sales, revenue }) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-accent rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {translateProductType(product.type)}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-gray-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700">
                    {sales}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-gray-900">
                    {formatCurrency(revenue)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        product.isActive
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link href={`/admin/produto/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
