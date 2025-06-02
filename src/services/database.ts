import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  eq,
  desc,
  asc,
  like,
  and,
  or,
  gte,
  lte,
  count,
  sum,
} from "drizzle-orm";
import * as schema from "../db/schema";
import {
  Product,
  Customer,
  Category,
  Supplier,
  PurchaseOrder,
  PurchaseOrderItem,
  PaymentMethod,
  Expense,
  ExpenseCategory,
  LoyaltyProgram,
  LoyaltyTransaction,
  Promotion,
  StaffAttendance,
  BarcodeMapping,
  InvoiceTemplate,
  InventoryTransaction,
  Transaction,
  DashboardStats,
} from "../types/pos";

// Database connection
let db: ReturnType<typeof drizzle>;

export const initializeDatabase = () => {
  const sqlite = new Database("pos.db");
  db = drizzle(sqlite, { schema });
  return db;
};

// Utility function to generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Product Services
export class ProductService {
  static async getAll(): Promise<Product[]> {
    return await db
      .select()
      .from(schema.products)
      .orderBy(asc(schema.products.name));
  }

  static async getById(id: string): Promise<Product | null> {
    const result = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, id));
    return result[0] || null;
  }

  static async getByCategory(category: string): Promise<Product[]> {
    return await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.category, category))
      .orderBy(asc(schema.products.name));
  }

  static async search(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(schema.products)
      .where(
        or(
          like(schema.products.name, `%${query}%`),
          like(schema.products.barcode, `%${query}%`),
          like(schema.products.hsn, `%${query}%`)
        )
      )
      .orderBy(asc(schema.products.name));
  }

  static async create(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const newProduct = {
      ...product,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.insert(schema.products).values(newProduct);
    return newProduct as Product;
  }

  static async update(
    id: string,
    updates: Partial<Product>
  ): Promise<Product | null> {
    const updatedData = {
      ...updates,
      updatedAt: Date.now(),
    };

    await db
      .update(schema.products)
      .set(updatedData)
      .where(eq(schema.products.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.products)
      .where(eq(schema.products.id, id));
    return result.changes > 0;
  }

  static async getLowStock(threshold: number = 10): Promise<Product[]> {
    return await db
      .select()
      .from(schema.products)
      .where(lte(schema.products.stock, threshold))
      .orderBy(asc(schema.products.stock));
  }

  static async updateStock(
    id: string,
    quantity: number,
    operation: "add" | "subtract"
  ): Promise<boolean> {
    const product = await this.getById(id);
    if (!product) return false;

    const newStock =
      operation === "add" ? product.stock + quantity : product.stock - quantity;

    if (newStock < 0) return false;

    await this.update(id, { stock: newStock });
    return true;
  }
}

// Customer Services
export class CustomerService {
  static async getAll(): Promise<Customer[]> {
    return await db
      .select()
      .from(schema.customers)
      .orderBy(asc(schema.customers.name));
  }

  static async getById(id: string): Promise<Customer | null> {
    const result = await db
      .select()
      .from(schema.customers)
      .where(eq(schema.customers.id, id));
    return result[0] || null;
  }

  static async getByPhone(phone: string): Promise<Customer | null> {
    const result = await db
      .select()
      .from(schema.customers)
      .where(eq(schema.customers.phone, phone));
    return result[0] || null;
  }

  static async search(query: string): Promise<Customer[]> {
    return await db
      .select()
      .from(schema.customers)
      .where(
        or(
          like(schema.customers.name, `%${query}%`),
          like(schema.customers.phone, `%${query}%`),
          like(schema.customers.email, `%${query}%`)
        )
      )
      .orderBy(asc(schema.customers.name));
  }

  static async create(
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer> {
    const newCustomer = {
      ...customer,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.insert(schema.customers).values(newCustomer);
    return newCustomer as Customer;
  }

  static async update(
    id: string,
    updates: Partial<Customer>
  ): Promise<Customer | null> {
    const updatedData = {
      ...updates,
      updatedAt: Date.now(),
    };

    await db
      .update(schema.customers)
      .set(updatedData)
      .where(eq(schema.customers.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.customers)
      .where(eq(schema.customers.id, id));
    return result.changes > 0;
  }

  static async updateStats(
    customerId: string,
    orderAmount: number
  ): Promise<void> {
    const customer = await this.getById(customerId);
    if (!customer) return;

    await this.update(customerId, {
      totalOrders: customer.totalOrders + 1,
      totalSpent: customer.totalSpent + orderAmount,
    });
  }
}

// Category Services
export class CategoryService {
  static async getAll(): Promise<Category[]> {
    return await db
      .select()
      .from(schema.categories)
      .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.name));
  }

  static async getById(id: string): Promise<Category | null> {
    const result = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id));
    return result[0] || null;
  }

  static async getActive(): Promise<Category[]> {
    return await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.isActive, true))
      .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.name));
  }

  static async create(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    const newCategory = {
      ...category,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.insert(schema.categories).values(newCategory);
    return newCategory as Category;
  }

  static async update(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
    const updatedData = {
      ...updates,
      updatedAt: Date.now(),
    };

    await db
      .update(schema.categories)
      .set(updatedData)
      .where(eq(schema.categories.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, id));
    return result.changes > 0;
  }
}

