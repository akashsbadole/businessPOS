// Database Factory - Choose between localStorage and PostgreSQL based on environment

import {
  Product,
  Customer,
  Category,
  Supplier,
  DashboardStats,
} from "../types/pos";

// Import database services
import * as SimpleDB from "./simple-database";
import * as TursoDB from "./turso-services";
import { initializeDatabase } from "./turso-database";
// PostgreSQL service will be dynamically imported only when needed

// Database interface for consistent API
interface DatabaseService {
  ProductService: {
    getAll(): Promise<Product[]>;
    getById(id: string | number): Promise<Product | null>;
    getByCategory(category: string): Promise<Product[]>;
    search(query: string): Promise<Product[]>;
    create(product: Omit<Product, "id">): Promise<Product>;
    update(
      id: string | number,
      updates: Partial<Product>
    ): Promise<Product | null>;
    delete(id: string | number): Promise<boolean>;
    getLowStock(threshold?: number): Promise<Product[]>;
    updateStock(
      id: string | number,
      quantity: number,
      operation: "add" | "subtract"
    ): Promise<boolean>;
  };
  CustomerService: {
    getAll(): Promise<Customer[]>;
    getById(id: string | number): Promise<Customer | null>;
    getByPhone(phone: string): Promise<Customer | null>;
    search(query: string): Promise<Customer[]>;
    create(customer: Omit<Customer, "id">): Promise<Customer>;
    update(
      id: string | number,
      updates: Partial<Customer>
    ): Promise<Customer | null>;
    delete(id: string | number): Promise<boolean>;
    updateStats(
      customerId: string | number,
      orderAmount: number
    ): Promise<void>;
  };
  CategoryService: {
    getAll(): Promise<Category[]>;
    getById(id: string | number): Promise<Category | null>;
    getActive(): Promise<Category[]>;
    create(category: Omit<Category, "id">): Promise<Category>;
    update(
      id: string | number,
      updates: Partial<Category>
    ): Promise<Category | null>;
    delete(id: string | number): Promise<boolean>;
  };
  SupplierService: {
    getAll(): Promise<Supplier[]>;
    getById(id: string | number): Promise<Supplier | null>;
    getActive(): Promise<Supplier[]>;
    search(query: string): Promise<Supplier[]>;
    create(supplier: Omit<Supplier, "id">): Promise<Supplier>;
    update(
      id: string | number,
      updates: Partial<Supplier>
    ): Promise<Supplier | null>;
    delete(id: string | number): Promise<boolean>;
  };
  DashboardService: {
    getStats(): Promise<DashboardStats>;
  };
}

// Determine which database to use
const getDatabaseType = () => {
  const dbType = import.meta.env.DB_TYPE || "sqlite";
  const hasTursoCredentials =
    import.meta.env.VITE_TURSO_DATABASE_URL &&
    import.meta.env.VITE_TURSO_AUTH_TOKEN;

  if (dbType === "turso" || hasTursoCredentials) {
    return "turso";
  }

  // For browser environment, default to localStorage
  return "localStorage";
};

// Create database service based on environment
const createDatabaseService = (): DatabaseService => {
  const dbType = getDatabaseType();

  if (dbType === "turso") {
    return createTursoDBService();
  }

  return createSimpleDBService();
};

const createSimpleDBService = (): DatabaseService => {
  console.log("💾 Using localStorage database");

  return {
    ProductService: {
      getAll: SimpleDB.ProductService.getAll,
      getById: (id) => SimpleDB.ProductService.getById(id.toString()),
      getByCategory: SimpleDB.ProductService.getByCategory,
      search: SimpleDB.ProductService.search,
      create: SimpleDB.ProductService.create,
      update: (id, updates) =>
        SimpleDB.ProductService.update(id.toString(), updates),
      delete: (id) => SimpleDB.ProductService.delete(id.toString()),
      getLowStock: SimpleDB.ProductService.getLowStock,
      updateStock: (id, quantity, operation) =>
        SimpleDB.ProductService.updateStock(id.toString(), quantity, operation),
    },
    CustomerService: {
      getAll: SimpleDB.CustomerService.getAll,
      getById: (id) => SimpleDB.CustomerService.getById(id.toString()),
      getByPhone: SimpleDB.CustomerService.getByPhone,
      search: SimpleDB.CustomerService.search,
      create: SimpleDB.CustomerService.create,
      update: (id, updates) =>
        SimpleDB.CustomerService.update(id.toString(), updates),
      delete: (id) => SimpleDB.CustomerService.delete(id.toString()),
      updateStats: (id, amount) =>
        SimpleDB.CustomerService.updateStats(id.toString(), amount),
    },
    CategoryService: {
      getAll: SimpleDB.CategoryService.getAll,
      getById: (id) => SimpleDB.CategoryService.getById(id.toString()),
      getActive: SimpleDB.CategoryService.getActive,
      create: SimpleDB.CategoryService.create,
      update: (id, updates) =>
        SimpleDB.CategoryService.update(id.toString(), updates),
      delete: (id) => SimpleDB.CategoryService.delete(id.toString()),
    },
    SupplierService: {
      getAll: SimpleDB.SupplierService.getAll,
      getById: (id) => SimpleDB.SupplierService.getById(id.toString()),
      getActive: SimpleDB.SupplierService.getActive,
      search: SimpleDB.SupplierService.search,
      create: SimpleDB.SupplierService.create,
      update: (id, updates) =>
        SimpleDB.SupplierService.update(id.toString(), updates),
      delete: (id) => SimpleDB.SupplierService.delete(id.toString()),
    },
    DashboardService: {
      getStats: SimpleDB.DashboardService.getStats,
    },
  };
};

