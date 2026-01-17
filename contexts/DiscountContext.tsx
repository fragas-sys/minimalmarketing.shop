'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo,
  ReactNode 
} from 'react';
import { Product, ProductCategory } from '@/types';

interface DiscountConfig {
  type: 'general' | 'category';
  percentage: number;
  category?: ProductCategory;
  isActive: boolean;
}

interface ProductPriceInfo {
  finalPrice: number;
  originalPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
}

interface DiscountContextType {
  discountConfig: DiscountConfig | null;
  setGeneralDiscount: (percentage: number) => Promise<void>;
  setCategoryDiscount: (category: ProductCategory, percentage: number) => Promise<void>;
  removeDiscount: () => Promise<void>;
  getProductPrice: (product: Product) => ProductPriceInfo;
  isDiscountActive: boolean;
  isHydrated: boolean;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export function DiscountProvider({ children }: { children: ReactNode }) {
  const [discountConfig, setDiscountConfig] = useState<DiscountConfig | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carregar desconto do banco de dados na montagem
  useEffect(() => {
    const hydrationTimer = requestAnimationFrame(async () => {
      try {
        const response = await fetch('/api/discounts/get');
        const data = await response.json();
        
        if (data && data.type && data.percentage !== undefined) {
          setDiscountConfig({
            type: data.type,
            percentage: data.percentage,
            category: data.category,
            isActive: data.isActive,
          });
        }
      } catch (error) {
        console.warn('Falha ao carregar desconto:', error);
      } finally {
        setIsHydrated(true);
      }
    });

    return () => cancelAnimationFrame(hydrationTimer);
  }, []);

  // Salvar desconto no banco de dados
  useEffect(() => {
    if (!isHydrated) return;

    const saveTimer = setTimeout(async () => {
      try {
        if (discountConfig && discountConfig.isActive) {
          await fetch('/api/discounts/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: discountConfig.type,
              percentage: discountConfig.percentage,
              category: discountConfig.category,
            }),
          });
        }
      } catch (error) {
        console.warn('Falha ao salvar desconto:', error);
      }
    }, 300);

    return () => clearTimeout(saveTimer);
  }, [discountConfig, isHydrated]);

  const setGeneralDiscount = useCallback(async (percentage: number) => {
    const newConfig: DiscountConfig = {
      type: 'general',
      percentage,
      isActive: true,
    };
    setDiscountConfig(newConfig);
  }, []);

  const setCategoryDiscount = useCallback(async (category: ProductCategory, percentage: number) => {
    const newConfig: DiscountConfig = {
      type: 'category',
      percentage,
      category,
      isActive: true,
    };
    setDiscountConfig(newConfig);
  }, []);

  const removeDiscount = useCallback(async () => {
    try {
      await fetch('/api/discounts/remove', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Falha ao remover desconto:', error);
    }
    setDiscountConfig(null);
  }, []);

  // getProductPrice com memoização
  const getProductPrice = useCallback((product: Product): ProductPriceInfo => {
    // Se sem desconto ou inativo
    if (!discountConfig || !discountConfig.isActive) {
      return {
        finalPrice: product.price,
        originalPrice: product.price,
        hasDiscount: false,
        discountPercentage: 0,
      };
    }

    // Verificar se desconto se aplica
    const discountApplies =
      discountConfig.type === 'general' ||
      (discountConfig.type === 'category' && discountConfig.category === product.category);

    if (!discountApplies) {
      return {
        finalPrice: product.price,
        originalPrice: product.price,
        hasDiscount: false,
        discountPercentage: 0,
      };
    }

    // Calcular preço com desconto
    const discountAmount = (product.price * discountConfig.percentage) / 100;
    const finalPrice = product.price - discountAmount;

    return {
      finalPrice: Math.round(finalPrice * 100) / 100,
      originalPrice: product.price,
      hasDiscount: true,
      discountPercentage: discountConfig.percentage,
    };
  }, [discountConfig]);

  const isDiscountActive = useMemo(
    () => discountConfig !== null && discountConfig.isActive,
    [discountConfig]
  );

  const value: DiscountContextType = {
    discountConfig,
    setGeneralDiscount,
    setCategoryDiscount,
    removeDiscount,
    getProductPrice,
    isDiscountActive,
    isHydrated,
  };

  return (
    <DiscountContext.Provider value={value}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
}
