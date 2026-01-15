import { pgTable, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['FREE', 'CUSTOMER', 'ADMIN']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'PAID', 'CANCELLED']);
export const productTypeEnum = pgEnum('product_type', ['course', 'templates', 'ai_prompts']);

// Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Hash da senha
  role: userRoleEnum('role').notNull().default('FREE'),
  avatar: text('avatar'),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Products Table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(),
  price: integer('price').notNull(), // em centavos
  originalPrice: integer('original_price'),
  type: productTypeEnum('type').notNull(),
  category: text('category').notNull(),
  image: text('image').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  badge: text('badge'), // 'new' | 'popular' | 'best-seller'
  soldCount: integer('sold_count').default(0),
  accessDuration: integer('access_duration').notNull().default(365), // dias
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Orders Table - CRÍTICA para Webhook
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  productId: text('product_id').notNull().references(() => products.id),
  amount: integer('amount').notNull(), // em centavos
  status: orderStatusEnum('status').notNull().default('PENDING'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeCheckoutSessionId: text('stripe_checkout_session_id'),
  purchaseDate: timestamp('purchase_date'),
  expiryDate: timestamp('expiry_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User Assets/Permissions - Tabela de Junção
export const userAssets = pgTable('user_assets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  productId: text('product_id').notNull().references(() => products.id),
  orderId: text('order_id').notNull().references(() => orders.id),
  purchaseDate: timestamp('purchase_date').notNull(),
  expiryDate: timestamp('expiry_date').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Processed Webhooks - Proteção de Idempotência
export const processedWebhooks = pgTable('processed_webhooks', {
  id: text('id').primaryKey(), // session.id ou payment_intent.id
  eventType: text('event_type').notNull(),
  processedAt: timestamp('processed_at').notNull().defaultNow(),
});

// Discounts Table
export const discounts = pgTable('discounts', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // 'general' | 'category'
  percentage: integer('percentage').notNull(), // percentual de desconto (0-100)
  category: text('category'), // categoria se type === 'category'
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Product Modules Table
export const productModules = pgTable('product_modules', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Product Materials Table (vídeos, arquivos, etc)
export const productMaterials = pgTable('product_materials', {
  id: text('id').primaryKey(),
  moduleId: text('module_id').notNull().references(() => productModules.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'video' | 'file'
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url'), // URL do vídeo (Vimeo, YouTube, ou hospedado)
  videoSource: text('video_source'), // 'youtube' | 'vimeo' | 'hosted'
  fileUrl: text('file_url'), // URL do arquivo para download
  fileName: text('file_name'), // Nome original do arquivo
  fileSize: integer('file_size'), // Tamanho em bytes
  thumbnail: text('thumbnail'), // URL da thumbnail
  duration: integer('duration'), // Duração em segundos (para vídeos)
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  userAssets: many(userAssets),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orders: many(orders),
  userAssets: many(userAssets),
  modules: many(productModules),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  userAssets: many(userAssets),
}));

export const userAssetsRelations = relations(userAssets, ({ one }) => ({
  user: one(users, {
    fields: [userAssets.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [userAssets.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [userAssets.orderId],
    references: [orders.id],
  }),
}));

export const productModulesRelations = relations(productModules, ({ one, many }) => ({
  product: one(products, {
    fields: [productModules.productId],
    references: [products.id],
  }),
  materials: many(productMaterials),
}));

export const productMaterialsRelations = relations(productMaterials, ({ one }) => ({
  module: one(productModules, {
    fields: [productMaterials.moduleId],
    references: [productModules.id],
  }),
}));
