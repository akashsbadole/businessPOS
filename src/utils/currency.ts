/**
 * Currency Utilities
 * Helper functions for currency formatting and calculations
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

export const currencies: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", decimals: 2 },
  { code: "USD", symbol: "$", name: "US Dollar", decimals: 2 },
  { code: "EUR", symbol: "€", name: "Euro", decimals: 2 },
  { code: "GBP", symbol: "£", name: "British Pound", decimals: 2 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", decimals: 2 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", decimals: 2 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", decimals: 0 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", decimals: 2 },
];

/**
 * Format currency amount with symbol
 */
export function formatCurrency(
  amount: number | undefined | null,
  currencyCode: string = "INR",
  showSymbol: boolean = true
): string {
  // Handle null/undefined amounts
  if (amount === null || amount === undefined || isNaN(amount)) {
    amount = 0;
  }

  const currency =
    currencies.find((c) => c.code === currencyCode) || currencies[0];

  const formatted = amount.toFixed(currency.decimals);

  if (showSymbol) {
    return `${currency.symbol}${formatted}`;
  }

  return formatted;
}

/**
 * Format currency with locale-specific formatting
 */
export function formatCurrencyLocale(
  amount: number,
  currencyCode: string = "INR",
  locale: string = "en-IN"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    // Fallback to basic formatting
    return formatCurrency(amount, currencyCode);
  }
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and spaces, then parse
  const cleaned = currencyString.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Get currency by code
 */
export function getCurrency(code: string): Currency | undefined {
  return currencies.find((c) => c.code === code);
}

/**
 * Get currency symbol by code
 */
export function getCurrencySymbol(code: string): string {
  const currency = getCurrency(code);
  return currency ? currency.symbol : "₹";
}

/**
 * Calculate tax amount
 */
export function calculateTax(amount: number, taxRate: number): number {
  return amount * (taxRate / 100);
}

/**
 * Calculate total with tax
 */
export function calculateTotalWithTax(amount: number, taxRate: number): number {
  return amount + calculateTax(amount, taxRate);
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(
  amount: number,
  discountRate: number
): number {
  return amount * (discountRate / 100);
}

/**
 * Calculate amount after discount
 */
export function calculateAmountAfterDiscount(
  amount: number,
  discountRate: number
): number {
  return amount - calculateDiscount(amount, discountRate);
}

/**
 * Round to currency precision
 */
export function roundToCurrency(
  amount: number,
  currencyCode: string = "INR"
): number {
  const currency = getCurrency(currencyCode);
  const decimals = currency ? currency.decimals : 2;
  return Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Convert between currencies (simplified - in real app use exchange rates)
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number = 1
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  return roundToCurrency(amount * exchangeRate, toCurrency);
}

/**
 * Format number as Indian currency (with lakhs/crores)
 */
export function formatIndianCurrency(amount: number): string {
  const symbol = "₹";

  if (amount >= 10000000) {
    // 1 crore
    return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    // 1 lakh
    return `${symbol}${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    // 1 thousand
    return `${symbol}${(amount / 1000).toFixed(2)} K`;
  } else {
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Validate currency amount
 */
export function isValidCurrencyAmount(amount: string | number): boolean {
  const num = typeof amount === "string" ? parseCurrency(amount) : amount;
  return !isNaN(num) && num >= 0 && isFinite(num);
}

/**
 * Get default currency for country
 */
export function getDefaultCurrencyForCountry(country: string): string {
  const countryToCurrency: Record<string, string> = {
    India: "INR",
    "United States": "USD",
    "United Kingdom": "GBP",
    Canada: "CAD",
    Australia: "AUD",
    Japan: "JPY",
    China: "CNY",
    Germany: "EUR",
    France: "EUR",
    Italy: "EUR",
    Spain: "EUR",
  };

  return countryToCurrency[country] || "INR";
}

/**
 * Format currency for display in tables/lists
 */
export function formatCurrencyCompact(
  amount: number,
  currencyCode: string = "INR"
): string {
  if (currencyCode === "INR") {
    return formatIndianCurrency(amount);
  }

  return formatCurrency(amount, currencyCode);
}
