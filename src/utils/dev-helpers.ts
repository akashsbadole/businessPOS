import { SubscriptionService } from '../services/subscription-service';

// Development helpers - only available in development mode
export const DevHelpers = {
  // Clear subscription for testing
  clearSubscription: () => {
    if (import.meta.env.NODE_ENV === 'development') {
      SubscriptionService.clearSubscription();
      console.log('Subscription cleared for development testing');
      window.location.reload();
    }
  },

  // Set a test subscription
  setTestSubscription: (planType: 'basic' | 'premium' | 'enterprise' = 'basic') => {
    if (import.meta.env.NODE_ENV === 'development') {
      const paymentRequest = {
        planType,
        duration: 'monthly' as const,
        email: 'test@example.com',
        name: 'Test User',
        paymentMethod: 'upi' as const,
        transactionId: 'TEST_' + Date.now(),
        amount: 999,
        currency: 'INR'
      };
      
      SubscriptionService.createSubscription(paymentRequest);
      console.log(`Test ${planType} subscription created`);
      window.location.reload();
    }
  },

  // Get current subscription info
  getSubscriptionInfo: () => {
    if (import.meta.env.NODE_ENV === 'development') {
      const subscription = SubscriptionService.getCurrentSubscription();
      const license = SubscriptionService.getCurrentLicense();
      console.log('Current subscription:', subscription);
      console.log('Current license:', license);
      return { subscription, license };
    }
  }
};

// Make helpers available globally in development
if (import.meta.env.NODE_ENV === 'development') {
  (window as any).devHelpers = DevHelpers;
  console.log('Development helpers available at window.devHelpers');
  console.log('Available commands:');
  console.log('- devHelpers.clearSubscription() - Clear subscription');
  console.log('- devHelpers.setTestSubscription("basic"|"premium"|"enterprise") - Set test subscription');
  console.log('- devHelpers.getSubscriptionInfo() - Get current subscription info');
}