const createTursoDBService = (): DatabaseService => {
  console.log("🚀 Using Turso SQLite database");

  // Initialize database tables
  initializeDatabase().catch(console.error);

  return {
    ProductService: {
      getAll: TursoDB.TursoProductService.getAll,
      getById: (id) => TursoDB.TursoProductService.getById(id.toString()),
      getByCategory: (category) => {
        // Implement category filtering
        return TursoDB.TursoProductService.getAll().then((products) =>
          products.filter((p) => p.category === category)
        );
      },
      search: (query) => {
        // Implement search functionality
        return TursoDB.TursoProductService.getAll().then((products) =>
          products.filter(
            (p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.barcode?.toLowerCase().includes(query.toLowerCase())
          )
        );
      },
      create: TursoDB.TursoProductService.create,
      update: (id, updates) =>
        TursoDB.TursoProductService.update(id.toString(), updates),
      delete: (id) => TursoDB.TursoProductService.delete(id.toString()),
      getLowStock: TursoDB.TursoProductService.getLowStock,
      updateStock: async (id, quantity, operation) => {
        await TursoDB.TursoProductService.updateStock(
          id.toString(),
          quantity,
          operation
        );
        return true;
      },
    },
    CustomerService: {
      getAll: TursoDB.TursoCustomerService.getAll,
      getById: (id) => TursoDB.TursoCustomerService.getById(id.toString()),
      getByPhone: TursoDB.TursoCustomerService.getByPhone,
      search: TursoDB.TursoCustomerService.search,
      create: TursoDB.TursoCustomerService.create,
      update: (id, updates) =>
        TursoDB.TursoCustomerService.update(id.toString(), updates),
      delete: (id) => TursoDB.TursoCustomerService.delete(id.toString()),
      updateStats: (id, amount) =>
        TursoDB.TursoCustomerService.updateStats(id.toString(), amount),
    },
    CategoryService: {
      getAll: TursoDB.TursoCategoryService.getAll,
      getById: (id) => TursoDB.TursoCategoryService.getById(id.toString()),
      getActive: TursoDB.TursoCategoryService.getActive,
      create: TursoDB.TursoCategoryService.create,
      update: (id, updates) =>
        TursoDB.TursoCategoryService.update(id.toString(), updates),
      delete: (id) => TursoDB.TursoCategoryService.delete(id.toString()),
    },
    SupplierService: {
      getAll: TursoDB.TursoSupplierService.getAll,
      getById: (id) => TursoDB.TursoSupplierService.getById(id.toString()),
      getActive: TursoDB.TursoSupplierService.getActive,
      search: TursoDB.TursoSupplierService.search,
      create: TursoDB.TursoSupplierService.create,
      update: (id, updates) =>
        TursoDB.TursoSupplierService.update(id.toString(), updates),
      delete: (id) => TursoDB.TursoSupplierService.delete(id.toString()),
    },
    DashboardService: {
      getStats: TursoDB.TursoDashboardService.getStats,
    },
  };
};

// Export the database service
export const db = createDatabaseService();

// Export individual services for convenience
export const ProductService = db.ProductService;
export const CustomerService = db.CustomerService;
export const CategoryService = db.CategoryService;
export const SupplierService = db.SupplierService;
export const DashboardService = db.DashboardService;
export const InvoiceService =
  getDatabaseType() === "turso"
    ? TursoDB.TursoInvoiceService
    : SimpleDB.InvoiceService;

// Export utility functions
export const generateId = SimpleDB.generateId;

// Database status
export const getDatabaseInfo = () => {
  const dbType = getDatabaseType();

  if (dbType === "turso") {
    return {
      type: "turso",
      isPostgreSQL: false,
      isLocalStorage: false,
      isTurso: true,
      connectionString: import.meta.env.VITE_TURSO_DATABASE_URL || "local.db",
    };
  }

  return {
    type: "localStorage",
    isPostgreSQL: false,
    isLocalStorage: true,
    isTurso: false,
    connectionString: "localStorage",
  };
};

// Switch database (for testing purposes)
export const switchToPostgreSQL = () => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.set("db", "postgres");
    window.location.href = url.toString();
  }
};

export const switchToLocalStorage = () => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.delete("db");
    window.location.href = url.toString();
  }
};
