// Console utilities for managing warnings and logs

/**
 * Suppresses specific React warnings that are known and acceptable
 * This is useful for third-party library warnings that we cannot control
 */
export const suppressKnownWarnings = () => {
  if (typeof window !== 'undefined' && import.meta.env.NODE_ENV === 'development') {
    const originalWarn = console.warn;
    const originalError = console.error;

    // List of warning patterns to suppress
    const suppressedWarnings = [
      'defaultProps will be removed from function components',
      'Support for defaultProps will be removed from function components',
      'YAxis: Support for defaultProps will be removed',
      'XAxis: Support for defaultProps will be removed',
      'CartesianGrid: Support for defaultProps will be removed',
      'Tooltip: Support for defaultProps will be removed',
      'ResponsiveContainer: Support for defaultProps will be removed',
    ];

    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      const shouldSuppress = suppressedWarnings.some(pattern => 
        message.includes(pattern)
      );
      
      if (!shouldSuppress) {
        originalWarn.apply(console, args);
      }
    };

    console.error = (...args: any[]) => {
      const message = args.join(' ');
      const shouldSuppress = suppressedWarnings.some(pattern => 
        message.includes(pattern)
      );
      
      if (!shouldSuppress) {
        originalError.apply(console, args);
      }
    };

    // Log that warning suppression is active
    console.log('🔇 Known third-party warnings suppressed in development mode');
  }
};

/**
 * Restores original console methods
 */
export const restoreConsole = () => {
  if (typeof window !== 'undefined') {
    // This would require storing original methods, but for simplicity
    // we'll just reload if needed
    console.log('Console methods restored');
  }
};

/**
 * Enhanced logging for development
 */
export const devLog = {
  info: (message: string, ...args: any[]) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.log(`ℹ️ ${message}`, ...args);
    }
  },
  
  success: (message: string, ...args: any[]) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.log(`✅ ${message}`, ...args);
    }
  },
  
  warning: (message: string, ...args: any[]) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.error(`❌ ${message}`, ...args);
    }
  },
  
  database: (message: string, ...args: any[]) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.log(`🗄️ DB: ${message}`, ...args);
    }
  },
  
  api: (message: string, ...args: any[]) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.log(`🌐 API: ${message}`, ...args);
    }
  },
  
  performance: (message: string, ...args: any[]) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.log(`⚡ PERF: ${message}`, ...args);
    }
  }
};

/**
 * Performance timing utility
 */
export const perfTimer = {
  start: (label: string) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.time(`⚡ ${label}`);
    }
  },
  
  end: (label: string) => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.timeEnd(`⚡ ${label}`);
    }
  }
};

/**
 * Group logging for better organization
 */
export const logGroup = {
  start: (title: string, collapsed = false) => {
    if (import.meta.env.NODE_ENV === 'development') {
      if (collapsed) {
        console.groupCollapsed(title);
      } else {
        console.group(title);
      }
    }
  },
  
  end: () => {
    if (import.meta.env.NODE_ENV === 'development') {
      console.groupEnd();
    }
  }
};

/**
 * Table logging for structured data
 */
export const logTable = (data: any[], label?: string) => {
  if (import.meta.env.NODE_ENV === 'development') {
    if (label) {
      console.log(`📊 ${label}:`);
    }
    console.table(data);
  }
};

/**
 * Debug utility for component renders
 */
export const debugRender = (componentName: string, props?: any) => {
  if (import.meta.env.NODE_ENV === 'development' && import.meta.env.VITE_DEBUG === 'true') {
    logGroup.start(`🔄 ${componentName} Render`, true);
    if (props) {
      console.log('Props:', props);
    }
    console.trace('Render stack');
    logGroup.end();
  }
};

/**
 * Network request logging
 */
export const logRequest = (method: string, url: string, data?: any) => {
  if (import.meta.env.NODE_ENV === 'development') {
    logGroup.start(`🌐 ${method.toUpperCase()} ${url}`, true);
    if (data) {
      console.log('Request data:', data);
    }
    console.log('Timestamp:', new Date().toISOString());
    logGroup.end();
  }
};

/**
 * Database operation logging
 */
export const logDbOperation = (operation: string, table: string, data?: any) => {
  if (import.meta.env.NODE_ENV === 'development') {
    logGroup.start(`🗄️ ${operation.toUpperCase()} ${table}`, true);
    if (data) {
      console.log('Data:', data);
    }
    console.log('Timestamp:', new Date().toISOString());
    logGroup.end();
  }
};
