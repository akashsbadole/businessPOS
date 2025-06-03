import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Link,
  Image
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { SubscriptionService } from '../../services/subscription-service';

interface LandingPageProps {
  onSelectPlan: (planType: 'basic' | 'premium' | 'enterprise') => void;
  onActivateLicense: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPlan,
  onActivateLicense,
}) => {
  const plans = SubscriptionService.getSubscriptionPlans();
  const contactInfo = SubscriptionService.getContactInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon icon="lucide:shopping-bag" className="text-primary text-4xl" />
            <h1 className="text-4xl font-bold text-primary">BusinessPOS</h1>
          </div>
          <p className="text-xl text-default-600 mb-6">
            Professional Point of Sale System for Modern Businesses
          </p>
          <p className="text-lg text-default-500 max-w-2xl mx-auto">
            Streamline your business operations with our comprehensive POS solution. 
            Choose a plan that fits your needs and start growing your business today.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardBody className="p-6">
              <Icon icon="lucide:zap" className="text-primary text-3xl mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-default-600">Process transactions quickly with our optimized interface</p>
            </CardBody>
          </Card>
          
          <Card className="text-center">
            <CardBody className="p-6">
              <Icon icon="lucide:shield-check" className="text-success text-3xl mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-default-600">Your data is protected with enterprise-grade security</p>
            </CardBody>
          </Card>
          
          <Card className="text-center">
            <CardBody className="p-6">
              <Icon icon="lucide:smartphone" className="text-secondary text-3xl mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Mobile Ready</h3>
              <p className="text-default-600">Works perfectly on all devices - desktop, tablet, mobile</p>
            </CardBody>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-default-600">Select the perfect plan for your business needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-2 border-primary' : ''}`}
            >
              {plan.popular && (
                <Chip 
                  color="primary" 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                >
                  Most Popular
                </Chip>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="w-full">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-default-600 text-sm">{plan.description}</p>
                </div>
              </CardHeader>
              
              <CardBody className="pt-2">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary">
                    ₹{plan.monthlyPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-default-600">per month</div>
                  <div className="text-xs text-success mt-1">
                    Save ₹{(plan.monthlyPrice * 12 - plan.yearlyPrice).toLocaleString()} with yearly plan
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icon icon="lucide:check" className="text-success text-sm" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  color={plan.popular ? 'primary' : 'default'}
                  variant={plan.popular ? 'solid' : 'bordered'}
                  className="w-full"
                  size="lg"
                  onPress={() => onSelectPlan(plan.type)}
                >
                  Get Started
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* License Activation */}
        <Card className="mb-12">
          <CardHeader>
            <h3 className="text-xl font-semibold">Already have a license?</h3>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-default-600 mb-2">
                  If you already purchased a license, activate it here to start using BusinessPOS.
                </p>
                <p className="text-sm text-default-500">
                  License format: XXXX-XXXX-XXXX-XXXX
                </p>
              </div>
              <Button
                color="secondary"
                variant="bordered"
                onPress={onActivateLicense}
                startContent={<Icon icon="lucide:key" />}
              >
                Activate License
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Need Help? Contact Us</h3>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:mail" className="text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <Link href={`mailto:${contactInfo.email}`} className="text-primary">
                      {contactInfo.email}
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:phone" className="text-primary" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <Link href={`tel:${contactInfo.phone}`} className="text-primary">
                      {contactInfo.phone}
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:message-circle" className="text-success" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <Link 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                      className="text-success"
                      isExternal
                    >
                      {contactInfo.whatsapp}
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:clock" className="text-default-600" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-default-600 text-sm">{contactInfo.supportHours}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
