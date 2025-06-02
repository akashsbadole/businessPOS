import { 
  Product, 
  Customer, 
  Category, 
  Supplier, 
  PurchaseOrder, 
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
  BusinessSettings
} from '../types/pos';

// In-memory storage
class InMemoryStorage {
  private data: { [key: string]: any[] } = {
    products: [],
    customers: [],
    categories: [],
    suppliers: [],
    purchaseOrders: [],
    paymentMethods: [],
    expenses: [],
    expenseCategories: [],
    loyaltyProgram: [],
    loyaltyTransactions: [],
    promotions: [],
    staffAttendance: [],
    barcodeMappings: [],
    invoiceTemplates: [],
    inventoryTransactions: [],
    invoices: [],
    businessSettings: [],
  };

  // Generic CRUD operations
  create<T extends { id: string }>(table: string, item: Omit<T, 'id'> & { id?: string }): T {
    const id = item.id || this.generateId();
    const newItem = { ...item, id } as T;
    this.data[table].push(newItem);
    this.saveToLocalStorage();
    return newItem;
  }

  getAll<T>(table: string): T[] {
    return [...this.data[table]];
  }

  getById<T extends { id: string }>(table: string, id: string): T | null {
    return this.data[table].find(item => item.id === id) || null;
  }

  update<T extends { id: string }>(table: string, id: string, updates: Partial<T>): T | null {
    const index = this.data[table].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.data[table][index] = { ...this.data[table][index], ...updates };
    this.saveToLocalStorage();
    return this.data[table][index];
  }

  delete(table: string, id: string): boolean {
    const index = this.data[table].findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this.data[table].splice(index, 1);
    this.saveToLocalStorage();
    return true;
  }

  query<T>(table: string, predicate: (item: T) => boolean): T[] {
    return this.data[table].filter(predicate);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('pos-data', JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('pos-data');
      if (saved) {
        this.data = JSON.parse(saved);
      } else {
        this.initializeSampleData();
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      this.initializeSampleData();
    }
  }

  private initializeSampleData(): void {
    // Initialize with sample data
    const sampleCategories: Category[] = [
      { id: '1', name: 'Grocery', description: 'Daily grocery items', isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'Dairy', description: 'Milk and dairy products', isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: '3', name: 'Snacks', description: 'Snacks and confectionery', isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: '4', name: 'Beverages', description: 'Drinks and beverages', isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
    ];

    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Tata Salt 1kg',
        price: 20,
        category: 'grocery',
        stock: 100,
        hsn: '2501',
        costPrice: 18,
        sellingPrice: 20,
        taxRate: 5,
        cgstRate: 2.5,
        sgstRate: 2.5,
        igstRate: 0,
        description: 'Premium quality iodized salt',
        barcode: '8901030001234',
      },
      {
        id: '2',
        name: 'Aashirvaad Atta 5kg',
        price: 250,
        category: 'grocery',
        stock: 50,
        hsn: '1101',
        costPrice: 220,
        sellingPrice: 250,
        taxRate: 5,
        cgstRate: 2.5,
        sgstRate: 2.5,
        igstRate: 0,
        description: 'Whole wheat flour',
        barcode: '8901030005678',
      },
      {
        id: '3',
        name: 'Amul Butter 100g',
        price: 50,
        category: 'dairy',
        stock: 75,
        hsn: '0405',
        costPrice: 45,
        sellingPrice: 50,
        taxRate: 12,
        cgstRate: 6,
        sgstRate: 6,
        igstRate: 0,
        description: 'Fresh butter from Amul',
        barcode: '8901030009012',
      },
    ];

    const sampleCustomers: Customer[] = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        phone: '+91 9876543210',
        email: 'rajesh@example.com',
        address: '123 Residential Area, Sector 1',
        gstin: '',
        totalOrders: 0,
        totalSpent: 0,
        status: 'active',
      },
      {
        id: '2',
        name: 'Priya Sharma',
        phone: '+91 9876543211',
        email: 'priya@example.com',
        address: '456 Housing Society, Block B',
        gstin: '',
        totalOrders: 0,
        totalSpent: 0,
        status: 'active',
      },
    ];

    const sampleSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'ABC Distributors',
        contactPerson: 'John Doe',
        phone: '+91 9876543210',
        email: 'john@abcdist.com',
        address: '123 Main Street, Business District',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        gstin: '27AAAAA0000A1Z5',
        paymentTerms: '30',
        creditLimit: 100000,
        currentBalance: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const samplePaymentMethods: PaymentMethod[] = [
      { id: '1', name: 'Cash', type: 'cash', isActive: true, charges: 0, chargeType: 'fixed', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'UPI', type: 'upi', isActive: true, charges: 0, chargeType: 'fixed', createdAt: new Date(), updatedAt: new Date() },
      { id: '3', name: 'Credit Card', type: 'card', isActive: true, charges: 2, chargeType: 'percentage', createdAt: new Date(), updatedAt: new Date() },
    ];

    const businessSettings: BusinessSettings = {
      businessName: 'Your Business Name',
      address: 'Your Business Address',
      city: 'Your City',
      state: 'Your State',
      pincode: '123456',
      phone: '+91 9876543210',
      email: 'contact@yourbusiness.com',
      gstin: '27XXXXXXXX1ZX',
      invoicePrefix: 'INV',
      defaultTaxRate: 18,
      defaultCgstRate: 9,
      defaultSgstRate: 9,
      defaultIgstRate: 0,
      currencySymbol: '₹',
    };

    // Initialize data
    this.data.categories = sampleCategories;
    this.data.products = sampleProducts;
    this.data.customers = sampleCustomers;
    this.data.suppliers = sampleSuppliers;
    this.data.paymentMethods = samplePaymentMethods;
    this.data.businessSettings = [businessSettings];

    this.saveToLocalStorage();
  }

  // Clear all data
  clearAll(): void {
    this.data = {
      products: [],
      customers: [],
      categories: [],
      suppliers: [],
      purchaseOrders: [],
      paymentMethods: [],
      expenses: [],
      expenseCategories: [],
      loyaltyProgram: [],
      loyaltyTransactions: [],
      promotions: [],
      staffAttendance: [],
      barcodeMappings: [],
      invoiceTemplates: [],
      inventoryTransactions: [],
      invoices: [],
      businessSettings: [],
    };
    this.saveToLocalStorage();
  }

  // Export data
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  // Import data
  importData(jsonData: string): void {
    try {
      this.data = JSON.parse(jsonData);
      this.saveToLocalStorage();
    } catch (error) {
      throw new Error('Invalid JSON data');
    }
  }
}

// Create singleton instance
export const storage = new InMemoryStorage();

// Initialize on module load
if (typeof window !== 'undefined') {
  storage.loadFromLocalStorage();
}
