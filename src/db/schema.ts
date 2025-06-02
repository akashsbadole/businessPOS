import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Products table
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  stock: integer("stock").notNull().default(0),
  hsn: text("hsn").notNull(),
  image: text("image"),
  barcode: text("barcode"),
  description: text("description"),
  costPrice: real("cost_price"),
  sellingPrice: real("selling_price").notNull(),
  taxRate: real("tax_rate").notNull().default(18), // Default GST rate 18%
  cgstRate: real("cgst_rate").notNull().default(9), // Default CGST rate 9%
  sgstRate: real("sgst_rate").notNull().default(9), // Default SGST rate 9%
  igstRate: real("igst_rate").notNull().default(0), // Default IGST rate 0%
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Customers table
export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  gstin: text("gstin"),
  totalOrders: integer("total_orders").notNull().default(0),
  totalSpent: real("total_spent").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Invoices table
export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  customerId: text("customer_id").references(() => customers.id),
  date: integer("date", { mode: "timestamp" }).notNull().default(Date.now()),
  subtotal: real("subtotal").notNull(),
  discount: real("discount").notNull().default(0),
  discountType: text("discount_type").notNull().default("amount"), // 'amount' or 'percentage'
  taxAmount: real("tax_amount").notNull().default(0),
  cgstAmount: real("cgst_amount").notNull().default(0),
  sgstAmount: real("sgst_amount").notNull().default(0),
  igstAmount: real("igst_amount").notNull().default(0),
  roundOff: real("round_off").notNull().default(0),
  total: real("total").notNull(),
  paymentMethod: text("payment_method").notNull().default("cash"),
  paymentStatus: text("payment_status").notNull().default("paid"),
  notes: text("notes"),
  createdBy: text("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Invoice items table
export const invoiceItems = sqliteTable("invoice_items", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoices.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  quantity: real("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  discount: real("discount").notNull().default(0),
  taxRate: real("tax_rate").notNull().default(18),
  cgstRate: real("cgst_rate").notNull().default(9),
  sgstRate: real("sgst_rate").notNull().default(9),
  igstRate: real("igst_rate").notNull().default(0),
  taxAmount: real("tax_amount").notNull().default(0),
  cgstAmount: real("cgst_amount").notNull().default(0),
  sgstAmount: real("sgst_amount").notNull().default(0),
  igstAmount: real("igst_amount").notNull().default(0),
  total: real("total").notNull(),
});

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("cashier"), // admin, manager, cashier, inventory
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// User permissions table
export const userPermissions = sqliteTable(
  "user_permissions",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    permission: text("permission").notNull(), // pos, inventory, customers, reports, settings, users
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(Date.now()),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.permission] }),
    };
  }
);

