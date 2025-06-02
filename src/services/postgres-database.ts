import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, desc, asc, like, and, or, gte, lte, count, sum } from 'drizzle-orm';
import * as schema from '../db/postgres-schema';
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
  DashboardStats
} from '../types/pos';

// Database connection
let db: ReturnType<typeof drizzle>;
let pool: Pool;

export const initializeDatabase = (connectionString?: string) => {
  const defaultConnectionString = process.env.DATABASE_URL || 
    'postgresql://username:password@localhost:5432/pos_database';
  
  pool = new Pool({
    connectionString: connectionString || defaultConnectionString,
  });
  
  db = drizzle(pool, { schema });
  return db;
};

// Utility function to generate unique IDs (for compatibility)
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Product Services
export class ProductService {
  static async getAll(): Promise<Product[]> {
    const result = await db.select().from(schema.products).orderBy(asc(schema.products.name));
    return result.map(this.mapToProduct);
  }

  static async getById(id: number): Promise<Product | null> {
    const result = await db.select().from(schema.products).where(eq(schema.products.id, id));
    return result[0] ? this.mapToProduct(result[0]) : null;
  }

  static async getByCategory(category: string): Promise<Product[]> {
    const result = await db.select().from(schema.products)
      .where(eq(schema.products.category, category))
      .orderBy(asc(schema.products.name));
    return result.map(this.mapToProduct);
  }

  static async search(query: string): Promise<Product[]> {
    const result = await db.select().from(schema.products)
      .where(
        or(
          like(schema.products.name, `%${query}%`),
          like(schema.products.barcode, `%${query}%`),
          like(schema.products.hsn, `%${query}%`)
        )
      )
      .orderBy(asc(schema.products.name));
    return result.map(this.mapToProduct);
  }

  static async create(product: Omit<Product, 'id'>): Promise<Product> {
    const result = await db.insert(schema.products).values({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock,
      hsn: product.hsn,
      costPrice: product.costPrice?.toString(),
      sellingPrice: product.sellingPrice?.toString(),
      taxRate: product.taxRate?.toString() || '18',
      cgstRate: product.cgstRate?.toString() || '9',
      sgstRate: product.sgstRate?.toString() || '9',
      igstRate: product.igstRate?.toString() || '0',
      description: product.description,
      barcode: product.barcode,
      unit: product.unit || 'pcs',
      minStock: product.minStock || 5,
      maxStock: product.maxStock || 1000,
      isActive: product.isActive !== false,
    }).returning();
    
    return this.mapToProduct(result[0]);
  }

  static async update(id: number, updates: Partial<Product>): Promise<Product | null> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.price !== undefined) updateData.price = updates.price.toString();
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.stock !== undefined) updateData.stock = updates.stock;
    if (updates.hsn !== undefined) updateData.hsn = updates.hsn;
    if (updates.costPrice !== undefined) updateData.costPrice = updates.costPrice?.toString();
    if (updates.sellingPrice !== undefined) updateData.sellingPrice = updates.sellingPrice?.toString();
    if (updates.taxRate !== undefined) updateData.taxRate = updates.taxRate?.toString();
    if (updates.cgstRate !== undefined) updateData.cgstRate = updates.cgstRate?.toString();
    if (updates.sgstRate !== undefined) updateData.sgstRate = updates.sgstRate?.toString();
    if (updates.igstRate !== undefined) updateData.igstRate = updates.igstRate?.toString();
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.barcode !== undefined) updateData.barcode = updates.barcode;
    if (updates.unit !== undefined) updateData.unit = updates.unit;
    if (updates.minStock !== undefined) updateData.minStock = updates.minStock;
    if (updates.maxStock !== undefined) updateData.maxStock = updates.maxStock;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
    
    updateData.updatedAt = new Date();
    
    const result = await db.update(schema.products)
      .set(updateData)
      .where(eq(schema.products.id, id))
      .returning();
    
    return result[0] ? this.mapToProduct(result[0]) : null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.delete(schema.products).where(eq(schema.products.id, id));
    return result.rowCount > 0;
  }

  static async getLowStock(threshold: number = 10): Promise<Product[]> {
    const result = await db.select().from(schema.products)
      .where(lte(schema.products.stock, threshold))
      .orderBy(asc(schema.products.stock));
    return result.map(this.mapToProduct);
  }

  static async updateStock(id: number, quantity: number, operation: 'add' | 'subtract'): Promise<boolean> {
    const product = await this.getById(id);
    if (!product) return false;

    const newStock = operation === 'add' 
      ? product.stock + quantity 
      : product.stock - quantity;

    if (newStock < 0) return false;

    await this.update(id, { stock: newStock });
    return true;
  }

  private static mapToProduct(dbProduct: any): Product {
    return {
      id: dbProduct.id.toString(),
      name: dbProduct.name,
      price: parseFloat(dbProduct.price),
      category: dbProduct.category,
      stock: dbProduct.stock,
      hsn: dbProduct.hsn,
      costPrice: dbProduct.costPrice ? parseFloat(dbProduct.costPrice) : undefined,
      sellingPrice: dbProduct.sellingPrice ? parseFloat(dbProduct.sellingPrice) : undefined,
      taxRate: dbProduct.taxRate ? parseFloat(dbProduct.taxRate) : undefined,
      cgstRate: dbProduct.cgstRate ? parseFloat(dbProduct.cgstRate) : undefined,
      sgstRate: dbProduct.sgstRate ? parseFloat(dbProduct.sgstRate) : undefined,
      igstRate: dbProduct.igstRate ? parseFloat(dbProduct.igstRate) : undefined,
      description: dbProduct.description,
      barcode: dbProduct.barcode,
      unit: dbProduct.unit,
      minStock: dbProduct.minStock,
      maxStock: dbProduct.maxStock,
      isActive: dbProduct.isActive,
    };
  }
}

