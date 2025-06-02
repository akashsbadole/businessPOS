import { storage } from './storage';
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

// Utility function to generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Product Services
export class ProductService {
  static async getAll(): Promise<Product[]> {
    return storage.getAll<Product>('products');
  }

  static async getById(id: string): Promise<Product | null> {
    return storage.getById<Product>('products', id);
  }

  static async getByCategory(category: string): Promise<Product[]> {
    return storage.query<Product>('products', (product) => product.category === category);
  }

  static async search(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return storage.query<Product>('products', (product) => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.barcode?.toLowerCase().includes(lowerQuery) ||
      product.hsn?.toLowerCase().includes(lowerQuery)
    );
  }

  static async create(product: Omit<Product, 'id'>): Promise<Product> {
    return storage.create<Product>('products', product);
  }

  static async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    return storage.update<Product>('products', id, updates);
  }

  static async delete(id: string): Promise<boolean> {
    return storage.delete('products', id);
  }

  static async getLowStock(threshold: number = 10): Promise<Product[]> {
    return storage.query<Product>('products', (product) => product.stock <= threshold);
  }

  static async updateStock(id: string, quantity: number, operation: 'add' | 'subtract'): Promise<boolean> {
    const product = await this.getById(id);
    if (!product) return false;

    const newStock = operation === 'add' 
      ? product.stock + quantity 
      : product.stock - quantity;

    if (newStock < 0) return false;

    await this.update(id, { stock: newStock });
    return true;
  }
}

// Customer Services
export class CustomerService {
  static async getAll(): Promise<Customer[]> {
    return storage.getAll<Customer>('customers');
  }

  static async getById(id: string): Promise<Customer | null> {
    return storage.getById<Customer>('customers', id);
  }

  static async getByPhone(phone: string): Promise<Customer | null> {
    const customers = storage.query<Customer>('customers', (customer) => customer.phone === phone);
    return customers[0] || null;
  }

  static async search(query: string): Promise<Customer[]> {
    const lowerQuery = query.toLowerCase();
    return storage.query<Customer>('customers', (customer) => 
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.phone.includes(query) ||
      customer.email?.toLowerCase().includes(lowerQuery)
    );
  }

  static async create(customer: Omit<Customer, 'id'>): Promise<Customer> {
    return storage.create<Customer>('customers', customer);
  }

  static async update(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    return storage.update<Customer>('customers', id, updates);
  }

  static async delete(id: string): Promise<boolean> {
    return storage.delete('customers', id);
  }

  static async updateStats(customerId: string, orderAmount: number): Promise<void> {
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
    return storage.getAll<Category>('categories').sort((a, b) => a.sortOrder - b.sortOrder);
  }

  static async getById(id: string): Promise<Category | null> {
    return storage.getById<Category>('categories', id);
  }

  static async getActive(): Promise<Category[]> {
    return storage.query<Category>('categories', (category) => category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  static async create(category: Omit<Category, 'id'>): Promise<Category> {
    return storage.create<Category>('categories', category);
  }

  static async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    return storage.update<Category>('categories', id, updates);
  }

  static async delete(id: string): Promise<boolean> {
    return storage.delete('categories', id);
  }
}

// Supplier Services
export class SupplierService {
  static async getAll(): Promise<Supplier[]> {
    return storage.getAll<Supplier>('suppliers');
  }

  static async getById(id: string): Promise<Supplier | null> {
    return storage.getById<Supplier>('suppliers', id);
  }

  static async getActive(): Promise<Supplier[]> {
    return storage.query<Supplier>('suppliers', (supplier) => supplier.status === 'active');
  }

  static async search(query: string): Promise<Supplier[]> {
    const lowerQuery = query.toLowerCase();
    return storage.query<Supplier>('suppliers', (supplier) => 
      supplier.name.toLowerCase().includes(lowerQuery) ||
      supplier.phone.includes(query) ||
      supplier.email?.toLowerCase().includes(lowerQuery)
    );
  }

  static async create(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    return storage.create<Supplier>('suppliers', supplier);
  }

  static async update(id: string, updates: Partial<Supplier>): Promise<Supplier | null> {
    return storage.update<Supplier>('suppliers', id, updates);
  }

  static async delete(id: string): Promise<boolean> {
    return storage.delete('suppliers', id);
  }
}

// Invoice Services
export class InvoiceService {
  static async getAll(): Promise<Transaction[]> {
    return storage.getAll<Transaction>('invoices').sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  static async getById(id: string): Promise<Transaction | null> {
    return storage.getById<Transaction>('invoices', id);
  }

  static async getByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return storage.query<Transaction>('invoices', (invoice) => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate >= startDate && invoiceDate <= endDate;
    });
  }

  static async create(invoice: Omit<Transaction, 'id'>): Promise<Transaction> {
    return storage.create<Transaction>('invoices', invoice);
  }

  static async createWithItems(
    invoice: Omit<Transaction, 'id'>, 
    items: any[]
  ): Promise<Transaction> {
    const newInvoice = await this.create(invoice);
    
    // Update product stock
    for (const item of items) {
      await ProductService.updateStock(item.productId, item.quantity, 'subtract');
    }
    
    // Update customer stats if customer exists
    if (invoice.customer) {
      await CustomerService.updateStats(invoice.customer, invoice.amount);
    }
    
    return newInvoice;
  }

  static async getTodaysSales(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysInvoices = await this.getByDateRange(today, tomorrow);
    return todaysInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  }

  static async getTodaysTransactionCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysInvoices = await this.getByDateRange(today, tomorrow);
    return todaysInvoices.length;
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
    const allCustomers = await CustomerService.getAll();
    const totalCustomers = allCustomers.length;
    
    // Get monthly revenue
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const monthlyInvoices = await InvoiceService.getByDateRange(currentMonth, nextMonth);
    const monthlyRevenue = monthlyInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    
    // Get recent transactions
    const recentTransactions = (await InvoiceService.getAll()).slice(0, 10);
    
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
export class BarcodeService {
  static async getByBarcode(barcode: string): Promise<Product | null> {
    const mappings = storage.query<BarcodeMapping>('barcodeMappings', 
      (mapping) => mapping.barcode === barcode && mapping.isActive
    );
    
    if (!mappings[0]) return null;
    
    return await ProductService.getById(mappings[0].productId);
  }

  static async createMapping(barcode: string, productId: string): Promise<BarcodeMapping> {
    return storage.create<BarcodeMapping>('barcodeMappings', {
      barcode,
      productId,
      isActive: true,
      createdAt: new Date(),
    });
  }

  static async deleteMapping(id: string): Promise<boolean> {
    return storage.delete('barcodeMappings', id);
  }
}
