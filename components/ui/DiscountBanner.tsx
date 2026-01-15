'use client';

import React from 'react';
import { useDiscount } from '@/contexts/DiscountContext';
import { translateCategory } from '@/lib/utils';

export function DiscountBanner() {
  const { discountConfig, isDiscountActive } = useDiscount();

  // Não mostrar se não houver desconto ativo
  if (!isDiscountActive || !discountConfig) {
    return null;
  }

  const isGeneral = discountConfig.type === 'general';
  const message = isGeneral
    ? `🎉 ${discountConfig.percentage}% de desconto em TODOS os produtos!`
    : `🎉 ${discountConfig.percentage}% de desconto em ${translateCategory(discountConfig.category!)}!`;

  return (
    <div className="bg-black text-white py-3 px-4 text-center font-medium text-sm sticky top-0 z-[60]">
      {message}
    </div>
  );
}
