import React, { memo } from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface CartSummaryProps {
  totalOriginal: number;
  totalWithDiscount: number;
  totalSavings: number;
  hasDiscount: boolean;
  discountConfig: any;
  isLoading: boolean;
  onCheckout: () => void;
  onClearCart: () => void;
}

export const CartSummary = memo(({
  totalOriginal,
  totalWithDiscount,
  totalSavings,
  hasDiscount,
  discountConfig,
  isLoading,
  onCheckout,
  onClearCart
}: CartSummaryProps) => (
  <div className="lg:col-span-1">
    <div className="sticky top-24">
      <div className="bg-accent rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">Resumo</h2>

        {discountConfig?.isActive && (
          <div className="mb-6 p-3 bg-success-light border border-success/20 rounded-xl">
            <div className="flex items-center gap-2 text-success text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Desconto de {discountConfig.percentage}% aplicado!</span>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{formatCurrency(totalOriginal)}</span>
          </div>
          {hasDiscount && (
            <div className="flex justify-between text-sm">
              <span className="text-success font-semibold">Desconto</span>
              <span className="text-success font-semibold">-{formatCurrency(totalSavings)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Acesso</span>
            <span className="font-semibold">1 ano</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-3xl font-bold">{formatCurrency(totalWithDiscount)}</span>
          </div>
          {hasDiscount && (
            <div className="text-right">
              <div className="inline-block bg-success text-white px-3 py-1 rounded-full text-xs font-bold">
                Você economiza {formatCurrency(totalSavings)}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full mb-3"
          onClick={onCheckout}
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : 'Finalizar Compra'}
        </Button>

        <button
          onClick={onClearCart}
          className="w-full text-sm text-gray-600 hover:text-danger transition-colors"
        >
          Limpar carrinho
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Pagamento 100% seguro via Stripe</span>
          </div>
        </div>
      </div>
    </div>
  </div>
));

CartSummary.displayName = 'CartSummary';
