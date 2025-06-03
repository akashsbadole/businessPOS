export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  hsn: string;
  image?: string;
  barcode?: string;
  description?: string;
  costPrice?: number;
  sellingPrice?: number;
  taxRate?: number;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  // Additional properties for Turso compatibility
  cost?: number;
  minStock?: number;
  maxStock?: number;
  unit?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem extends Product {
  quantity: number;
  discount?: number;
  taxAmount?: number;
  total: number;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  date: Date;
  customer: string | null;
  customerId?: string;
  amount?: number;
  total: number;
  paymentMethod?: string;
  paymentMode?: string;
  status: "completed" | "pending" | "cancelled";
  items?: any[]; // More flexible to accept different item structures
  subtotal?: number;
  discount?: number;
  taxAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  roundOff?: number;
  // Additional properties for Turso compatibility
  amountReceived?: number;
  change?: number;
  createdAt?: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  address?: string;
  gstin?: string;
  // Additional properties for Turso compatibility
  city?: string;
  state?: string;
  pincode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BusinessSettings {
  businessName: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  panNumber?: string;
  logo?: string;
  invoicePrefix: string;
  defaultTaxRate: number;
  defaultCgstRate: number;
  defaultSgstRate: number;
  defaultIgstRate: number;
  currencySymbol: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier" | "inventory";
  status: "active" | "inactive";
  permissions: string[]; // includes: 'pos', 'inventory', 'customers', 'reports', 'settings', 'users', 'invoice_templates'
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  panNumber?: string;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  paymentTerms: string;
  creditLimit: number;
  currentBalance: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplier?: Supplier;
  orderDate: Date;
  expectedDate?: Date;
  receivedDate?: Date;
  status: "pending" | "partial" | "received" | "cancelled";
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string;
  items?: PurchaseOrderItem[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitCost: number;
  receivedQuantity: number;
  taxRate: number;
  discount: number;
  total: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "cash" | "card" | "upi" | "bank_transfer" | "wallet" | "other";
  isActive: boolean;
  charges: number;
  chargeType: "percentage" | "fixed";
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  categoryId?: string;
  category?: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: string;
  receiptNumber?: string;
  vendorName?: string;
  date: Date;
  notes?: string;
  attachments?: string[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyProgram {
  id: string;
  customerId: string;
  customer?: Customer;
  points: number;
  totalEarned: number;
  totalRedeemed: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  joinDate: Date;
  lastActivity: Date;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  customer?: Customer;
  type: "earned" | "redeemed" | "expired" | "adjusted";
  points: number;
  referenceId?: string;
  description: string;
  createdAt: Date;
}

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed_amount" | "buy_x_get_y" | "loyalty_points";
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffAttendance {
  id: string;
  userId: string;
  user?: User;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  breakDuration: number;
  totalHours: number;
  overtime: number;
  status: "present" | "absent" | "half_day" | "holiday";
  notes?: string;
  createdAt: Date;
}

export interface BarcodeMapping {
  id: string;
  barcode: string;
  productId: string;
  product?: Product;
  isActive: boolean;
  createdAt: Date;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  template: any; // JSON template structure
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  product?: Product;
  type: "purchase" | "sale" | "return" | "adjustment" | "transfer";
  quantity: number;
  unitCost?: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  createdBy?: string;
  createdAt: Date;
}

// Dashboard and Analytics interfaces
export interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  lowStockItems: number;
  totalCustomers: number;
  monthlyRevenue: number;
  topSellingProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  recentTransactions: Transaction[];
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalTransactions: number;
  averageOrderValue: number;
  topProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
  salesByPaymentMethod: Array<{
    method: string;
    amount: number;
    count: number;
  }>;
}
