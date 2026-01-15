// Tipos de produtos disponíveis
export enum ProductType {
  COURSE = 'course',
  TEMPLATES = 'templates',
  AI_PROMPTS = 'ai_prompts',
}

// Categorias de produtos
export enum ProductCategory {
  COPYWRITING = 'copywriting',
  DESIGN = 'design',
  CONTENT = 'content',
  SOCIAL_MEDIA = 'social_media',
  TRAFFIC = 'traffic',
  SEO = 'seo',
  EMAIL_MARKETING = 'email_marketing',
  STRATEGY = 'strategy',
}

// Status do pedido
export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Nível de acesso do usuário
export enum UserRole {
  FREE = 'free',
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

// Interface do produto
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number; // em centavos (R$ 15,00 = 1500)
  originalPrice?: number; // preço original para mostrar desconto
  type: ProductType;
  category: ProductCategory;
  image: string;
  features?: string[];
  deliverables?: Deliverable[];
  accessDuration: number; // em dias (1 ano = 365)
  badge?: 'new' | 'popular' | 'best-seller';
  soldCount?: number; // número de pessoas que compraram
  highlights?: string[]; // pontos de destaque do produto
  benefits?: string[]; // benefícios principais
  faqs?: ProductFaq[];
  isActive: boolean; // produto ativo/disponível para venda
  createdAt: Date;
  updatedAt: Date;
}

// FAQ específico do produto
export interface ProductFaq {
  question: string;
  answer: string;
}

// Entregáveis do produto
export interface Deliverable {
  id: string;
  name: string;
  type: 'file' | 'video' | 'text' | 'link';
  description?: string;
  url?: string;
  fileSize?: string;
}

// Interface do usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface do pedido
export interface Order {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  amount: number; // em centavos
  status: OrderStatus;
  purchaseDate: Date;
  expiryDate: Date;
}

// Interface de estatísticas do admin
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  topProducts: {
    product: Product;
    sales: number;
    revenue: number;
  }[];
}

// Módulo de produto
export interface ProductModule {
  id: string;
  productId: string;
  title: string;
  description?: string;
  order: number;
  materials?: ProductMaterial[];
  createdAt: Date;
  updatedAt: Date;
}

// Material de módulo
export interface ProductMaterial {
  id: string;
  moduleId: string;
  type: 'video' | 'file';
  title: string;
  description?: string;
  videoUrl?: string;
  videoSource?: 'youtube' | 'vimeo' | 'hosted';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  thumbnail?: string;
  duration?: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

