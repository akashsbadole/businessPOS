export interface InvoiceElement {
  id: string;
  type: 'text' | 'image' | 'table' | 'line' | 'qr-code' | 'barcode' | 'business-info' | 'customer-info' | 'items-table' | 'totals' | 'footer';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  styles?: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    padding?: number;
    margin?: number;
  };
  properties?: {
    // For text elements
    placeholder?: string;
    multiline?: boolean;
    
    // For image elements
    src?: string;
    alt?: string;
    
    // For table elements
    columns?: string[];
    rows?: string[][];
    
    // For QR/Barcode elements
    data?: string;
    format?: string;
    
    // For business/customer info
    fields?: string[];
  };
  locked?: boolean;
  visible?: boolean;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'receipt' | 'invoice' | 'estimate' | 'custom';
  paperSize: 'A4' | 'A5' | 'thermal-80mm' | 'thermal-58mm' | 'custom';
  orientation: 'portrait' | 'landscape';
  dimensions: {
    width: number;
    height: number;
    unit: 'mm' | 'px' | 'in';
  };
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  elements: InvoiceElement[];
  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  tags?: string[];
}

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  template: Omit<InvoiceTemplate, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>;
}

export interface DragItem {
  id: string;
  type: InvoiceElement['type'];
  name: string;
  icon: string;
  defaultProps: Partial<InvoiceElement>;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  businessInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
    gstin?: string;
  };
  customerInfo: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    gstin?: string;
  };
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    rate: number;
    amount: number;
    tax?: number;
    discount?: number;
  }>;
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  notes?: string;
  terms?: string;
}

export interface TemplateValidationError {
  elementId: string;
  field: string;
  message: string;
}

export interface TemplateExportOptions {
  format: 'pdf' | 'png' | 'jpeg' | 'svg';
  quality?: number;
  dpi?: number;
  includeBleed?: boolean;
}
