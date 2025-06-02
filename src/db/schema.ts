import { relations } from 'drizzle-orm';
import { 
  sqliteTable, 
  text, 
  integer, 
  real, 
  primaryKey 
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Products table
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  category: text('category').notNull(),
  stock: integer('stock').notNull().default(0),
  hsn: text('hsn').notNull(),
  image: text('image'),
  barcode: text('barcode'),
  description: text('description'),
  costPrice: real('cost_price'),
  sellingPrice: real('selling_price').notNull(),
  taxRate: real('tax_rate').notNull().default(18), // Default GST rate 18%
  cgstRate: real('cgst_rate').notNull().default(9), // Default CGST rate 9%
  sgstRate: real('sgst_rate').notNull().default(9), // Default SGST rate 9%
  igstRate: real('igst_rate').notNull().default(0), // Default IGST rate 0%
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(Date.now()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(Date.now()),
});

// Customers table
export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  gstin: text('gstin'),
  totalOrders: integer('total_orders').notNull().default(0),
  totalSpent: real('total_spent').notNull().default(0),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(Date.now()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(Date.now()),
});

// Invoices table
export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  customerId: text('customer_id').references(() => customers.id),
  date: integer('date', { mode: 'timestamp' }).notNull().default(Date.now()),
  subtotal: real('subtotal').notNull(),
  discount: real('discount').notNull().default(0),
  discountType: text('discount_type').notNull().default('amount'), // 'amount' or 'percentage'
  taxAmount: real('tax_amount').notNull().default(0),
  cgstAmount: real('cgst_amount').notNull().default(0),
  sgstAmount: real('sgst_amount').notNull().default(0),
  igstAmount: real('igst_amount').notNull().default(0),
  roundOff: real('round_off').notNull().default(0),
  total: real('total').notNull(),
  paymentMethod: text('payment_method').notNull().default('cash'),
  paymentStatus: text('payment_status').notNull().default('paid'),
  notes: text('notes'),
  createdBy: text('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(Date.now()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(Date.now()),
});

// Invoice items table
export const invoiceItems = sqliteTable('invoice_items', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull().references(() => invoices.id),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: real('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
  discount: real('discount').notNull().default(0),
  taxRate: real('tax_rate').notNull().default(18),
  cgstRate: real('cgst_rate').notNull().default(9),
  sgstRate: real('sgst_rate').notNull().default(9),
  igstRate: real('igst_rate').notNull().default(0),
  taxAmount: real('tax_amount').notNull().default(0),
  cgstAmount: real('cgst_amount').notNull().default(0),
  sgstAmount: real('sgst_amount').notNull().default(0),
  igstAmount: real('igst_amount').notNull().default(0),
  total: real('total').notNull(),
});

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('cashier'), // admin, manager, cashier, inventory
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(Date.now()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(Date.now()),
});

// User permissions table
export const userPermissions = sqliteTable('user_permissions', {
  userId: text('user_id').notNull().references(() => users.id),
  permission: text('permission').notNull(), // pos, inventory, customers, reports, settings, users
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(Date.now()),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.permission] }),
  };
});

// Business settings table
export const businessSettings = sqliteTable('business_settings', {
  id: text('id').primaryKey().default('default'),
  businessName: text('business_name').notNull(),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  phone: text('phone'),
  email: text('email'),
  gstin: text('gstin'),
  panNumber: text('pan_number'),
  logo: text('logo'),
  invoicePrefix: text('invoice_prefix').notNull().default('INV'),
  defaultTaxRate: real('default_tax_rate').notNull().default(18),
  defaultCgstRate: real('default_cgst_rate').notNull().default(9),
  defaultSgstRate: real('default_sgst_rate').notNull().default(9),
  defaultIgstRate: real('default_igst_rate').notNull().default(0),
  currencySymbol: text('currency_symbol').notNull().default('₹'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(Date.now()),
});

// Inventory transactions table
export const inventoryTransactions = sqliteTable('inventory_transactions', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id),
  type: text('type').notNull(), // purchase, sale, return, adjustment
  quantity: real('quantity').notNull(),
  referenceId: text('reference_id'), // invoice_id or purchase_id
  notes: text('notes'),
  createdBy: text('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(Date.now()),
});

// Define relations
export const productsRelations = relations(products, ({ many }) => ({
  invoiceItems: many(invoiceItems),
  inventoryTransactions: many(inventoryTransactions),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  items: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, {
    fields: [invoiceItems.productId],
    references: [products.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  permissions: many(userPermissions),
}));

export const userPermissionsRelations = relations(userPermissions, ({ one }) => ({
  user: one(users, {
    fields: [userPermissions.userId],
    references: [users.id],
  }),
}));

export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ one }) => ({
  product: one(products, {
    fields: [inventoryTransactions.productId],
    references: [products.id],
  }),
}));

// Zod schemas for validation
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);

export const insertInvoiceSchema = createInsertSchema(invoices);
export const selectInvoiceSchema = createSelectSchema(invoices);

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems);
export const selectInvoiceItemSchema = createSelectSchema(invoiceItems);

export const insertUserSchema = createInsertSchema(users).extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
export const selectUserSchema = createSelectSchema(users);

export const insertBusinessSettingsSchema = createInsertSchema(businessSettings);
export const selectBusinessSettingsSchema = createSelectSchema(businessSettings);
