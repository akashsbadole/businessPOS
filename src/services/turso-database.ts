import { createClient } from "@libsql/client";
import type {
  Product,
  Customer,
  Category,
  Supplier,
  Transaction,
  BarcodeMapping,
  DashboardStats,
} from "../types/pos";

// Turso Database Client
class TursoClient {
  private client: any;
  private isInitialized = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    try {
      const databaseUrl = import.meta.env.VITE_TURSO_DATABASE_URL;
      const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

      if (!databaseUrl || !authToken) {
        console.warn(
          "Turso credentials not found, falling back to local SQLite"
        );
        // Fallback to local SQLite
        this.client = createClient({
          url: "file:" + (import.meta.env.VITE_LOCAL_DB_PATH || "./local.db"),
        });
      } else {
        // Use Turso cloud database
        this.client = createClient({
          url: databaseUrl,
          authToken: authToken,
        });
      }

      this.isInitialized = true;
      console.log("Turso database client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Turso client:", error);
      // Fallback to local SQLite
      this.client = createClient({
        url: "file:./local.db",
      });
      this.isInitialized = true;
    }
  }

  async execute(sql: string, params: any[] = []) {
    if (!this.isInitialized) {
      throw new Error("Database client not initialized");
    }

    try {
      const result = await this.client.execute(sql, params);
      return result;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  async batch(statements: Array<{ sql: string; args?: any[] }>) {
    if (!this.isInitialized) {
      throw new Error("Database client not initialized");
    }

    try {
      const result = await this.client.batch(statements);
      return result;
    } catch (error) {
      console.error("Database batch error:", error);
      throw error;
    }
  }

  async close() {
    if (this.client && this.client.close) {
      await this.client.close();
    }
  }
}

// Singleton instance
const tursoClient = new TursoClient();

// Database initialization
export const initializeDatabase = async () => {
  try {
    // Create tables if they don't exist
    await createTables();
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

// Create database tables
const createTables = async () => {
  const tables = [
    // Products table
    `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      barcode TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      cost REAL,
      stock INTEGER NOT NULL DEFAULT 0,
      minStock INTEGER DEFAULT 5,
      maxStock INTEGER DEFAULT 100,
      unit TEXT DEFAULT 'pcs',
      description TEXT,
      hsn TEXT,
      taxRate REAL DEFAULT 18,
      isActive BOOLEAN DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    // Customers table
    `CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      gstin TEXT,
      totalOrders INTEGER DEFAULT 0,
      totalSpent REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    // Categories table
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      sortOrder INTEGER DEFAULT 0,
      isActive BOOLEAN DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    // Suppliers table
    `CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      gstin TEXT,
      status TEXT DEFAULT 'active',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    // Transactions/Invoices table
    `CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      invoiceNumber TEXT NOT NULL,
      customer TEXT,
      date TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      taxAmount REAL DEFAULT 0,
      roundOff REAL DEFAULT 0,
      amount REAL NOT NULL,
      paymentMethod TEXT DEFAULT 'Cash',
      amountReceived REAL DEFAULT 0,
      change REAL DEFAULT 0,
      status TEXT DEFAULT 'completed',
      items TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    // Barcode mappings table
    `CREATE TABLE IF NOT EXISTS barcode_mappings (
      id TEXT PRIMARY KEY,
      barcode TEXT NOT NULL,
      productId TEXT NOT NULL,
      isActive BOOLEAN DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products (id)
    )`,

    // Users table for authentication
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'cashier' CHECK (role IN ('admin', 'manager', 'cashier', 'inventory')),
      permissions TEXT NOT NULL, -- JSON: Array of permission strings
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      last_login TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const table of tables) {
    await tursoClient.execute(table);
  }

  // Create indexes for better performance
  const indexes = [
    "CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)",
    "CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)",
    "CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)",
    "CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)",
    "CREATE INDEX IF NOT EXISTS idx_transactions_customer ON transactions(customer)",
    "CREATE INDEX IF NOT EXISTS idx_barcode_mappings_barcode ON barcode_mappings(barcode)",
  ];

  for (const index of indexes) {
    await tursoClient.execute(index);
  }
};

// Utility functions
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const formatDate = (date: Date) => {
  return date.toISOString();
};

export { tursoClient, generateId, formatDate };