// Supplier Services
export class SupplierService {
  static async getAll(): Promise<Supplier[]> {
    return await db
      .select()
      .from(schema.suppliers)
      .orderBy(asc(schema.suppliers.name));
  }

  static async getById(id: string): Promise<Supplier | null> {
    const result = await db
      .select()
      .from(schema.suppliers)
      .where(eq(schema.suppliers.id, id));
    return result[0] || null;
  }

  static async getActive(): Promise<Supplier[]> {
    return await db
      .select()
      .from(schema.suppliers)
      .where(eq(schema.suppliers.status, "active"))
      .orderBy(asc(schema.suppliers.name));
  }

  static async search(query: string): Promise<Supplier[]> {
    return await db
      .select()
      .from(schema.suppliers)
      .where(
        or(
          like(schema.suppliers.name, `%${query}%`),
          like(schema.suppliers.phone, `%${query}%`),
          like(schema.suppliers.email, `%${query}%`)
        )
      )
      .orderBy(asc(schema.suppliers.name));
  }

  static async create(
    supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">
  ): Promise<Supplier> {
    const newSupplier = {
      ...supplier,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.insert(schema.suppliers).values(newSupplier);
    return newSupplier as Supplier;
  }

  static async update(
    id: string,
    updates: Partial<Supplier>
  ): Promise<Supplier | null> {
    const updatedData = {
      ...updates,
      updatedAt: Date.now(),
    };

    await db
      .update(schema.suppliers)
      .set(updatedData)
      .where(eq(schema.suppliers.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.suppliers)
      .where(eq(schema.suppliers.id, id));
    return result.changes > 0;
  }
}

// Invoice Services
export class InvoiceService {
  static async getAll(): Promise<Transaction[]> {
    return await db
      .select()
      .from(schema.invoices)
      .orderBy(desc(schema.invoices.createdAt));
  }

  static async getById(id: string): Promise<Transaction | null> {
    const result = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.id, id));
    return result[0] || null;
  }

  static async getByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return await db
      .select()
      .from(schema.invoices)
      .where(
        and(
          gte(schema.invoices.date, startDate.getTime()),
          lte(schema.invoices.date, endDate.getTime())
        )
      )
      .orderBy(desc(schema.invoices.date));
  }

  static async create(
    invoice: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ): Promise<Transaction> {
    const newInvoice = {
      ...invoice,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.insert(schema.invoices).values(newInvoice);
    return newInvoice as Transaction;
  }

  static async createWithItems(
    invoice: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
    items: Array<Omit<any, "id" | "invoiceId">>
  ): Promise<Transaction> {
    const invoiceId = generateId();
    const newInvoice = {
      ...invoice,
      id: invoiceId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Insert invoice
    await db.insert(schema.invoices).values(newInvoice);

    // Insert invoice items
    const invoiceItems = items.map((item) => ({
      ...item,
      id: generateId(),
      invoiceId,
    }));

    if (invoiceItems.length > 0) {
      await db.insert(schema.invoiceItems).values(invoiceItems);
    }

    // Update product stock
    for (const item of items) {
      await ProductService.updateStock(
        item.productId,
        item.quantity,
        "subtract"
      );
    }

    // Update customer stats if customer exists
    if (invoice.customerId) {
      await CustomerService.updateStats(invoice.customerId, invoice.total);
    }

    return newInvoice as Transaction;
  }

  static async getTodaysSales(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await db
      .select({ total: sum(schema.invoices.total) })
      .from(schema.invoices)
      .where(
        and(
          gte(schema.invoices.date, today.getTime()),
          lte(schema.invoices.date, tomorrow.getTime())
        )
      );

    return result[0]?.total || 0;
  }

  static async getTodaysTransactionCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await db
      .select({ count: count() })
      .from(schema.invoices)
      .where(
        and(
          gte(schema.invoices.date, today.getTime()),
          lte(schema.invoices.date, tomorrow.getTime())
        )
      );

    return result[0]?.count || 0;
  }
}

// Expense Services
export class ExpenseService {
  static async getAll(): Promise<Expense[]> {
    return await db
      .select()
      .from(schema.expenses)
      .orderBy(desc(schema.expenses.date));
  }

  static async getById(id: string): Promise<Expense | null> {
    const result = await db
      .select()
      .from(schema.expenses)
      .where(eq(schema.expenses.id, id));
    return result[0] || null;
  }

  static async getByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Expense[]> {
    return await db
      .select()
      .from(schema.expenses)
      .where(
        and(
          gte(schema.expenses.date, startDate.getTime()),
          lte(schema.expenses.date, endDate.getTime())
        )
      )
      .orderBy(desc(schema.expenses.date));
  }

