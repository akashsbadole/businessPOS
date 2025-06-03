import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Subscription, 
  License, 
  SubscriptionValidation,
  PaymentRequest 
} from '../types/subscription';
import { SubscriptionService } from '../services/subscription-service';

interface SubscriptionContextType {
  subscription: Subscription | null;
  license: License | null;
  validation: SubscriptionValidation | null;
  isLoading: boolean;
  isSubscribed: boolean;
  daysRemaining: number;
  validateSubscription: () => Promise<void>;
  createSubscription: (paymentRequest: PaymentRequest) => Promise<boolean>;
  activateLicense: (licenseKey: string) => Promise<boolean>;
  clearSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const [validation, setValidation] = useState<SubscriptionValidation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateSubscription = async () => {
    setIsLoading(true);
    try {
      const result = await SubscriptionService.validateSubscription();
      setValidation(result);
      
      if (result.subscription) {
        setSubscription(result.subscription);
      }
      
      if (result.license) {
        setLicense(result.license);
      }
    } catch (error) {
      console.error('Error validating subscription:', error);
      setValidation({
        isValid: false,
        message: 'Error validating subscription',
        redirectToPayment: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (paymentRequest: PaymentRequest): Promise<boolean> => {
    try {
      const result = await SubscriptionService.createSubscription(paymentRequest);
      setSubscription(result.subscription);
      setLicense(result.license);
      
      // Re-validate after creation
      await validateSubscription();
      
      return true;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return false;
    }
  };

  const activateLicense = async (licenseKey: string): Promise<boolean> => {
    try {
      const success = await SubscriptionService.activateLicense(licenseKey);
      
      if (success) {
        // Re-validate after activation
        await validateSubscription();
      }
      
      return success;
    } catch (error) {
      console.error('Error activating license:', error);
      return false;
    }
  };

  const clearSubscription = () => {
    SubscriptionService.clearSubscription();
    setSubscription(null);
    setLicense(null);
    setValidation(null);
  };

  // Load subscription on mount
  useEffect(() => {
    validateSubscription();
  }, []);

  // Computed values
  const isSubscribed = validation?.isValid || false;
  const daysRemaining = validation?.daysRemaining || 0;

  const value: SubscriptionContextType = {
    subscription,
    license,
    validation,
    isLoading,
    isSubscribed,
    daysRemaining,
    validateSubscription,
    createSubscription,
    activateLicense,
    clearSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
