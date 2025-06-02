import { pgTable, text, real, integer, boolean, timestamp, serial, varchar, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  stock: integer('stock').notNull().default(0),
  hsn: varchar('hsn', { length: 20 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull().default('18'),
  cgstRate: decimal('cgst_rate', { precision: 5, scale: 2 }).notNull().default('9'),
  sgstRate: decimal('sgst_rate', { precision: 5, scale: 2 }).notNull().default('9'),
  igstRate: decimal('igst_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  description: text('description'),
  barcode: varchar('barcode', { length: 50 }),
  unit: varchar('unit', { length: 20 }).notNull().default('pcs'),
  minStock: integer('min_stock').notNull().default(5),
  maxStock: integer('max_stock').notNull().default(1000),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  parentId: integer('parent_id').references(() => categories.id),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Customers table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  gstin: varchar('gstin', { length: 15 }),
  panNumber: varchar('pan_number', { length: 10 }),
  dateOfBirth: timestamp('date_of_birth'),
  anniversary: timestamp('anniversary'),
  totalOrders: integer('total_orders').notNull().default(0),
  totalSpent: decimal('total_spent', { precision: 12, scale: 2 }).notNull().default('0'),
  lastOrderDate: timestamp('last_order_date'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Suppliers table
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  gstin: varchar('gstin', { length: 15 }),
  panNumber: varchar('pan_number', { length: 10 }),
  bankName: varchar('bank_name', { length: 255 }),
  bankAccount: varchar('bank_account', { length: 50 }),
  ifscCode: varchar('ifsc_code', { length: 11 }),
  paymentTerms: varchar('payment_terms', { length: 10 }).notNull().default('30'),
  creditLimit: decimal('credit_limit', { precision: 12, scale: 2 }).notNull().default('0'),
  currentBalance: decimal('current_balance', { precision: 12, scale: 2 }).notNull().default('0'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Invoices table
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
  customerId: integer('customer_id').references(() => customers.id),
  date: timestamp('date').notNull().defaultNow(),
  dueDate: timestamp('due_date'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  discount: decimal('discount', { precision: 12, scale: 2 }).notNull().default('0'),
  discountType: varchar('discount_type', { length: 20 }).notNull().default('percentage'),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  cgstAmount: decimal('cgst_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  sgstAmount: decimal('sgst_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  igstAmount: decimal('igst_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  roundOff: decimal('round_off', { precision: 5, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  amountPaid: decimal('amount_paid', { precision: 12, scale: 2 }).notNull().default('0'),
  amountDue: decimal('amount_due', { precision: 12, scale: 2 }).notNull().default('0'),
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().default('pending'),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull().default('cash'),
  notes: text('notes'),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  createdBy: varchar('created_by', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Invoice items table
export const invoiceItems = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 5, scale: 2 }).notNull().default('0'),
  discountType: varchar('discount_type', { length: 20 }).notNull().default('percentage'),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull().default('18'),
  cgstRate: decimal('cgst_rate', { precision: 5, scale: 2 }).notNull().default('9'),
  sgstRate: decimal('sgst_rate', { precision: 5, scale: 2 }).notNull().default('9'),
  igstRate: decimal('igst_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
});

// Purchase orders table
export const purchaseOrders = pgTable('purchase_orders', {
  id: serial('id').primaryKey(),
  poNumber: varchar('po_number', { length: 50 }).notNull().unique(),
  supplierId: integer('supplier_id').notNull().references(() => suppliers.id),
  orderDate: timestamp('order_date').notNull().defaultNow(),
  expectedDate: timestamp('expected_date'),
  receivedDate: timestamp('received_date'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  discount: decimal('discount', { precision: 12, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Purchase order items table
export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: serial('id').primaryKey(),
  purchaseOrderId: integer('purchase_order_id').notNull().references(() => purchaseOrders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull(),
  unitCost: decimal('unit_cost', { precision: 10, scale: 2 }).notNull(),
  receivedQuantity: decimal('received_quantity', { precision: 10, scale: 3 }).notNull().default('0'),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull().default('18'),
  discount: decimal('discount', { precision: 5, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
});

// Payment methods table
export const paymentMethods = pgTable('payment_methods', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  charges: decimal('charges', { precision: 5, scale: 2 }).notNull().default('0'),
  chargeType: varchar('charge_type', { length: 20 }).notNull().default('percentage'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Expenses table
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => expenseCategories.id),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  receiptNumber: varchar('receipt_number', { length: 100 }),
  vendorName: varchar('vendor_name', { length: 255 }),
  date: timestamp('date').notNull().defaultNow(),
  notes: text('notes'),
  attachments: text('attachments'),
  createdBy: varchar('created_by', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Expense categories table
export const expenseCategories = pgTable('expense_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Loyalty program table
export const loyaltyProgram = pgTable('loyalty_program', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  points: integer('points').notNull().default(0),
  totalEarned: integer('total_earned').notNull().default(0),
  totalRedeemed: integer('total_redeemed').notNull().default(0),
  tier: varchar('tier', { length: 20 }).notNull().default('bronze'),
  joinDate: timestamp('join_date').notNull().defaultNow(),
  lastActivity: timestamp('last_activity').notNull().defaultNow(),
});

// Loyalty transactions table
export const loyaltyTransactions = pgTable('loyalty_transactions', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  type: varchar('type', { length: 20 }).notNull(),
  points: integer('points').notNull(),
  referenceId: varchar('reference_id', { length: 50 }),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Promotions table
export const promotions = pgTable('promotions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minPurchase: decimal('min_purchase', { precision: 10, scale: 2 }).notNull().default('0'),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').notNull().default(0),
  applicableProducts: text('applicable_products'),
  applicableCategories: text('applicable_categories'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Staff attendance table
export const staffAttendance = pgTable('staff_attendance', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  date: timestamp('date').notNull(),
  checkIn: timestamp('check_in'),
  checkOut: timestamp('check_out'),
  breakDuration: integer('break_duration').notNull().default(0),
  totalHours: decimal('total_hours', { precision: 5, scale: 2 }).notNull().default('0'),
  overtime: decimal('overtime', { precision: 5, scale: 2 }).notNull().default('0'),
  status: varchar('status', { length: 20 }).notNull().default('present'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Barcode mappings table
export const barcodeMappings = pgTable('barcode_mappings', {
  id: serial('id').primaryKey(),
  barcode: varchar('barcode', { length: 100 }).notNull().unique(),
  productId: integer('product_id').notNull().references(() => products.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Invoice templates table
export const invoiceTemplates = pgTable('invoice_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  template: text('template').notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Inventory transactions table
export const inventoryTransactions = pgTable('inventory_transactions', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  type: varchar('type', { length: 50 }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull(),
  unitCost: decimal('unit_cost', { precision: 10, scale: 2 }),
  referenceId: varchar('reference_id', { length: 50 }),
  referenceType: varchar('reference_type', { length: 50 }),
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Business settings table
export const businessSettings = pgTable('business_settings', {
  id: serial('id').primaryKey(),
  businessName: varchar('business_name', { length: 255 }).notNull(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  gstin: varchar('gstin', { length: 15 }),
  panNumber: varchar('pan_number', { length: 10 }),
  invoicePrefix: varchar('invoice_prefix', { length: 10 }).notNull().default('INV'),
  defaultTaxRate: decimal('default_tax_rate', { precision: 5, scale: 2 }).notNull().default('18'),
  defaultCgstRate: decimal('default_cgst_rate', { precision: 5, scale: 2 }).notNull().default('9'),
  defaultSgstRate: decimal('default_sgst_rate', { precision: 5, scale: 2 }).notNull().default('9'),
  defaultIgstRate: decimal('default_igst_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  currencySymbol: varchar('currency_symbol', { length: 5 }).notNull().default('₹'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Export all schemas for validation
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);

export const insertSupplierSchema = createInsertSchema(suppliers);
export const selectSupplierSchema = createSelectSchema(suppliers);

export const insertInvoiceSchema = createInsertSchema(invoices);
export const selectInvoiceSchema = createSelectSchema(invoices);

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems);
export const selectInvoiceItemSchema = createSelectSchema(invoiceItems);

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders);
export const selectPurchaseOrderSchema = createSelectSchema(purchaseOrders);

export const insertPurchaseOrderItemSchema = createInsertSchema(purchaseOrderItems);
export const selectPurchaseOrderItemSchema = createSelectSchema(purchaseOrderItems);

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods);
export const selectPaymentMethodSchema = createSelectSchema(paymentMethods);

export const insertExpenseSchema = createInsertSchema(expenses);
export const selectExpenseSchema = createSelectSchema(expenses);

export const insertExpenseCategorySchema = createInsertSchema(expenseCategories);
export const selectExpenseCategorySchema = createSelectSchema(expenseCategories);

export const insertLoyaltyProgramSchema = createInsertSchema(loyaltyProgram);
export const selectLoyaltyProgramSchema = createSelectSchema(loyaltyProgram);

export const insertLoyaltyTransactionSchema = createInsertSchema(loyaltyTransactions);
export const selectLoyaltyTransactionSchema = createSelectSchema(loyaltyTransactions);

export const insertPromotionSchema = createInsertSchema(promotions);
export const selectPromotionSchema = createSelectSchema(promotions);

export const insertStaffAttendanceSchema = createInsertSchema(staffAttendance);
export const selectStaffAttendanceSchema = createSelectSchema(staffAttendance);

export const insertBarcodeMappingSchema = createInsertSchema(barcodeMappings);
export const selectBarcodeMappingSchema = createSelectSchema(barcodeMappings);

export const insertInvoiceTemplateSchema = createInsertSchema(invoiceTemplates);
export const selectInvoiceTemplateSchema = createSelectSchema(invoiceTemplates);

export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions);
export const selectInventoryTransactionSchema = createSelectSchema(inventoryTransactions);

export const insertBusinessSettingsSchema = createInsertSchema(businessSettings);
export const selectBusinessSettingsSchema = createSelectSchema(businessSettings);
