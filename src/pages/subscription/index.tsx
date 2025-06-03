import React, { useState } from 'react';
import { useSubscription } from '../../contexts/subscription-context';
import { PaymentRequest } from '../../types/subscription';
import { LandingPage } from './landing-page';
import { PaymentPage } from './payment-page';
import { LicenseActivation } from './license-activation';
import { SuccessPage } from './success-page';

type SubscriptionStep = 'landing' | 'payment' | 'license' | 'success';

export const SubscriptionPage: React.FC = () => {
  const { subscription, license, createSubscription, validateSubscription } = useSubscription();
  const [currentStep, setCurrentStep] = useState<SubscriptionStep>('landing');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise'>('basic');

  const handleSelectPlan = (planType: 'basic' | 'premium' | 'enterprise') => {
    setSelectedPlan(planType);
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = async (paymentRequest: PaymentRequest) => {
    const success = await createSubscription(paymentRequest);
    if (success) {
      setCurrentStep('success');
    } else {
      // Handle payment failure
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleLicenseActivation = () => {
    setCurrentStep('license');
  };

  const handleActivationSuccess = async () => {
    await validateSubscription();
    setCurrentStep('success');
  };

  const handleContinueToPOS = () => {
    // This will trigger a re-render of the main app with subscription active
    window.location.reload();
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('landing');
    } else if (currentStep === 'license') {
      setCurrentStep('landing');
    }
  };

  // Render appropriate step
  switch (currentStep) {
    case 'payment':
      return (
        <PaymentPage
          selectedPlan={selectedPlan}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={handleBack}
        />
      );

    case 'license':
      return (
        <LicenseActivation
          onActivationSuccess={handleActivationSuccess}
          onBack={handleBack}
        />
      );

    case 'success':
      if (!subscription || !license) {
        // Fallback if subscription/license data is missing
        setCurrentStep('landing');
        return null;
      }
      
      return (
        <SuccessPage
          subscription={subscription}
          license={license}
          onContinue={handleContinueToPOS}
        />
      );

    default:
      return (
        <LandingPage
          onSelectPlan={handleSelectPlan}
          onActivateLicense={handleLicenseActivation}
        />
      );
  }
};
