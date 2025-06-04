// Internationalization (i18n) utility for multilingual support
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'mr' | 'kn';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', rtl: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', rtl: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', rtl: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', rtl: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', rtl: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', rtl: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', rtl: false },
];

// Translation keys and their values for different languages
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.total': 'Total',
    'common.subtotal': 'Subtotal',
    'common.discount': 'Discount',
    'common.tax': 'Tax',
    'common.amount': 'Amount',
    'common.quantity': 'Quantity',
    'common.price': 'Price',
    'common.name': 'Name',
    'common.description': 'Description',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.status': 'Status',
    'common.actions': 'Actions',

    // POS
    'pos.title': 'Point of Sale',
    'pos.newBill': 'New Bill',
    'pos.addProduct': 'Add Product',
    'pos.searchProduct': 'Search Product',
    'pos.cart': 'Cart',
    'pos.checkout': 'Checkout',
    'pos.payment': 'Payment',
    'pos.cash': 'Cash',
    'pos.card': 'Card',
    'pos.upi': 'UPI',
    'pos.invoice': 'Invoice',
    'pos.receipt': 'Receipt',
    'pos.print': 'Print',
    'pos.download': 'Download',

    // Products
    'products.title': 'Products',
    'products.addProduct': 'Add Product',
    'products.editProduct': 'Edit Product',
    'products.productName': 'Product Name',
    'products.category': 'Category',
    'products.stock': 'Stock',
    'products.lowStock': 'Low Stock',
    'products.outOfStock': 'Out of Stock',
    'products.barcode': 'Barcode',
    'products.hsn': 'HSN Code',

    // Customers
    'customers.title': 'Customers',
    'customers.addCustomer': 'Add Customer',
    'customers.customerName': 'Customer Name',
    'customers.phone': 'Phone',
    'customers.email': 'Email',
    'customers.address': 'Address',
    'customers.loyaltyPoints': 'Loyalty Points',

    // Reports
    'reports.title': 'Reports',
    'reports.salesReport': 'Sales Report',
    'reports.inventoryReport': 'Inventory Report',
    'reports.customerReport': 'Customer Report',
    'reports.gstReport': 'GST Report',
    'reports.dailySales': 'Daily Sales',
    'reports.monthlySales': 'Monthly Sales',

    // GST
    'gst.title': 'GST Management',
    'gst.gstNumber': 'GST Number',
    'gst.cgst': 'CGST',
    'gst.sgst': 'SGST',
    'gst.igst': 'IGST',
    'gst.gstr1': 'GSTR-1',
    'gst.gstr3b': 'GSTR-3B',

    // Settings
    'settings.title': 'Settings',
    'settings.businessInfo': 'Business Information',
    'settings.language': 'Language',
    'settings.currency': 'Currency',
    'settings.theme': 'Theme',
    'settings.printer': 'Printer Settings',

    // Messages
    'messages.productAdded': 'Product added successfully',
    'messages.productUpdated': 'Product updated successfully',
    'messages.productDeleted': 'Product deleted successfully',
    'messages.customerAdded': 'Customer added successfully',
    'messages.saleCompleted': 'Sale completed successfully',
    'messages.paymentReceived': 'Payment received successfully',
    'messages.invoicePrinted': 'Invoice printed successfully',
  },

  hi: {
    // Common
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.add': 'जोड़ें',
    'common.search': 'खोजें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.warning': 'चेतावनी',
    'common.info': 'जानकारी',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    'common.ok': 'ठीक है',
    'common.close': 'बंद करें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.total': 'कुल',
    'common.subtotal': 'उप-योग',
    'common.discount': 'छूट',
    'common.tax': 'कर',
    'common.amount': 'राशि',
    'common.quantity': 'मात्रा',
    'common.price': 'मूल्य',
    'common.name': 'नाम',
    'common.description': 'विवरण',
    'common.date': 'दिनांक',
    'common.time': 'समय',
    'common.status': 'स्थिति',
    'common.actions': 'कार्य',

    // POS
    'pos.title': 'पॉइंट ऑफ सेल',
    'pos.newBill': 'नया बिल',
    'pos.addProduct': 'उत्पाद जोड़ें',
    'pos.searchProduct': 'उत्पाद खोजें',
    'pos.cart': 'कार्ट',
    'pos.checkout': 'चेकआउट',
    'pos.payment': 'भुगतान',
    'pos.cash': 'नकद',
    'pos.card': 'कार्ड',
    'pos.upi': 'यूपीआई',
    'pos.invoice': 'चालान',
    'pos.receipt': 'रसीद',
    'pos.print': 'प्रिंट',
    'pos.download': 'डाउनलोड',

    // Products
    'products.title': 'उत्पाद',
    'products.addProduct': 'उत्पाद जोड़ें',
    'products.editProduct': 'उत्पाद संपादित करें',
    'products.productName': 'उत्पाद का नाम',
    'products.category': 'श्रेणी',
    'products.stock': 'स्टॉक',
    'products.lowStock': 'कम स्टॉक',
    'products.outOfStock': 'स्टॉक समाप्त',
    'products.barcode': 'बारकोड',
    'products.hsn': 'एचएसएन कोड',

    // Customers
    'customers.title': 'ग्राहक',
    'customers.addCustomer': 'ग्राहक जोड़ें',
    'customers.customerName': 'ग्राहक का नाम',
    'customers.phone': 'फोन',
    'customers.email': 'ईमेल',
    'customers.address': 'पता',
    'customers.loyaltyPoints': 'लॉयल्टी पॉइंट्स',

    // Reports
    'reports.title': 'रिपोर्ट',
    'reports.salesReport': 'बिक्री रिपोर्ट',
    'reports.inventoryReport': 'इन्वेंटरी रिपोर्ट',
    'reports.customerReport': 'ग्राहक रिपोर्ट',
    'reports.gstReport': 'जीएसटी रिपोर्ट',
    'reports.dailySales': 'दैनिक बिक्री',
    'reports.monthlySales': 'मासिक बिक्री',

    // GST
    'gst.title': 'जीएसटी प्रबंधन',
    'gst.gstNumber': 'जीएसटी नंबर',
    'gst.cgst': 'सीजीएसटी',
    'gst.sgst': 'एसजीएसटी',
    'gst.igst': 'आईजीएसटी',
    'gst.gstr1': 'जीएसटीआर-1',
    'gst.gstr3b': 'जीएसटीआर-3बी',

    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.businessInfo': 'व्यापार की जानकारी',
    'settings.language': 'भाषा',
    'settings.currency': 'मुद्रा',
    'settings.theme': 'थीम',
    'settings.printer': 'प्रिंटर सेटिंग्स',

    // Messages
    'messages.productAdded': 'उत्पाद सफलतापूर्वक जोड़ा गया',
    'messages.productUpdated': 'उत्पाद सफलतापूर्वक अपडेट किया गया',
    'messages.productDeleted': 'उत्पाद सफलतापूर्वक हटाया गया',
    'messages.customerAdded': 'ग्राहक सफलतापूर्वक जोड़ा गया',
    'messages.saleCompleted': 'बिक्री सफलतापूर्वक पूर्ण',
    'messages.paymentReceived': 'भुगतान सफलतापूर्वक प्राप्त',
    'messages.invoicePrinted': 'चालान सफलतापूर्वक प्रिंट किया गया',
  },

  // Add other languages with similar structure
  ta: {
    'common.save': 'சேமி',
    'common.cancel': 'ரத்து செய்',
    'pos.title': 'விற்பனை புள்ளி',
    'products.title': 'பொருட்கள்',
    'customers.title': 'வாடிக்கையாளர்கள்',
    // ... add more Tamil translations
  },

  te: {
    'common.save': 'సేవ్ చేయండి',
    'common.cancel': 'రద్దు చేయండి',
    'pos.title': 'పాయింట్ ఆఫ్ సేల్',
    'products.title': 'ఉత్పత్తులు',
    'customers.title': 'కస్టమర్లు',
    // ... add more Telugu translations
  },

  bn: {
    'common.save': 'সংরক্ষণ করুন',
    'common.cancel': 'বাতিল করুন',
    'pos.title': 'পয়েন্ট অফ সেল',
    'products.title': 'পণ্যসমূহ',
    'customers.title': 'গ্রাহকগণ',
    // ... add more Bengali translations
  },

  gu: {
    'common.save': 'સેવ કરો',
    'common.cancel': 'રદ કરો',
    'pos.title': 'પોઇન્ટ ઓફ સેલ',
    'products.title': 'ઉત્પાદનો',
    'customers.title': 'ગ્રાહકો',
    // ... add more Gujarati translations
  },

  mr: {
    'common.save': 'जतन करा',
    'common.cancel': 'रद्द करा',
    'pos.title': 'पॉइंट ऑफ सेल',
    'products.title': 'उत्पादने',
    'customers.title': 'ग्राहक',
    // ... add more Marathi translations
  },

  kn: {
    'common.save': 'ಉಳಿಸಿ',
    'common.cancel': 'ರದ್ದುಗೊಳಿಸಿ',
    'pos.title': 'ಪಾಯಿಂಟ್ ಆಫ್ ಸೇಲ್',
    'products.title': 'ಉತ್ಪನ್ನಗಳು',
    'customers.title': 'ಗ್ರಾಹಕರು',
    // ... add more Kannada translations
  },
};

