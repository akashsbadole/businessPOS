import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Categories table
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Suppliers table
export const suppliers = sqliteTable('suppliers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  gstin: text('gstin'),
  paymentTerms: text('payment_terms').default('Net 30'),
  creditLimit: real('credit_limit').default(0),
  currentBalance: real('current_balance').default(0),
  status: text('status', { enum: ['active', 'inactive'] }).default('active'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Products table
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  price: real('price').notNull(),
  cost: real('cost').default(0),
  stock: integer('stock').default(0),
  minStock: integer('min_stock').default(0),
  maxStock: integer('max_stock').default(100),
  unit: text('unit').default('pcs'),
  hsn: text('hsn'),
  barcode: text('barcode'),
  taxRate: real('tax_rate').default(18),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Customers table
export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  gstin: text('gstin'),
  totalOrders: integer('total_orders').default(0),
  totalSpent: real('total_spent').default(0),
  status: text('status', { enum: ['active', 'inactive'] }).default('active'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Transactions table
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  date: text('date').notNull(),
  customer: text('customer').notNull(),
  items: text('items', { mode: 'json' }).notNull(), // JSON array of cart items
  subtotal: real('subtotal').notNull(),
  discount: real('discount').default(0),
  taxAmount: real('tax_amount').default(0),
  amount: real('amount').notNull(),
  amountReceived: real('amount_received').default(0),
  change: real('change').default(0),
  paymentMethod: text('payment_method', { 
    enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Cheque'] 
  }).notNull(),
  status: text('status', { 
    enum: ['completed', 'pending', 'cancelled'] 
  }).default('completed'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Invoice items table (for detailed tracking)
export const invoiceItems = sqliteTable('invoice_items', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull(),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  total: real('total').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Store settings table
export const storeSettings = sqliteTable('store_settings', {
  id: text('id').primaryKey(),
  storeName: text('store_name').notNull(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  gstin: text('gstin'),
  logo: blob('logo'),
  taxRate: real('tax_rate').default(18),
  currency: text('currency').default('INR'),
  invoicePrefix: text('invoice_prefix').default('INV'),
  invoiceCounter: integer('invoice_counter').default(1),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Export all tables for use in queries
export const schema = {
  categories,
  suppliers,
  products,
  customers,
  transactions,
  invoiceItems,
  storeSettings,
};