// Customer Services
export class CustomerService {
  static async getAll(): Promise<Customer[]> {
    const result = await db.select().from(schema.customers).orderBy(asc(schema.customers.name));
    return result.map(this.mapToCustomer);
  }

  static async getById(id: number): Promise<Customer | null> {
    const result = await db.select().from(schema.customers).where(eq(schema.customers.id, id));
    return result[0] ? this.mapToCustomer(result[0]) : null;
  }

  static async getByPhone(phone: string): Promise<Customer | null> {
    const result = await db.select().from(schema.customers).where(eq(schema.customers.phone, phone));
    return result[0] ? this.mapToCustomer(result[0]) : null;
  }

  static async search(query: string): Promise<Customer[]> {
    const result = await db.select().from(schema.customers)
      .where(
        or(
          like(schema.customers.name, `%${query}%`),
          like(schema.customers.phone, `%${query}%`),
          like(schema.customers.email, `%${query}%`)
        )
      )
      .orderBy(asc(schema.customers.name));
    return result.map(this.mapToCustomer);
  }

  static async create(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const result = await db.insert(schema.customers).values({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      gstin: customer.gstin,
      panNumber: customer.panNumber,
      dateOfBirth: customer.dateOfBirth,
      anniversary: customer.anniversary,
      totalOrders: customer.totalOrders || 0,
      totalSpent: customer.totalSpent?.toString() || '0',
      lastOrderDate: customer.lastOrderDate,
      status: customer.status || 'active',
    }).returning();
    
    return this.mapToCustomer(result[0]);
  }

  static async update(id: number, updates: Partial<Customer>): Promise<Customer | null> {
    const updateData: any = { ...updates };
    if (updates.totalSpent !== undefined) {
      updateData.totalSpent = updates.totalSpent.toString();
    }
    updateData.updatedAt = new Date();
    
    const result = await db.update(schema.customers)
      .set(updateData)
      .where(eq(schema.customers.id, id))
      .returning();
    
    return result[0] ? this.mapToCustomer(result[0]) : null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.delete(schema.customers).where(eq(schema.customers.id, id));
    return result.rowCount > 0;
  }

  static async updateStats(customerId: number, orderAmount: number): Promise<void> {
    const customer = await this.getById(customerId);
    if (!customer) return;

    await this.update(customerId, {
      totalOrders: customer.totalOrders + 1,
      totalSpent: customer.totalSpent + orderAmount,
      lastOrderDate: new Date(),
    });
  }

  private static mapToCustomer(dbCustomer: any): Customer {
    return {
      id: dbCustomer.id.toString(),
      name: dbCustomer.name,
      phone: dbCustomer.phone,
      email: dbCustomer.email,
      address: dbCustomer.address,
      city: dbCustomer.city,
      state: dbCustomer.state,
      pincode: dbCustomer.pincode,
      gstin: dbCustomer.gstin,
      panNumber: dbCustomer.panNumber,
      dateOfBirth: dbCustomer.dateOfBirth,
      anniversary: dbCustomer.anniversary,
      totalOrders: dbCustomer.totalOrders,
      totalSpent: parseFloat(dbCustomer.totalSpent),
      lastOrderDate: dbCustomer.lastOrderDate,
      status: dbCustomer.status,
    };
  }
}

// Category Services
export class CategoryService {
  static async getAll(): Promise<Category[]> {
    const result = await db.select().from(schema.categories)
      .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.name));
    return result.map(this.mapToCategory);
  }

  static async getById(id: number): Promise<Category | null> {
    const result = await db.select().from(schema.categories).where(eq(schema.categories.id, id));
    return result[0] ? this.mapToCategory(result[0]) : null;
  }

  static async getActive(): Promise<Category[]> {
    const result = await db.select().from(schema.categories)
      .where(eq(schema.categories.isActive, true))
      .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.name));
    return result.map(this.mapToCategory);
  }

  static async create(category: Omit<Category, 'id'>): Promise<Category> {
    const result = await db.insert(schema.categories).values({
      name: category.name,
      description: category.description,
      parentId: category.parentId ? parseInt(category.parentId) : null,
      isActive: category.isActive !== false,
      sortOrder: category.sortOrder || 0,
    }).returning();
    
    return this.mapToCategory(result[0]);
  }

  static async update(id: number, updates: Partial<Category>): Promise<Category | null> {
    const updateData: any = { ...updates };
    if (updates.parentId !== undefined) {
      updateData.parentId = updates.parentId ? parseInt(updates.parentId) : null;
    }
    updateData.updatedAt = new Date();
    
    const result = await db.update(schema.categories)
      .set(updateData)
      .where(eq(schema.categories.id, id))
      .returning();
    
    return result[0] ? this.mapToCategory(result[0]) : null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.delete(schema.categories).where(eq(schema.categories.id, id));
    return result.rowCount > 0;
  }

  private static mapToCategory(dbCategory: any): Category {
    return {
      id: dbCategory.id.toString(),
      name: dbCategory.name,
      description: dbCategory.description,
      parentId: dbCategory.parentId?.toString(),
      isActive: dbCategory.isActive,
      sortOrder: dbCategory.sortOrder,
      createdAt: dbCategory.createdAt,
      updatedAt: dbCategory.updatedAt,
    };
  }
}
