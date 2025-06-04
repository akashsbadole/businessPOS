import { create } from 'zustand';
import { dbOperations, initializeDatabase } from '../lib/database';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  min_stock: number;
  hsn: string;
  tax_rate: number;
  barcode?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  tier: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: string;
  invoice_number: string;
  customer_id?: string;
  subtotal: number;
  discount: number;
  tax_amount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  amount_received: number;
  change_amount: number;
  pending_amount: number;
  notes?: string;
  location_id: string;
  created_by?: string;
  created_at: string;
}

interface DatabaseState {
  // Data
  products: Product[];
  customers: Customer[];
  transactions: Transaction[];
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initializeDB: () => Promise<void>;
  
  // Product actions
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'is_active'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Customer actions
  loadCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'loyalty_points' | 'tier' | 'status' | 'created_at' | 'updated_at'>) => Promise<string>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  
  // Transaction actions
  saveTransaction: (transaction: any, items: any[]) => Promise<{ transactionId: string; invoiceNumber: string }>;
  
  // Settings actions
  getSetting: (key: string) => Promise<string | undefined>;
  setSetting: (key: string, value: string) => Promise<void>;
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  // Initial state
  products: [],
  customers: [],
  transactions: [],
  isLoading: false,
  isInitialized: false,
  error: null,

  // Initialize database
  initializeDB: async () => {
    try {
      set({ isLoading: true, error: null });
      await initializeDatabase();
      await get().loadProducts();
      await get().loadCustomers();
      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      console.error('Database initialization failed:', error);
      set({ error: 'Failed to initialize database', isLoading: false });
    }
  },

  // Product actions
  loadProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const products = await dbOperations.getProducts();
      set({ products: products as Product[], isLoading: false });
    } catch (error) {
      console.error('Failed to load products:', error);
      set({ error: 'Failed to load products', isLoading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      set({ isLoading: true, error: null });
      const id = await dbOperations.addProduct(productData);
      await get().loadProducts(); // Reload products
      set({ isLoading: false });
      return id;
    } catch (error) {
      console.error('Failed to add product:', error);
      set({ error: 'Failed to add product', isLoading: false });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      set({ isLoading: true, error: null });
      await dbOperations.updateProduct(id, productData);
      await get().loadProducts(); // Reload products
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to update product:', error);
      set({ error: 'Failed to update product', isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await dbOperations.deleteProduct(id);
      await get().loadProducts(); // Reload products
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to delete product:', error);
      set({ error: 'Failed to delete product', isLoading: false });
      throw error;
    }
  },

  // Customer actions
  loadCustomers: async () => {
    try {
      set({ isLoading: true, error: null });
      const customers = await dbOperations.getCustomers();
      set({ customers: customers as Customer[], isLoading: false });
    } catch (error) {
      console.error('Failed to load customers:', error);
      set({ error: 'Failed to load customers', isLoading: false });
    }
  },

  addCustomer: async (customerData) => {
    try {
      set({ isLoading: true, error: null });
      const id = await dbOperations.addCustomer(customerData);
      await get().loadCustomers(); // Reload customers
      set({ isLoading: false });
      return id;
    } catch (error) {
      console.error('Failed to add customer:', error);
      set({ error: 'Failed to add customer', isLoading: false });
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      set({ isLoading: true, error: null });
      // Add update customer logic here
      await get().loadCustomers(); // Reload customers
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to update customer:', error);
      set({ error: 'Failed to update customer', isLoading: false });
      throw error;
    }
  },

  // Transaction actions
  saveTransaction: async (transaction, items) => {
    try {
      set({ isLoading: true, error: null });
      const result = await dbOperations.saveTransaction(transaction, items);
      await get().loadProducts(); // Reload products to update stock
      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error('Failed to save transaction:', error);
      set({ error: 'Failed to save transaction', isLoading: false });
      throw error;
    }
  },

  // Settings actions
  getSetting: async (key) => {
    try {
      return await dbOperations.getSetting(key);
    } catch (error) {
      console.error('Failed to get setting:', error);
      return undefined;
    }
  },

  setSetting: async (key, value) => {
    try {
      await dbOperations.setSetting(key, value);
    } catch (error) {
      console.error('Failed to set setting:', error);
      throw error;
    }
  },
}));
