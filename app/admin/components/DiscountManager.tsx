import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProductCategory } from '@/types';

interface DiscountConfig {
  type: 'general' | 'category';
  percentage: number;
  category?: ProductCategory;
  isActive: boolean;
}

interface DiscountManagerProps {
  discountConfig: DiscountConfig | null;
  setGeneralDiscount: (percentage: number) => Promise<void>;
  setCategoryDiscount: (category: ProductCategory, percentage: number) => Promise<void>;
  removeDiscount: () => Promise<void>;
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.COPYWRITING]: 'Copywriting',
  [ProductCategory.EMAIL_MARKETING]: 'E-mail Marketing',
  [ProductCategory.SOCIAL_MEDIA]: 'Social Media',
  [ProductCategory.DESIGN]: 'Design',
  [ProductCategory.STRATEGY]: 'Estratégia',
  [ProductCategory.CONTENT]: 'Criação de Conteúdo',
  [ProductCategory.TRAFFIC]: 'Tráfego',
  [ProductCategory.SEO]: 'SEO',
};

export function DiscountManager({
  discountConfig,
  setGeneralDiscount,
  setCategoryDiscount,
  removeDiscount,
}: DiscountManagerProps) {
  const [discountType, setDiscountType] = useState<'general' | 'category'>('general');
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.COPYWRITING);

  const handleActivateDiscount = async () => {
    if (discountType === 'general') {
      await setGeneralDiscount(discountPercentage);
    } else {
      await setCategoryDiscount(selectedCategory, discountPercentage);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Gerenciar Descontos</h2>
            <p className="text-sm text-gray-600">Configure descontos aplicados automaticamente em todo o site</p>
          </div>
          {discountConfig?.isActive && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Desconto Ativo
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {discountConfig?.isActive && (
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-green-900 text-lg">
                      {discountConfig.type === 'general'
                        ? `${discountConfig.percentage}% OFF em todo o site`
                        : `${discountConfig.percentage}% OFF em ${categoryLabels[discountConfig.category!]}`}
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Desconto exibido automaticamente em cards, páginas de produtos e carrinho
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={removeDiscount}
                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium border-2 border-red-200 hover:border-red-300 rounded-lg transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">Tipo de Desconto</label>
            <div className="space-y-3">
              <button
                onClick={() => setDiscountType('general')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  discountType === 'general'
                    ? 'border-black bg-black text-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center mb-2">
                  <svg className={`w-5 h-5 mr-2 ${discountType === 'general' ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <div className="font-semibold">Todo o Site</div>
                </div>
                <div className={`text-sm ${discountType === 'general' ? 'text-white/80' : 'text-gray-600'}`}>
                  Aplica em todos os produtos do catálogo
                </div>
              </button>
              <button
                onClick={() => setDiscountType('category')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  discountType === 'category'
                    ? 'border-black bg-black text-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center mb-2">
                  <svg className={`w-5 h-5 mr-2 ${discountType === 'category' ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div className="font-semibold">Por Categoria</div>
                </div>
                <div className={`text-sm ${discountType === 'category' ? 'text-white/80' : 'text-gray-600'}`}>
                  Aplica em categoria específica
                </div>
              </button>
            </div>
          </div>

          {discountType === 'category' && (
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ProductCategory)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none bg-white"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">Porcentagem</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="90"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none text-2xl font-bold"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                %
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Entre 1% e 90%</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button
            onClick={handleActivateDiscount}
            variant="primary"
            size="lg"
            className="w-full md:w-auto"
          >
            {discountConfig?.isActive ? 'Atualizar Desconto' : 'Ativar Desconto'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