  static async create(
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ): Promise<Expense> {
    const newExpense = {
      ...expense,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.insert(schema.expenses).values(newExpense);
    return newExpense as Expense;
  }

  static async update(
    id: string,
    updates: Partial<Expense>
  ): Promise<Expense | null> {
    const updatedData = {
      ...updates,
      updatedAt: Date.now(),
    };

    await db
      .update(schema.expenses)
      .set(updatedData)
      .where(eq(schema.expenses.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.expenses)
      .where(eq(schema.expenses.id, id));
    return result.changes > 0;
  }
}

// Loyalty Program Services
export class LoyaltyService {
  static async getByCustomerId(
    customerId: string
  ): Promise<LoyaltyProgram | null> {
    const result = await db
      .select()
      .from(schema.loyaltyProgram)
      .where(eq(schema.loyaltyProgram.customerId, customerId));
    return result[0] || null;
  }

  static async createOrUpdate(
    customerId: string,
    points: number
  ): Promise<LoyaltyProgram> {
    const existing = await this.getByCustomerId(customerId);

    if (existing) {
      const updatedData = {
        points: existing.points + points,
        totalEarned: existing.totalEarned + (points > 0 ? points : 0),
        totalRedeemed:
          existing.totalRedeemed + (points < 0 ? Math.abs(points) : 0),
        lastActivity: Date.now(),
      };

      await db
        .update(schema.loyaltyProgram)
        .set(updatedData)
        .where(eq(schema.loyaltyProgram.customerId, customerId));

      return { ...existing, ...updatedData } as LoyaltyProgram;
    } else {
      const newProgram = {
        id: generateId(),
        customerId,
        points: Math.max(0, points),
        totalEarned: Math.max(0, points),
        totalRedeemed: 0,
        tier: "bronze" as const,
        joinDate: Date.now(),
        lastActivity: Date.now(),
      };

      await db.insert(schema.loyaltyProgram).values(newProgram);
      return newProgram as LoyaltyProgram;
    }
  }

  static async addTransaction(
    customerId: string,
    type: "earned" | "redeemed" | "expired" | "adjusted",
    points: number,
    description: string,
    referenceId?: string
  ): Promise<void> {
    const transaction = {
      id: generateId(),
      customerId,
      type,
      points,
      referenceId,
      description,
      createdAt: Date.now(),
    };

    await db.insert(schema.loyaltyTransactions).values(transaction);
    await this.createOrUpdate(
      customerId,
      type === "redeemed" ? -points : points
    );
  }

  static async getTransactions(
    customerId: string
  ): Promise<LoyaltyTransaction[]> {
    return await db
      .select()
      .from(schema.loyaltyTransactions)
      .where(eq(schema.loyaltyTransactions.customerId, customerId))
      .orderBy(desc(schema.loyaltyTransactions.createdAt));
  }
}

// Dashboard Services
export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    const todaySales = await InvoiceService.getTodaysSales();
    const todayTransactions = await InvoiceService.getTodaysTransactionCount();

    // Get low stock items
    const lowStockItems = await ProductService.getLowStock(10);

    // Get total customers
    const totalCustomersResult = await db
      .select({ count: count() })
      .from(schema.customers);
    const totalCustomers = totalCustomersResult[0]?.count || 0;

    // Get monthly revenue
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const monthlyRevenueResult = await db
      .select({ total: sum(schema.invoices.total) })
      .from(schema.invoices)
      .where(
        and(
          gte(schema.invoices.date, currentMonth.getTime()),
          lte(schema.invoices.date, nextMonth.getTime())
        )
      );
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    // Get recent transactions
    const recentTransactions = await db
      .select()
      .from(schema.invoices)
      .orderBy(desc(schema.invoices.createdAt))
      .limit(10);

    return {
      todaySales,
      todayTransactions,
      lowStockItems: lowStockItems.length,
      totalCustomers,
      monthlyRevenue,
      topSellingProducts: [], // TODO: Implement top selling products query
      recentTransactions: recentTransactions as Transaction[],
    };
  }
}

// Barcode Services
export class BarcodeService {
  static async getByBarcode(barcode: string): Promise<Product | null> {
    const mapping = await db
      .select()
      .from(schema.barcodeMappings)
      .where(
        and(
          eq(schema.barcodeMappings.barcode, barcode),
          eq(schema.barcodeMappings.isActive, true)
        )
      );

    if (!mapping[0]) return null;

    return await ProductService.getById(mapping[0].productId);
  }

  static async createMapping(
    barcode: string,
    productId: string
  ): Promise<BarcodeMapping> {
    const newMapping = {
      id: generateId(),
      barcode,
      productId,
      isActive: true,
      createdAt: Date.now(),
    };

    await db.insert(schema.barcodeMappings).values(newMapping);
    return newMapping as BarcodeMapping;
  }

  static async deleteMapping(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.barcodeMappings)
      .where(eq(schema.barcodeMappings.id, id));
    return result.changes > 0;
  }
}