// Business settings table
export const businessSettings = sqliteTable("business_settings", {
  id: text("id").primaryKey().default("default"),
  businessName: text("business_name").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  phone: text("phone"),
  email: text("email"),
  gstin: text("gstin"),
  panNumber: text("pan_number"),
  logo: text("logo"),
  invoicePrefix: text("invoice_prefix").notNull().default("INV"),
  defaultTaxRate: real("default_tax_rate").notNull().default(18),
  defaultCgstRate: real("default_cgst_rate").notNull().default(9),
  defaultSgstRate: real("default_sgst_rate").notNull().default(9),
  defaultIgstRate: real("default_igst_rate").notNull().default(0),
  currencySymbol: text("currency_symbol").notNull().default("₹"),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Categories table
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentId: text("parent_id").references(() => categories.id),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Suppliers table
export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  gstin: text("gstin"),
  panNumber: text("pan_number"),
  bankName: text("bank_name"),
  bankAccount: text("bank_account"),
  ifscCode: text("ifsc_code"),
  paymentTerms: text("payment_terms").notNull().default("30"), // days
  creditLimit: real("credit_limit").notNull().default(0),
  currentBalance: real("current_balance").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Purchase orders table
export const purchaseOrders = sqliteTable("purchase_orders", {
  id: text("id").primaryKey(),
  poNumber: text("po_number").notNull().unique(),
  supplierId: text("supplier_id")
    .notNull()
    .references(() => suppliers.id),
  orderDate: integer("order_date", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  expectedDate: integer("expected_date", { mode: "timestamp" }),
  receivedDate: integer("received_date", { mode: "timestamp" }),
  status: text("status").notNull().default("pending"), // pending, partial, received, cancelled
  subtotal: real("subtotal").notNull().default(0),
  taxAmount: real("tax_amount").notNull().default(0),
  discount: real("discount").notNull().default(0),
  total: real("total").notNull().default(0),
  notes: text("notes"),
  createdBy: text("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Purchase order items table
export const purchaseOrderItems = sqliteTable("purchase_order_items", {
  id: text("id").primaryKey(),
  purchaseOrderId: text("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  quantity: real("quantity").notNull(),
  unitCost: real("unit_cost").notNull(),
  receivedQuantity: real("received_quantity").notNull().default(0),
  taxRate: real("tax_rate").notNull().default(18),
  discount: real("discount").notNull().default(0),
  total: real("total").notNull(),
});

// Payment methods table
export const paymentMethods = sqliteTable("payment_methods", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // cash, card, upi, bank_transfer, wallet, other
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  charges: real("charges").notNull().default(0), // percentage or fixed amount
  chargeType: text("charge_type").notNull().default("percentage"), // percentage or fixed
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Expenses table
export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").references(() => expenseCategories.id),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  receiptNumber: text("receipt_number"),
  vendorName: text("vendor_name"),
  date: integer("date", { mode: "timestamp" }).notNull().default(Date.now()),
  notes: text("notes"),
  attachments: text("attachments"), // JSON array of file paths
  createdBy: text("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Expense categories table
export const expenseCategories = sqliteTable("expense_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Inventory transactions table
export const inventoryTransactions = sqliteTable("inventory_transactions", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  type: text("type").notNull(), // purchase, sale, return, adjustment, transfer
  quantity: real("quantity").notNull(),
  unitCost: real("unit_cost"),
  referenceId: text("reference_id"), // invoice_id, purchase_order_id, etc.
  referenceType: text("reference_type"), // invoice, purchase_order, adjustment, etc.
  notes: text("notes"),
  createdBy: text("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Loyalty program table
export const loyaltyProgram = sqliteTable("loyalty_program", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  points: integer("points").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  totalRedeemed: integer("total_redeemed").notNull().default(0),
  tier: text("tier").notNull().default("bronze"), // bronze, silver, gold, platinum
  joinDate: integer("join_date", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  lastActivity: integer("last_activity", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Loyalty transactions table
export const loyaltyTransactions = sqliteTable("loyalty_transactions", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  type: text("type").notNull(), // earned, redeemed, expired, adjusted
  points: integer("points").notNull(),
  referenceId: text("reference_id"), // invoice_id for earned points
  description: text("description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Promotions table
export const promotions = sqliteTable("promotions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // percentage, fixed_amount, buy_x_get_y, loyalty_points
  value: real("value").notNull(), // discount percentage or amount
  minPurchase: real("min_purchase").notNull().default(0),
  maxDiscount: real("max_discount"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  usageLimit: integer("usage_limit"), // null for unlimited
  usageCount: integer("usage_count").notNull().default(0),
  applicableProducts: text("applicable_products"), // JSON array of product IDs
  applicableCategories: text("applicable_categories"), // JSON array of category IDs
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Staff attendance table
export const staffAttendance = sqliteTable("staff_attendance", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  checkIn: integer("check_in", { mode: "timestamp" }),
  checkOut: integer("check_out", { mode: "timestamp" }),
  breakDuration: integer("break_duration").notNull().default(0), // in minutes
  totalHours: real("total_hours").notNull().default(0),
  overtime: real("overtime").notNull().default(0),
  status: text("status").notNull().default("present"), // present, absent, half_day, holiday
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Barcode mappings table
export const barcodeMappings = sqliteTable("barcode_mappings", {
  id: text("id").primaryKey(),
  barcode: text("barcode").notNull().unique(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
});

// Invoice templates table
export const invoiceTemplates = sqliteTable("invoice_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  template: text("template").notNull(), // JSON template structure
  isDefault: integer("is_default", { mode: "boolean" })
    .notNull()
    .default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(Date.now()),
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

export const userPermissionsRelations = relations(
  userPermissions,
  ({ one }) => ({
    user: one(users, {
      fields: [userPermissions.userId],
      references: [users.id],
    }),
  })
);

export const inventoryTransactionsRelations = relations(
  inventoryTransactions,
  ({ one }) => ({
    product: one(products, {
      fields: [inventoryTransactions.productId],
      references: [products.id],
    }),
  })
);

// Additional relations for new tables
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  purchaseOrders: many(purchaseOrders),
}));

export const purchaseOrdersRelations = relations(
  purchaseOrders,
  ({ one, many }) => ({
    supplier: one(suppliers, {
      fields: [purchaseOrders.supplierId],
      references: [suppliers.id],
    }),
    items: many(purchaseOrderItems),
  })
);

export const purchaseOrderItemsRelations = relations(
  purchaseOrderItems,
  ({ one }) => ({
    purchaseOrder: one(purchaseOrders, {
      fields: [purchaseOrderItems.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
    product: one(products, {
      fields: [purchaseOrderItems.productId],
      references: [products.id],
    }),
  })
);

export const loyaltyProgramRelations = relations(
  loyaltyProgram,
  ({ one, many }) => ({
    customer: one(customers, {
      fields: [loyaltyProgram.customerId],
      references: [customers.id],
    }),
    transactions: many(loyaltyTransactions),
  })
);

export const loyaltyTransactionsRelations = relations(
  loyaltyTransactions,
  ({ one }) => ({
    customer: one(customers, {
      fields: [loyaltyTransactions.customerId],
      references: [customers.id],
    }),
  })
);

export const expensesRelations = relations(expenses, ({ one }) => ({
  category: one(expenseCategories, {
    fields: [expenses.categoryId],
    references: [expenseCategories.id],
  }),
}));

export const expenseCategoriesRelations = relations(
  expenseCategories,
  ({ many }) => ({
    expenses: many(expenses),
  })
);

export const staffAttendanceRelations = relations(
  staffAttendance,
  ({ one }) => ({
    user: one(users, {
      fields: [staffAttendance.userId],
      references: [users.id],
    }),
  })
);

export const barcodeMappingsRelations = relations(
  barcodeMappings,
  ({ one }) => ({
    product: one(products, {
      fields: [barcodeMappings.productId],
      references: [products.id],
    }),
  })
);

// Zod schemas for validation
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);

export const insertInvoiceSchema = createInsertSchema(invoices);
export const selectInvoiceSchema = createSelectSchema(invoices);

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems);
export const selectInvoiceItemSchema = createSelectSchema(invoiceItems);

export const insertUserSchema = createInsertSchema(users)
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export const selectUserSchema = createSelectSchema(users);

export const insertBusinessSettingsSchema =
  createInsertSchema(businessSettings);
export const selectBusinessSettingsSchema =
  createSelectSchema(businessSettings);

// New table schemas
export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

export const insertSupplierSchema = createInsertSchema(suppliers);
export const selectSupplierSchema = createSelectSchema(suppliers);

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders);
export const selectPurchaseOrderSchema = createSelectSchema(purchaseOrders);

export const insertPurchaseOrderItemSchema =
  createInsertSchema(purchaseOrderItems);
export const selectPurchaseOrderItemSchema =
  createSelectSchema(purchaseOrderItems);

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods);
export const selectPaymentMethodSchema = createSelectSchema(paymentMethods);

export const insertExpenseSchema = createInsertSchema(expenses);
export const selectExpenseSchema = createSelectSchema(expenses);

export const insertExpenseCategorySchema =
  createInsertSchema(expenseCategories);
export const selectExpenseCategorySchema =
  createSelectSchema(expenseCategories);

export const insertLoyaltyProgramSchema = createInsertSchema(loyaltyProgram);
export const selectLoyaltyProgramSchema = createSelectSchema(loyaltyProgram);

export const insertLoyaltyTransactionSchema =
  createInsertSchema(loyaltyTransactions);
export const selectLoyaltyTransactionSchema =
  createSelectSchema(loyaltyTransactions);

export const insertPromotionSchema = createInsertSchema(promotions);
export const selectPromotionSchema = createSelectSchema(promotions);

export const insertStaffAttendanceSchema = createInsertSchema(staffAttendance);
export const selectStaffAttendanceSchema = createSelectSchema(staffAttendance);

export const insertBarcodeMappingSchema = createInsertSchema(barcodeMappings);
export const selectBarcodeMappingSchema = createSelectSchema(barcodeMappings);

export const insertInvoiceTemplateSchema = createInsertSchema(invoiceTemplates);
export const selectInvoiceTemplateSchema = createSelectSchema(invoiceTemplates);

export const insertInventoryTransactionSchema = createInsertSchema(
  inventoryTransactions
);
export const selectInventoryTransactionSchema = createSelectSchema(
  inventoryTransactions
);
