import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Link
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { Subscription, License } from '../../types/subscription';
import { SubscriptionService } from '../../services/subscription-service';

interface SuccessPageProps {
  subscription: Subscription;
  license: License;
  onContinue: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  subscription,
  license,
  onContinue,
}) => {
  const contactInfo = SubscriptionService.getContactInfo();
  const plan = SubscriptionService.getSubscriptionPlans().find(p => p.type === subscription.planType);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyLicenseKey = () => {
    navigator.clipboard.writeText(license.licenseKey);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 to-primary-50 p-4">
      <div className="container mx-auto max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="lucide:check-circle" className="text-success text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-success mb-2">Payment Successful!</h1>
          <p className="text-lg text-default-600">
            Welcome to BusinessPOS! Your subscription is now active.
          </p>
        </div>

        {/* Subscription Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <h3 className="text-xl font-semibold">Subscription Details</h3>
              <Chip color="success" variant="flat">
                Active
              </Chip>
            </div>
          </CardHeader>
          
          <CardBody className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-default-500">Plan</p>
                  <p className="font-semibold text-lg">{plan?.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Subscription ID</p>
                  <p className="font-mono text-sm">{subscription.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Payment Method</p>
                  <p className="capitalize">{subscription.paymentMethod}</p>
                </div>
                
                {subscription.transactionId && (
                  <div>
                    <p className="text-sm text-default-500">Transaction ID</p>
                    <p className="font-mono text-sm">{subscription.transactionId}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-default-500">Start Date</p>
                  <p className="font-semibold">{formatDate(subscription.startDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">End Date</p>
                  <p className="font-semibold">{formatDate(subscription.endDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-default-500">Amount Paid</p>
                  <p className="font-semibold text-lg">
                    {subscription.currency === 'INR' ? '₹' : '$'}
                    {subscription.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* License Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Icon icon="lucide:key" className="text-primary text-xl" />
              <h3 className="text-xl font-semibold">License Key</h3>
            </div>
          </CardHeader>
          
          <CardBody>
            <div className="bg-primary-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500 mb-1">Your License Key</p>
                  <p className="font-mono text-xl font-bold text-primary">
                    {license.licenseKey}
                  </p>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={copyLicenseKey}
                  title="Copy license key"
                >
                  <Icon icon="lucide:copy" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-default-600">
              <p>• Save this license key in a secure location</p>
              <p>• You'll need this key to activate BusinessPOS on other devices</p>
              <p>• This key is valid until {formatDate(license.expiresAt)}</p>
            </div>
          </CardBody>
        </Card>

        {/* Plan Features */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-xl font-semibold">Your Plan Features</h3>
          </CardHeader>
          
          <CardBody>
            <div className="grid md:grid-cols-2 gap-4">
              {plan?.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Icon icon="lucide:check" className="text-success text-sm" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Divider className="my-4" />
            
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {subscription.maxUsers === -1 ? '∞' : subscription.maxUsers}
                </p>
                <p className="text-sm text-default-500">Users</p>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-primary">
                  {subscription.maxProducts === -1 ? '∞' : subscription.maxProducts.toLocaleString()}
                </p>
                <p className="text-sm text-default-500">Products</p>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-primary">
                  {subscription.maxTransactions === -1 ? '∞' : subscription.maxTransactions.toLocaleString()}
                </p>
                <p className="text-sm text-default-500">Transactions/month</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-xl font-semibold">What's Next?</h3>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Start Using BusinessPOS</p>
                  <p className="text-sm text-default-600">
                    Click "Continue to POS" to start using all the features
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Set Up Your Business</p>
                  <p className="text-sm text-default-600">
                    Configure your business settings, add products, and customize invoices
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Get Support</p>
                  <p className="text-sm text-default-600">
                    Contact our support team if you need help getting started
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            color="primary"
            size="lg"
            className="flex-1"
            onPress={onContinue}
            startContent={<Icon icon="lucide:arrow-right" />}
          >
            Continue to BusinessPOS
          </Button>
          
          <Button
            variant="bordered"
            size="lg"
            className="flex-1"
            as={Link}
            href={`mailto:${contactInfo.email}?subject=BusinessPOS Subscription Confirmation&body=Subscription ID: ${subscription.id}%0ALicense Key: ${license.licenseKey}`}
            startContent={<Icon icon="lucide:mail" />}
          >
            Email Receipt
          </Button>
        </div>

        {/* Support Information */}
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-default-600 mb-4">
                Need help getting started? Our support team is here to help!
              </p>
              
              <div className="flex justify-center gap-6">
                <Link 
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 text-primary"
                >
                  <Icon icon="lucide:mail" />
                  Email Support
                </Link>
                
                <Link 
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-2 text-success"
                  isExternal
                >
                  <Icon icon="lucide:message-circle" />
                  WhatsApp
                </Link>
              </div>
              
              <p className="text-sm text-default-500 mt-2">
                Support Hours: {contactInfo.supportHours}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
