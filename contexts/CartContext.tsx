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
import { Product, ProductType, ProductCategory } from '@/types';
import { mockProducts } from '@/data/mockData';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => boolean;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSuggestedProducts: () => Product[];
  itemCount: number;
  isHydrated: boolean;
  ownedProductIds: Set<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'cart_items_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [ownedProductIds, setOwnedProductIds] = useState<Set<string>>(new Set());

  // Buscar produtos que o usuário já possui
  useEffect(() => {
    async function fetchOwnedProducts() {
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
        // Se falhar (ex: usuário não autenticado), manter set vazio
        setOwnedProductIds(new Set());
      }
    }

    fetchOwnedProducts();
  }, []);

  // Carregar carrinho do localStorage (apenas na primeira montagem)
  useEffect(() => {
    const hydrationTimer = requestAnimationFrame(() => {
      try {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed) && parsed.length >= 0) {
            // Filtrar produtos já possuídos ao carregar do localStorage
            const filteredCart = parsed.filter(
              (item: CartItem) => !ownedProductIds.has(item.product.id)
            );
            setItems(filteredCart);
          }
        }
      } catch (error) {
        console.warn('Falha ao carregar carrinho do localStorage:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsHydrated(true);
      }
    });

    return () => cancelAnimationFrame(hydrationTimer);
  }, [ownedProductIds]);

  // Salvar carrinho no localStorage (debounced)
  useEffect(() => {
    if (!isHydrated) return;

    const saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.warn('Falha ao salvar carrinho:', error);
      }
    }, 300);

    return () => clearTimeout(saveTimer);
  }, [items, isHydrated]);

  const addToCart = useCallback((product: Product): boolean => {
    // Verificar se o usuário já possui o produto
    if (ownedProductIds.has(product.id)) {
      console.warn('Produto já possuído pelo usuário:', product.id);
      return false;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems;
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    return true;
  }, [ownedProductIds]);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => items.length, [items]);

  const getSuggestedProducts = useCallback((): Product[] => {
    if (items.length === 0) {
      return mockProducts
        .filter((p) => p.badge === 'best-seller' || p.badge === 'popular')
        .slice(0, 3);
    }

    const cartProductIds = items.map((item) => item.product.id);
    const cartTypes = items.map((item) => item.product.type);
    const cartCategories = items.map((item) => item.product.category);

    const availableProducts = mockProducts.filter(
      (p) => !cartProductIds.includes(p.id)
    );

    const scoredProducts = availableProducts.map((product) => {
      let score = 0;

      if (cartCategories.includes(product.category)) {
        score += 3;
      }

      if (cartTypes.includes(ProductType.COURSE)) {
        if (
          product.type === ProductType.TEMPLATES ||
          product.type === ProductType.AI_PROMPTS
        ) {
          score += 2;
        }
      }
      if (cartTypes.includes(ProductType.TEMPLATES)) {
        if (
          product.type === ProductType.AI_PROMPTS ||
          product.type === ProductType.COURSE
        ) {
          score += 2;
        }
      }
      if (cartTypes.includes(ProductType.AI_PROMPTS)) {
        if (
          product.type === ProductType.TEMPLATES ||
          product.type === ProductType.COURSE
        ) {
          score += 2;
        }
      }

      if (product.badge === 'best-seller' || product.badge === 'popular') {
        score += 2;
      }

      const avgCartPrice =
        items.reduce((sum, item) => sum + item.product.price, 0) / items.length;
      if (Math.abs(product.price - avgCartPrice) < 2000) {
        score += 1;
      }

      if (cartCategories.includes(ProductCategory.COPYWRITING)) {
        if (
          product.category === ProductCategory.EMAIL_MARKETING ||
          (product.category === ProductCategory.COPYWRITING &&
            product.type === ProductType.AI_PROMPTS)
        ) {
          score += 2;
        }
      }

      if (cartCategories.includes(ProductCategory.SOCIAL_MEDIA)) {
        if (
          product.category === ProductCategory.DESIGN ||
          product.type === ProductType.TEMPLATES
        ) {
          score += 2;
        }
      }

      if (cartCategories.includes(ProductCategory.STRATEGY)) {
        if (
          product.type === ProductType.TEMPLATES ||
          product.type === ProductType.AI_PROMPTS
        ) {
          score += 2;
        }
      }

      return { product, score };
    });

    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.product);
  }, [items]);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getTotal,
    getSuggestedProducts,
    itemCount,
    isHydrated,
    ownedProductIds,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
