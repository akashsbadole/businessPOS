/**
 * Utility to suppress specific React warnings that come from third-party libraries
 * This is specifically for Recharts defaultProps warnings that we cannot control
 */

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

// List of warning messages to suppress
const suppressedWarnings = [
  'Support for defaultProps will be removed from function components',
  'XAxis: Support for defaultProps',
  'YAxis: Support for defaultProps',
  'CartesianGrid: Support for defaultProps',
  'Tooltip: Support for defaultProps',
  'Area: Support for defaultProps',
  'Line: Support for defaultProps',
];

// Check if a message should be suppressed
const shouldSuppressMessage = (message: string): boolean => {
  return suppressedWarnings.some(warning => 
    message.includes(warning)
  );
};

// Custom console.error that filters out specific warnings
const filteredError = (...args: any[]) => {
  const message = args[0];
  if (typeof message === 'string' && shouldSuppressMessage(message)) {
    // Suppress this warning
    return;
  }
  // Call original console.error for all other messages
  originalError.apply(console, args);
};

// Custom console.warn that filters out specific warnings
const filteredWarn = (...args: any[]) => {
  const message = args[0];
  if (typeof message === 'string' && shouldSuppressMessage(message)) {
    // Suppress this warning
    return;
  }
  // Call original console.warn for all other messages
  originalWarn.apply(console, args);
};

// Function to enable warning suppression
export const suppressRechartsWarnings = () => {
  console.error = filteredError;
  console.warn = filteredWarn;
};

// Function to restore original console methods
export const restoreConsole = () => {
  console.error = originalError;
  console.warn = originalWarn;
};

// Auto-suppress warnings in development
if (process.env.NODE_ENV === 'development') {
  suppressRechartsWarnings();
}
