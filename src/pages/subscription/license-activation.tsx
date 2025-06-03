import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Divider,
  Link,
  Chip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { SubscriptionService } from '../../services/subscription-service';

interface LicenseActivationProps {
  onActivationSuccess: () => void;
  onBack: () => void;
}

export const LicenseActivation: React.FC<LicenseActivationProps> = ({
  onActivationSuccess,
  onBack,
}) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState('');

  const contactInfo = SubscriptionService.getContactInfo();

  const formatLicenseKey = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Add hyphens every 4 characters
    const formatted = cleaned.match(/.{1,4}/g)?.join('-') || cleaned;
    
    // Limit to 19 characters (XXXX-XXXX-XXXX-XXXX)
    return formatted.substring(0, 19);
  };

  const handleLicenseKeyChange = (value: string) => {
    const formatted = formatLicenseKey(value);
    setLicenseKey(formatted);
    setError('');
  };

  const handleActivation = async () => {
    if (!licenseKey || licenseKey.length < 19) {
      setError('Please enter a valid license key');
      return;
    }

    setIsActivating(true);
    setError('');

    try {
      const success = await SubscriptionService.activateLicense(licenseKey);
      
      if (success) {
        onActivationSuccess();
      } else {
        setError('Invalid license key. Please check and try again.');
      }
    } catch (error) {
      setError('Failed to activate license. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  const isValidFormat = licenseKey.length === 19 && /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(licenseKey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            isIconOnly
            variant="light"
            onPress={onBack}
          >
            <Icon icon="lucide:arrow-left" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Activate License</h1>
            <p className="text-default-600">Enter your license key to activate BusinessPOS</p>
          </div>
        </div>

        {/* License Activation Form */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Icon icon="lucide:key" className="text-primary text-xl" />
              <h3 className="text-lg font-semibold">License Key Activation</h3>
            </div>
          </CardHeader>
          
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  label="License Key"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={licenseKey}
                  onValueChange={handleLicenseKeyChange}
                  description="Enter the 16-character license key you received"
                  errorMessage={error}
                  isInvalid={!!error}
                  size="lg"
                  startContent={<Icon icon="lucide:key" className="text-default-400" />}
                  classNames={{
                    input: "font-mono text-lg tracking-wider"
                  }}
                />
                
                {licenseKey && (
                  <div className="mt-2">
                    <Chip
                      color={isValidFormat ? 'success' : 'warning'}
                      variant="flat"
                      size="sm"
                    >
                      {isValidFormat ? 'Valid format' : 'Invalid format'}
                    </Chip>
                  </div>
                )}
              </div>

              <Button
                color="primary"
                size="lg"
                className="w-full"
                onPress={handleActivation}
                isLoading={isActivating}
                isDisabled={!isValidFormat}
                startContent={!isActivating && <Icon icon="lucide:check-circle" />}
              >
                {isActivating ? 'Activating License...' : 'Activate License'}
              </Button>
            </div>

            <Divider />

            {/* Instructions */}
            <div className="space-y-4">
              <h4 className="font-medium">How to activate your license:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <p>Enter the 16-character license key you received after purchase</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p>Click "Activate License" to verify and activate your subscription</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p>Start using BusinessPOS with all features unlocked</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sample License Keys for Demo */}
        <Card className="mb-6 border-dashed border-2 border-warning-200 bg-warning-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Icon icon="lucide:info" className="text-warning text-xl" />
              <h3 className="text-lg font-semibold text-warning-700">Demo License Keys</h3>
            </div>
          </CardHeader>
          
          <CardBody>
            <p className="text-warning-700 mb-4">
              For demonstration purposes, you can use these sample license keys:
            </p>
            
            <div className="space-y-2">
              {['DEMO-2024-BASIC-0001', 'TEST-2024-PREM-0001', 'TRIAL-2024-ENT-0001'].map((key) => (
                <div key={key} className="flex items-center justify-between bg-white p-3 rounded border">
                  <code className="font-mono text-sm">{key}</code>
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => setLicenseKey(key)}
                  >
                    Use This Key
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Support Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Need Help?</h3>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-4">
              <p className="text-default-600">
                If you're having trouble activating your license or can't find your license key, 
                our support team is here to help.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:mail" className="text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <Link href={`mailto:${contactInfo.email}`} className="text-primary text-sm">
                      {contactInfo.email}
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:message-circle" className="text-success" />
                  <div>
                    <p className="font-medium">WhatsApp Support</p>
                    <Link 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                      className="text-success text-sm"
                      isExternal
                    >
                      {contactInfo.whatsapp}
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-default-500">
                <p><strong>Support Hours:</strong> {contactInfo.supportHours}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