// i18n utility class
export class I18n {
  private static currentLanguage: Language = 'en';

  static setLanguage(language: Language): void {
    this.currentLanguage = language;
    localStorage.setItem('businesspos_language', language);
    
    // Update document direction for RTL languages
    const config = supportedLanguages.find(lang => lang.code === language);
    if (config?.rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }

  static getCurrentLanguage(): Language {
    const saved = localStorage.getItem('businesspos_language') as Language;
    return saved && supportedLanguages.find(lang => lang.code === saved) ? saved : 'en';
  }

  static translate(key: string, fallback?: string): string {
    const translation = translations[this.currentLanguage]?.[key];
    return translation || fallback || key;
  }

  static t = this.translate; // Shorthand

  static formatNumber(num: number, locale?: string): string {
    const currentLocale = locale || this.getLocale();
    return new Intl.NumberFormat(currentLocale).format(num);
  }

  static formatCurrency(amount: number, currency: string = 'INR', locale?: string): string {
    const currentLocale = locale || this.getLocale();
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  static formatDate(date: Date, locale?: string): string {
    const currentLocale = locale || this.getLocale();
    return new Intl.DateTimeFormat(currentLocale).format(date);
  }

  private static getLocale(): string {
    const localeMap: Record<Language, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      mr: 'mr-IN',
      kn: 'kn-IN',
    };
    return localeMap[this.currentLanguage] || 'en-US';
  }
}

// Initialize language on load
I18n.setLanguage(I18n.getCurrentLanguage());
