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
}

export interface CartItem extends Product {
  quantity: number;
  discount?: number;
  taxAmount?: number;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  date: string;
  customer: string | null;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'cancelled';
  items?: CartItem[];
  subtotal?: number;
  discount?: number;
  taxAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  roundOff?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  address?: string;
  gstin?: string;
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
  role: 'admin' | 'manager' | 'cashier' | 'inventory';
  status: 'active' | 'inactive';
  permissions: string[];
}