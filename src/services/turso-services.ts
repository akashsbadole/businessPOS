import { tursoClient, generateId, formatDate } from "./turso-database";
import type {
  Product,
  Customer,
  Category,
  Supplier,
  Transaction,
  BarcodeMapping,
  DashboardStats,
} from "../types/pos";

// Sanitize values for database insertion
const sanitizeValue = (value: any): any => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return formatDate(value);
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  if (typeof value === "number") {
    return isNaN(value) ? 0 : value;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return String(value);
};

// Product Services
export class TursoProductService {
  static async getAll(): Promise<Product[]> {
    const result = await tursoClient.execute(
      "SELECT * FROM products WHERE isActive = 1 ORDER BY name"
    );
    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      barcode: row.barcode,
      category: row.category,
      price: row.price,
      cost: row.cost,
      stock: row.stock,
      minStock: row.minStock,
      maxStock: row.maxStock,
      unit: row.unit,
      description: row.description,
      hsn: row.hsn,
      taxRate: row.taxRate,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  static async getById(id: string): Promise<Product | null> {
    const result = await tursoClient.execute(
      "SELECT * FROM products WHERE id = ? AND isActive = 1",
      [id]
    );
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      barcode: row.barcode,
      category: row.category,
      price: row.price,
      cost: row.cost,
      stock: row.stock,
      minStock: row.minStock,
      maxStock: row.maxStock,
      unit: row.unit,
      description: row.description,
      hsn: row.hsn,
      taxRate: row.taxRate,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  static async getByBarcode(barcode: string): Promise<Product | null> {
    const result = await tursoClient.execute(
      "SELECT * FROM products WHERE barcode = ? AND isActive = 1",
      [barcode]
    );
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      barcode: row.barcode,
      category: row.category,
      price: row.price,
      cost: row.cost,
      stock: row.stock,
      minStock: row.minStock,
      maxStock: row.maxStock,
      unit: row.unit,
      description: row.description,
      hsn: row.hsn,
      taxRate: row.taxRate,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  static async getLowStock(threshold: number = 10): Promise<Product[]> {
    const result = await tursoClient.execute(
      "SELECT * FROM products WHERE stock <= ? AND isActive = 1 ORDER BY stock ASC",
      [threshold]
    );
    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      barcode: row.barcode,
      category: row.category,
      price: row.price,
      cost: row.cost,
      stock: row.stock,
      minStock: row.minStock,
      maxStock: row.maxStock,
      unit: row.unit,
      description: row.description,
      hsn: row.hsn,
      taxRate: row.taxRate,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  static async create(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const id = generateId();
    const now = formatDate(new Date());

    await tursoClient.execute(
      `INSERT INTO products (
        id, name, barcode, category, price, cost, stock, minStock, maxStock, 
        unit, description, hsn, taxRate, isActive, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        sanitizeValue(product.name),
        sanitizeValue(product.barcode),
        sanitizeValue(product.category),
        sanitizeValue(product.price),
        sanitizeValue(product.cost),
        sanitizeValue(product.stock),
        sanitizeValue(product.minStock),
        sanitizeValue(product.maxStock),
        sanitizeValue(product.unit),
        sanitizeValue(product.description),
        sanitizeValue(product.hsn),
        sanitizeValue(product.taxRate),
        sanitizeValue(product.isActive),
        now,
        now,
      ]
    );

    return {
      ...product,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  static async update(
    id: string,
    updates: Partial<Product>
  ): Promise<Product | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const now = formatDate(new Date());
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt" && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(sanitizeValue(value));
      }
    });

    if (fields.length === 0) return existing;

    fields.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await tursoClient.execute(
      `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await tursoClient.execute(
      "UPDATE products SET isActive = 0 WHERE id = ?",
      [id]
    );
    return result.rowsAffected > 0;
  }

  static async updateStock(
    productId: string,
    quantity: number,
    operation: "add" | "subtract"
  ): Promise<void> {
    const operator = operation === "add" ? "+" : "-";
    await tursoClient.execute(
      `UPDATE products SET stock = stock ${operator} ?, updatedAt = ? WHERE id = ?`,
      [quantity, formatDate(new Date()), productId]
    );
  }
}

// Customer Services
export class TursoCustomerService {
  static async getAll(): Promise<Customer[]> {
    const result = await tursoClient.execute(
      "SELECT * FROM customers ORDER BY name"
    );
    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      gstin: row.gstin,
      totalOrders: row.totalOrders,
      totalSpent: row.totalSpent,
      status: row.status as "active" | "inactive",
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  static async getById(id: string): Promise<Customer | null> {
    const result = await tursoClient.execute(
      "SELECT * FROM customers WHERE id = ?",
      [id]
    );
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      gstin: row.gstin,
      totalOrders: row.totalOrders,
      totalSpent: row.totalSpent,
      status: row.status as "active" | "inactive",
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  static async getByPhone(phone: string): Promise<Customer | null> {
    const result = await tursoClient.execute(
      "SELECT * FROM customers WHERE phone = ?",
      [phone]
    );
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      gstin: row.gstin,
      totalOrders: row.totalOrders,
      totalSpent: row.totalSpent,
      status: row.status as "active" | "inactive",
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  static async create(
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer> {
    const id = generateId();
    const now = formatDate(new Date());

    await tursoClient.execute(
      `INSERT INTO customers (
        id, name, phone, email, address, city, state, pincode, gstin,
        totalOrders, totalSpent, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        sanitizeValue(customer.name),
        sanitizeValue(customer.phone),
        sanitizeValue(customer.email),
        sanitizeValue(customer.address),
        sanitizeValue(customer.city),
        sanitizeValue(customer.state),
        sanitizeValue(customer.pincode),
        sanitizeValue(customer.gstin),
        sanitizeValue(customer.totalOrders),
        sanitizeValue(customer.totalSpent),
        sanitizeValue(customer.status),
        now,
        now,
      ]
    );

    return {
      ...customer,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  static async update(
    id: string,
    updates: Partial<Customer>
  ): Promise<Customer | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const now = formatDate(new Date());
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt" && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(sanitizeValue(value));
      }
    });

    if (fields.length === 0) return existing;

    fields.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await tursoClient.execute(
      `UPDATE customers SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await tursoClient.execute(
      "DELETE FROM customers WHERE id = ?",
      [id]
    );
    return result.rowsAffected > 0;
  }

  static async updateStats(
    customerId: string,
    orderAmount: number
  ): Promise<void> {
    await tursoClient.execute(
      "UPDATE customers SET totalOrders = totalOrders + 1, totalSpent = totalSpent + ?, updatedAt = ? WHERE id = ?",
      [orderAmount, formatDate(new Date()), customerId]
    );
  }

  static async search(query: string): Promise<Customer[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const result = await tursoClient.execute(
      "SELECT * FROM customers WHERE LOWER(name) LIKE ? OR phone LIKE ? OR LOWER(email) LIKE ? ORDER BY name",
      [lowerQuery, `%${query}%`, lowerQuery]
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      gstin: row.gstin,
      totalOrders: row.totalOrders,
      totalSpent: row.totalSpent,
      status: row.status as "active" | "inactive",
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }
}

// Category Services
export class TursoCategoryService {
  static async getAll(): Promise<Category[]> {
    const result = await tursoClient.execute(
      "SELECT * FROM categories WHERE isActive = 1 ORDER BY sortOrder, name"
    );
    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      sortOrder: row.sortOrder,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
    }));
  }

  static async getById(id: string): Promise<Category | null> {
    const result = await tursoClient.execute(
      "SELECT * FROM categories WHERE id = ? AND isActive = 1",
      [id]
    );
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      sortOrder: row.sortOrder,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
    };
  }

  static async getActive(): Promise<Category[]> {
    return this.getAll(); // Already filtered by isActive = 1
  }

  static async create(
    category: Omit<Category, "id" | "createdAt">
  ): Promise<Category> {
    const id = generateId();
    const now = formatDate(new Date());

    await tursoClient.execute(
      "INSERT INTO categories (id, name, description, sortOrder, isActive, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id,
        sanitizeValue(category.name),
        sanitizeValue(category.description),
        sanitizeValue(category.sortOrder),
        sanitizeValue(category.isActive),
        now,
      ]
    );

    return {
      ...category,
      id,
      createdAt: new Date(now),
    };
  }

  static async update(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt" && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(sanitizeValue(value));
      }
    });

    if (fields.length === 0) return existing;
    values.push(id);

    await tursoClient.execute(
      `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await tursoClient.execute(
      "UPDATE categories SET isActive = 0 WHERE id = ?",
      [id]
    );
    return result.rowsAffected > 0;
  }
}

// Invoice/Transaction Services
export class TursoInvoiceService {
  static async getAll(): Promise<Transaction[]> {
    const result = await tursoClient.execute(
      "SELECT * FROM transactions ORDER BY date DESC"
    );
    return result.rows.map((row: any) => ({
      id: row.id,
      invoiceNumber: row.invoiceNumber,
      customer: row.customer,
      date: new Date(row.date),
      subtotal: row.subtotal,
      discount: row.discount,
      taxAmount: row.taxAmount,
      roundOff: row.roundOff,
      amount: row.amount,
      paymentMethod: row.paymentMethod,
      amountReceived: row.amountReceived,
      change: row.change,
      status: row.status,
      items: JSON.parse(row.items),
      createdAt: new Date(row.createdAt),
    }));
  }

  static async getById(id: string): Promise<Transaction | null> {
    const result = await tursoClient.execute(
      "SELECT * FROM transactions WHERE id = ?",
      [id]
    );
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      invoiceNumber: row.invoiceNumber,
      customer: row.customer,
      date: new Date(row.date),
      subtotal: row.subtotal,
      discount: row.discount,
      taxAmount: row.taxAmount,
      roundOff: row.roundOff,
      amount: row.amount,
      paymentMethod: row.paymentMethod,
      amountReceived: row.amountReceived,
      change: row.change,
      status: row.status,
      items: JSON.parse(row.items),
      createdAt: new Date(row.createdAt),
    };
  }

  static async create(
    transaction: Omit<Transaction, "id" | "createdAt">
  ): Promise<Transaction> {
    const id = generateId();
    const now = formatDate(new Date());

    // Ensure all values are properly serialized and typed
    const values = [
      String(id),
      String(transaction.invoiceNumber),
      transaction.customer && String(transaction.customer).trim()
        ? String(transaction.customer)
        : null,
      formatDate(transaction.date),
      Number(transaction.subtotal || 0),
      Number(transaction.discount || 0),
      Number(transaction.taxAmount || 0),
      Number(transaction.roundOff || 0),
      Number(transaction.amount),
      String(transaction.paymentMethod),
      Number(transaction.amountReceived || 0),
      Number(transaction.change || 0),
      String(transaction.status || "completed"),
      JSON.stringify(transaction.items || []),
      String(now),
    ];

    await tursoClient.execute(
      `INSERT INTO transactions (
        id, invoiceNumber, customer, date, subtotal, discount, taxAmount, roundOff,
        amount, paymentMethod, amountReceived, change, status, items, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    return {
      ...transaction,
      id,
      createdAt: new Date(now),
    };
  }

  static async createWithItems(
    transaction: Omit<Transaction, "id" | "createdAt">,
    items: any[]
  ): Promise<Transaction> {
    const newTransaction = await this.create(transaction);

    // Update product stock
    for (const item of items) {
      await TursoProductService.updateStock(
        item.productId || item.id,
        item.quantity,
        "subtract"
      );
    }

    // Update customer stats if customer exists
    if (transaction.customer) {
      await TursoCustomerService.updateStats(
        transaction.customer,
        transaction.amount
      );
    }

    return newTransaction;
  }

  static async getTodaysSales(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await tursoClient.execute(
      "SELECT SUM(amount) as total FROM transactions WHERE date >= ? AND date < ?",
      [formatDate(today), formatDate(tomorrow)]
    );

    return result.rows[0]?.total || 0;
  }

  static async getTodaysTransactionCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await tursoClient.execute(
      "SELECT COUNT(*) as count FROM transactions WHERE date >= ? AND date < ?",
      [formatDate(today), formatDate(tomorrow)]
    );

    return result.rows[0]?.count || 0;
  }
}

// Supplier Services
export class TursoSupplierService {
  static async getAll(): Promise<Supplier[]> {
    const result = await tursoClient.execute(
      "SELECT * FROM suppliers ORDER BY name"
    );
    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      gstin: row.gstin,
      status: row.status as "active" | "inactive",
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  static async getById(id: string): Promise<Supplier | null> {
    const result = await tursoClient.execute(
      "SELECT * FROM suppliers WHERE id = ?",
      [id]
    );
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      gstin: row.gstin,
      status: row.status as "active" | "inactive",
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  static async getActive(): Promise<Supplier[]> {
    const result = await tursoClient.execute(
      'SELECT * FROM suppliers WHERE status = "active" ORDER BY name'
    );
    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      gstin: row.gstin,
      status: row.status as "active" | "inactive",
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  static async create(
    supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">
  ): Promise<Supplier> {
    const id = generateId();
    const now = formatDate(new Date());

    await tursoClient.execute(
      `INSERT INTO suppliers (
        id, name, phone, email, address, city, state, pincode, gstin, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        supplier.name,
        supplier.phone,
        supplier.email,
        supplier.address,
        supplier.city,
        supplier.state,
        supplier.pincode,
        supplier.gstin,
        supplier.status,
        now,
        now,
      ]
    );

    return {
      ...supplier,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  static async update(
    id: string,
    updates: Partial<Supplier>
  ): Promise<Supplier | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const now = formatDate(new Date());
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && key !== "createdAt" && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(sanitizeValue(value));
      }
    });

    if (fields.length === 0) return existing;

    fields.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await tursoClient.execute(
      `UPDATE suppliers SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await tursoClient.execute(
      "DELETE FROM suppliers WHERE id = ?",
      [id]
    );
    return result.rowsAffected > 0;
  }

  static async search(query: string): Promise<Supplier[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const result = await tursoClient.execute(
      "SELECT * FROM suppliers WHERE LOWER(name) LIKE ? OR phone LIKE ? OR LOWER(email) LIKE ? ORDER BY name",
      [lowerQuery, `%${query}%`, lowerQuery]
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      gstin: row.gstin,
      status: row.status as "active" | "inactive",
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }
}

// Dashboard Services
export class TursoDashboardService {
  static async getStats(): Promise<DashboardStats> {
    const todaySales = await TursoInvoiceService.getTodaysSales();
    const todayTransactions =
      await TursoInvoiceService.getTodaysTransactionCount();

    // Get low stock items
    const lowStockItems = await TursoProductService.getLowStock(10);

    // Get total customers
    const allCustomers = await TursoCustomerService.getAll();
    const totalCustomers = allCustomers.length;

    // Get monthly revenue
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const monthlyResult = await tursoClient.execute(
      "SELECT SUM(amount) as total FROM transactions WHERE date >= ? AND date < ?",
      [formatDate(currentMonth), formatDate(nextMonth)]
    );
    const monthlyRevenue = monthlyResult.rows[0]?.total || 0;

    // Get recent transactions
    const recentTransactions = (await TursoInvoiceService.getAll()).slice(
      0,
      10
    );

    return {
      todaySales,
      todayTransactions,
      lowStockItems: lowStockItems.length,
      totalCustomers,
      monthlyRevenue,
      topSellingProducts: [], // TODO: Implement top selling products query
      recentTransactions,
    };
  }
}

// Barcode Services
export class TursoBarcodeService {
  static async getByBarcode(barcode: string): Promise<Product | null> {
    // First try direct product lookup
    const product = await TursoProductService.getByBarcode(barcode);
    if (product) return product;

    // Then try barcode mapping
    const result = await tursoClient.execute(
      "SELECT productId FROM barcode_mappings WHERE barcode = ? AND isActive = 1",
      [barcode]
    );

    if (result.rows.length === 0) return null;

    const productId = result.rows[0].productId;
    return await TursoProductService.getById(productId);
  }

  static async createMapping(
    barcode: string,
    productId: string
  ): Promise<BarcodeMapping> {
    const id = generateId();
    const now = formatDate(new Date());

    await tursoClient.execute(
      "INSERT INTO barcode_mappings (id, barcode, productId, isActive, createdAt) VALUES (?, ?, ?, ?, ?)",
      [id, barcode, productId, 1, now]
    );

    return {
      id,
      barcode,
      productId,
      isActive: true,
      createdAt: new Date(now),
    };
  }

  static async deleteMapping(id: string): Promise<boolean> {
    const result = await tursoClient.execute(
      "DELETE FROM barcode_mappings WHERE id = ?",
      [id]
    );
    return result.rowsAffected > 0;
  }
}
