import React from "react";

export type Language = "en" | "hi" | "ta" | "te" | "bn" | "gu" | "mr" | "kn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.search": "Search",
    "common.total": "Total",
    "common.subtotal": "Subtotal",
    "common.tax": "Tax",
    "common.discount": "Discount",
    "common.quantity": "Quantity",
    "common.price": "Price",
    "common.amount": "Amount",
    "common.date": "Date",
    "common.name": "Name",
    "common.phone": "Phone",
    "common.email": "Email",
    "common.address": "Address",
    
    // POS
    "pos.title": "Point of Sale",
    "pos.newBill": "New Bill",
    "pos.addItem": "Add Item",
    "pos.customer": "Customer",
    "pos.payment": "Payment",
    "pos.cash": "Cash",
    "pos.card": "Card",
    "pos.upi": "UPI",
    "pos.change": "Change",
    "pos.pending": "Pending",
    "pos.paid": "Paid",
    "pos.partial": "Partial",
    "pos.printBill": "Print Bill",
    "pos.saveBill": "Save Bill",
    
    // Invoice
    "invoice.number": "Invoice Number",
    "invoice.date": "Invoice Date",
    "invoice.customer": "Customer",
    "invoice.items": "Items",
    "invoice.gst": "GST",
    "invoice.cgst": "CGST",
    "invoice.sgst": "SGST",
    "invoice.igst": "IGST",
    "invoice.grandTotal": "Grand Total",
    "invoice.amountInWords": "Amount in Words",
    "invoice.thankyou": "Thank you for your business!",
    
    // Business
    "business.name": "Business Name",
    "business.address": "Business Address",
    "business.phone": "Business Phone",
    "business.email": "Business Email",
    "business.gstin": "GSTIN",
    
    // Messages
    "message.itemAdded": "Item added to cart",
    "message.billSaved": "Bill saved successfully",
    "message.paymentComplete": "Payment completed",
    "message.error": "An error occurred",
    "message.success": "Operation successful",
  },
  
  hi: {
    // Common
    "common.save": "सेव करें",
    "common.cancel": "रद्द करें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.add": "जोड़ें",
    "common.search": "खोजें",
    "common.total": "कुल",
    "common.subtotal": "उप-योग",
    "common.tax": "कर",
    "common.discount": "छूट",
    "common.quantity": "मात्रा",
    "common.price": "मूल्य",
    "common.amount": "राशि",
    "common.date": "दिनांक",
    "common.name": "नाम",
    "common.phone": "फोन",
    "common.email": "ईमेल",
    "common.address": "पता",
    
    // POS
    "pos.title": "बिक्री केंद्र",
    "pos.newBill": "नया बिल",
    "pos.addItem": "आइटम जोड़ें",
    "pos.customer": "ग्राहक",
    "pos.payment": "भुगतान",
    "pos.cash": "नकद",
    "pos.card": "कार्ड",
    "pos.upi": "यूपीआई",
    "pos.change": "वापसी",
    "pos.pending": "बकाया",
    "pos.paid": "भुगतान हो गया",
    "pos.partial": "आंशिक",
    "pos.printBill": "बिल प्रिंट करें",
    "pos.saveBill": "बिल सेव करें",
    
    // Invoice
    "invoice.number": "बिल संख्या",
    "invoice.date": "बिल दिनांक",
    "invoice.customer": "ग्राहक",
    "invoice.items": "वस्तुएं",
    "invoice.gst": "जीएसटी",
    "invoice.cgst": "सीजीएसटी",
    "invoice.sgst": "एसजीएसटी",
    "invoice.igst": "आईजीएसटी",
    "invoice.grandTotal": "कुल योग",
    "invoice.amountInWords": "शब्दों में राशि",
    "invoice.thankyou": "आपके व्यापार के लिए धन्यवाद!",
    
    // Business
    "business.name": "व्यापार का नाम",
    "business.address": "व्यापार का पता",
    "business.phone": "व्यापार फोन",
    "business.email": "व्यापार ईमेल",
    "business.gstin": "जीएसटीआईएन",
    
    // Messages
    "message.itemAdded": "आइटम कार्ट में जोड़ा गया",
    "message.billSaved": "बिल सफलतापूर्वक सेव हुआ",
    "message.paymentComplete": "भुगतान पूरा हुआ",
    "message.error": "एक त्रुटि हुई",
    "message.success": "ऑपरेशन सफल",
  },
  
  ta: {
    // Common
    "common.save": "சேமி",
    "common.cancel": "ரத்து செய்",
    "common.delete": "நீக்கு",
    "common.edit": "திருத்து",
    "common.add": "சேர்",
    "common.search": "தேடு",
    "common.total": "மொத்தம்",
    "common.subtotal": "துணை மொத்தம்",
    "common.tax": "வரி",
    "common.discount": "தள்ளுபடி",
    "common.quantity": "அளவு",
    "common.price": "விலை",
    "common.amount": "தொகை",
    "common.date": "தேதி",
    "common.name": "பெயர்",
    "common.phone": "தொலைபேசி",
    "common.email": "மின்னஞ்சல்",
    "common.address": "முகவரி",
    
    // POS
    "pos.title": "விற்பனை மையம்",
    "pos.newBill": "புதிய பில்",
    "pos.addItem": "பொருள் சேர்",
    "pos.customer": "வாடிக்கையாளர்",
    "pos.payment": "பணம்",
    "pos.cash": "பணம்",
    "pos.card": "அட்டை",
    "pos.upi": "யூபிஐ",
    "pos.change": "மாற்றம்",
    "pos.pending": "நிலுவை",
    "pos.paid": "செலுத்தப்பட்டது",
    "pos.partial": "பகுதி",
    "pos.printBill": "பில் அச்சிடு",
    "pos.saveBill": "பில் சேமி",
    
    // Invoice
    "invoice.number": "பில் எண்",
    "invoice.date": "பில் தேதி",
    "invoice.customer": "வாடிக்கையாளர்",
    "invoice.items": "பொருட்கள்",
    "invoice.gst": "ஜிஎஸ்டி",
    "invoice.cgst": "சிஜிஎஸ்டி",
    "invoice.sgst": "எஸ்ஜிஎஸ்டி",
    "invoice.igst": "ஐஜிஎஸ்டி",
    "invoice.grandTotal": "மொத்த தொகை",
    "invoice.amountInWords": "வார்த்தைகளில் தொகை",
    "invoice.thankyou": "உங்கள் வணிகத்திற்கு நன்றி!",
    
    // Business
    "business.name": "வணிக பெயர்",
    "business.address": "வணிக முகவரி",
    "business.phone": "வணிக தொலைபேசி",
    "business.email": "வணிக மின்னஞ்சல்",
    "business.gstin": "ஜிஎஸ்டிஐஎன்",
    
    // Messages
    "message.itemAdded": "பொருள் கார்ட்டில் சேர்க்கப்பட்டது",
    "message.billSaved": "பில் வெற்றிகரமாக சேமிக்கப்பட்டது",
    "message.paymentComplete": "பணம் முடிந்தது",
    "message.error": "ஒரு பிழை ஏற்பட்டது",
    "message.success": "செயல்பாடு வெற்றிகரமானது",
  },
  
  // Add more languages as needed
  te: {}, // Telugu
  bn: {}, // Bengali
  gu: {}, // Gujarati
  mr: {}, // Marathi
  kn: {}, // Kannada
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = React.useState<Language>(() => {
    const saved = localStorage.getItem("pos-language");
    return (saved as Language) || "en";
  });

  React.useEffect(() => {
    localStorage.setItem("pos-language", language);
  }, [language]);

  const t = React.useCallback((key: string, params?: { [key: string]: string | number }) => {
    const dict = translations[language] || translations.en;
    let text = dict[key as keyof typeof dict] || key;
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
      });
    }
    
    return text;
  }, [language]);

  const formatCurrency = React.useCallback((amount: number) => {
    const locale = {
      en: "en-IN",
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      bn: "bn-IN",
      gu: "gu-IN",
      mr: "mr-IN",
      kn: "kn-IN",
    }[language] || "en-IN";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  }, [language]);

  const formatDate = React.useCallback((date: Date) => {
    const locale = {
      en: "en-IN",
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      bn: "bn-IN",
      gu: "gu-IN",
      mr: "mr-IN",
      kn: "kn-IN",
    }[language] || "en-IN";

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    formatCurrency,
    formatDate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Language selector component
export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  ];

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="px-3 py-1 border rounded-md text-sm"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
};
