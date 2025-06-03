export interface Subscription {
  id: string;
  userId: string;
  planType: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  paymentMethod: 'upi' | 'paypal' | 'bank_transfer';
  transactionId?: string;
  amount: number;
  currency: string;
  features: string[];
  maxUsers: number;
  maxProducts: number;
  maxTransactions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface License {
  id: string;
  licenseKey: string;
  subscriptionId: string;
  userId: string;
  deviceId?: string;
  isActive: boolean;
  activatedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRequest {
  planType: 'basic' | 'premium' | 'enterprise';
  duration: 'monthly' | 'yearly';
  email: string;
  name: string;
  paymentMethod: 'upi' | 'paypal';
  transactionId?: string; // For UPI payments
  amount: number;
  currency: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  description: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
  maxUsers: number;
  maxProducts: number;
  maxTransactions: number;
  popular?: boolean;
}

export interface UPIPayment {
  upiId: string;
  qrCode: string;
  amount: number;
  reference: string;
  instructions: string[];
}

export interface PayPalPayment {
  clientId: string;
  amount: number;
  currency: string;
  description: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  telegram?: string;
  supportHours: string;
}

// Subscription validation result
export interface SubscriptionValidation {
  isValid: boolean;
  subscription?: Subscription;
  license?: License;
  daysRemaining?: number;
  message: string;
  redirectToPayment?: boolean;
}
