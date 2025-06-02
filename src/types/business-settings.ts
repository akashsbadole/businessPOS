/**
 * Business Settings Types
 * For storing business information used in invoices
 */

export interface BusinessSettings {
  id: string;
  // Business Information
  businessName: string;
  businessType: string;
  tagline?: string;
  
  // Contact Information
  email: string;
  phone: string;
  website?: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Tax Information
  gstNumber?: string;
  panNumber?: string;
  taxId?: string;
  
  // Banking Information
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  
  // Invoice Settings
  invoicePrefix: string;
  invoiceStartNumber: number;
  currency: string;
  currencySymbol: string;
  
  // Terms and Conditions
  paymentTerms: string;
  termsAndConditions?: string;
  notes?: string;
  
  // Logo and Branding
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface BusinessSettingsFormData {
  // Business Information
  businessName: string;
  businessType: string;
  tagline: string;
  
  // Contact Information
  email: string;
  phone: string;
  website: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Tax Information
  gstNumber: string;
  panNumber: string;
  taxId: string;
  
  // Banking Information
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  
  // Invoice Settings
  invoicePrefix: string;
  invoiceStartNumber: number;
  currency: string;
  currencySymbol: string;
  
  // Terms and Conditions
  paymentTerms: string;
  termsAndConditions: string;
  notes: string;
  
  // Branding
  primaryColor: string;
  secondaryColor: string;
}

export const defaultBusinessSettings: Partial<BusinessSettingsFormData> = {
  businessType: 'Retail',
  country: 'India',
  currency: 'INR',
  currencySymbol: '₹',
  invoicePrefix: 'INV',
  invoiceStartNumber: 1,
  paymentTerms: 'Net 30 days',
  primaryColor: '#2563eb',
  secondaryColor: '#64748b',
};

export const businessTypes = [
  'Retail',
  'Wholesale',
  'Service',
  'Manufacturing',
  'Restaurant',
  'Healthcare',
  'Education',
  'Technology',
  'Consulting',
  'Other',
];

export const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

export const paymentTermsOptions = [
  'Due on Receipt',
  'Net 15 days',
  'Net 30 days',
  'Net 45 days',
  'Net 60 days',
  'Net 90 days',
  'Custom',
];
