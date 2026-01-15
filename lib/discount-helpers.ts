import { db } from '@/lib/db';
import { discounts, products } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export interface DiscountInfo {
  hasDiscount: boolean;
  discountPercentage: number;
  originalPrice: number;
  finalPrice: number;
  discountId?: string;
}

/**
 * Busca desconto ativo no banco de dados
 */
export async function getActiveDiscount() {
  const activeDiscounts = await db
    .select()
    .from(discounts)
    .where(eq(discounts.isActive, true))
    .limit(1);

  return activeDiscounts[0] || null;
}

/**
 * Calcula o preço final com desconto aplicado
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): number {
  if (discountPercentage <= 0 || discountPercentage > 100) {
    return originalPrice;
  }

  const discountAmount = Math.floor((originalPrice * discountPercentage) / 100);
  return originalPrice - discountAmount;
}

/**
 * Aplica desconto a um produto específico
 */
export async function applyDiscountToProduct(
  productId: string,
  productCategory: string,
  productPrice: number
): Promise<DiscountInfo> {
  const discount = await getActiveDiscount();

  // Sem desconto ativo
  if (!discount) {
    return {
      hasDiscount: false,
      discountPercentage: 0,
      originalPrice: productPrice,
      finalPrice: productPrice,
    };
  }

  // Verificar se o desconto se aplica ao produto
  const appliesToProduct =
    discount.type === 'general' ||
    (discount.type === 'category' && discount.category === productCategory);

  if (!appliesToProduct) {
    return {
      hasDiscount: false,
      discountPercentage: 0,
      originalPrice: productPrice,
      finalPrice: productPrice,
    };
  }

  // Aplicar desconto
  const finalPrice = calculateDiscountedPrice(productPrice, discount.percentage);

  return {
    hasDiscount: true,
    discountPercentage: discount.percentage,
    originalPrice: productPrice,
    finalPrice,
    discountId: discount.id,
  };
}

/**
 * Aplica desconto a múltiplos produtos
 */
export async function applyDiscountToProducts(
  productsList: Array<{ id: string; category: string; price: number }>
): Promise<Map<string, DiscountInfo>> {
  const discount = await getActiveDiscount();
  const results = new Map<string, DiscountInfo>();

  for (const product of productsList) {
    if (!discount) {
      results.set(product.id, {
        hasDiscount: false,
        discountPercentage: 0,
        originalPrice: product.price,
        finalPrice: product.price,
      });
      continue;
    }

    const appliesToProduct =
      discount.type === 'general' ||
      (discount.type === 'category' && discount.category === product.category);

    if (appliesToProduct) {
      const finalPrice = calculateDiscountedPrice(product.price, discount.percentage);
      results.set(product.id, {
        hasDiscount: true,
        discountPercentage: discount.percentage,
        originalPrice: product.price,
        finalPrice,
        discountId: discount.id,
      });
    } else {
      results.set(product.id, {
        hasDiscount: false,
        discountPercentage: 0,
        originalPrice: product.price,
        finalPrice: product.price,
      });
    }
  }

  return results;
}
