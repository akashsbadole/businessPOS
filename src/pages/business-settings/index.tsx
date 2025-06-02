import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../contexts/auth-context";
import { BusinessSettingsService } from "../../services/business-settings-service";
import {
  BusinessSettings,
  BusinessSettingsFormData,
  defaultBusinessSettings,
  businessTypes,
  currencies,
  paymentTermsOptions,
} from "../../types/business-settings";

export const BusinessSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [formData, setFormData] = useState<BusinessSettingsFormData>({
    ...defaultBusinessSettings,
  } as BusinessSettingsFormData);

  useEffect(() => {
    loadBusinessSettings();
  }, []);

  const loadBusinessSettings = async () => {
    try {
      setIsLoading(true);
      const businessSettings = await BusinessSettingsService.getBusinessSettings();

      if (businessSettings) {
        setSettings(businessSettings);
        setFormData({
          businessName: businessSettings.businessName,
          businessType: businessSettings.businessType,
          tagline: businessSettings.tagline || "",
          email: businessSettings.email,
          phone: businessSettings.phone,
          website: businessSettings.website || "",
          address: businessSettings.address,
          city: businessSettings.city,
          state: businessSettings.state,
          zipCode: businessSettings.zipCode,
          country: businessSettings.country,
          gstNumber: businessSettings.gstNumber || "",
          panNumber: businessSettings.panNumber || "",
          taxId: businessSettings.taxId || "",
          bankName: businessSettings.bankName || "",
          accountNumber: businessSettings.accountNumber || "",
          ifscCode: businessSettings.ifscCode || "",
          upiId: businessSettings.upiId || "",
          invoicePrefix: businessSettings.invoicePrefix,
          invoiceStartNumber: businessSettings.invoiceStartNumber,
          currency: businessSettings.currency,
          currencySymbol: businessSettings.currencySymbol,
          paymentTerms: businessSettings.paymentTerms,
          termsAndConditions: businessSettings.termsAndConditions || "",
          notes: businessSettings.notes || "",
          primaryColor: businessSettings.primaryColor,
          secondaryColor: businessSettings.secondaryColor,
        });
      }
    } catch (error) {
      console.error("Error loading business settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      await BusinessSettingsService.saveBusinessSettings(formData, user.id);
      await loadBusinessSettings();

      alert("Business settings saved successfully!");
    } catch (error) {
      console.error("Error saving business settings:", error);
      alert("Error saving business settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof BusinessSettingsFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" label="Loading business settings..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Business Settings</h1>
          <p className="text-default-600">
            Configure your business information for invoices and receipts
          </p>
        </div>
        <Button
          color="primary"
          onPress={handleSave}
          isLoading={isSaving}
          startContent={<Icon icon="lucide:save" />}
        >
          Save Settings
        </Button>
      </div>

      {/* Business Information */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Business Information</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Business Name"
              placeholder="Enter your business name"
              value={formData.businessName}
              onValueChange={(value) => handleInputChange("businessName", value)}
              isRequired
            />
            <Select
              label="Business Type"
              placeholder="Select business type"
              selectedKeys={[formData.businessType]}
              onSelectionChange={(keys) =>
                handleInputChange("businessType", Array.from(keys)[0] as string)
              }
            >
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Input
            label="Tagline"
            placeholder="Your business tagline (optional)"
            value={formData.tagline}
            onValueChange={(value) => handleInputChange("tagline", value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="business@example.com"
              value={formData.email}
              onValueChange={(value) => handleInputChange("email", value)}
              isRequired
            />
            <Input
              label="Phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onValueChange={(value) => handleInputChange("phone", value)}
              isRequired
            />
          </div>

          <Input
            label="Website"
            placeholder="www.yourbusiness.com"
            value={formData.website}
            onValueChange={(value) => handleInputChange("website", value)}
          />
        </CardBody>
      </Card>

      {/* Address Information */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Business Address</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Textarea
            label="Address"
            placeholder="Enter your business address"
            value={formData.address}
            onValueChange={(value) => handleInputChange("address", value)}
            isRequired
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              placeholder="City"
              value={formData.city}
              onValueChange={(value) => handleInputChange("city", value)}
              isRequired
            />
            <Input
              label="State"
              placeholder="State"
              value={formData.state}
              onValueChange={(value) => handleInputChange("state", value)}
              isRequired
            />
            <Input
              label="ZIP Code"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onValueChange={(value) => handleInputChange("zipCode", value)}
              isRequired
            />
          </div>

          <Input
            label="Country"
            placeholder="Country"
            value={formData.country}
            onValueChange={(value) => handleInputChange("country", value)}
            isRequired
          />
        </CardBody>
      </Card>

      {/* Tax & Banking Information */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Tax & Banking Information</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="GST Number"
              placeholder="GST registration number"
              value={formData.gstNumber}
              onValueChange={(value) => handleInputChange("gstNumber", value)}
            />
            <Input
              label="PAN Number"
              placeholder="PAN card number"
              value={formData.panNumber}
              onValueChange={(value) => handleInputChange("panNumber", value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Invoice Settings */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Invoice Configuration</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Invoice Prefix"
              placeholder="INV"
              value={formData.invoicePrefix}
              onValueChange={(value) =>
                handleInputChange("invoicePrefix", value)
              }
              isRequired
            />
            <Input
              label="Starting Number"
              type="number"
              placeholder="1"
              value={formData.invoiceStartNumber.toString()}
              onValueChange={(value) =>
                handleInputChange("invoiceStartNumber", parseInt(value) || 1)
              }
              isRequired
            />
            <Select
              label="Currency"
              placeholder="Select currency"
              selectedKeys={[formData.currency]}
              onSelectionChange={(keys) => {
                const currency = Array.from(keys)[0] as string;
                const currencyData = currencies.find(
                  (c) => c.code === currency
                );
                handleInputChange("currency", currency);
                if (currencyData) {
                  handleInputChange("currencySymbol", currencyData.symbol);
                }
              }}
            >
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Textarea
            label="Terms and Conditions"
            placeholder="Enter your terms and conditions"
            value={formData.termsAndConditions}
            onValueChange={(value) =>
              handleInputChange("termsAndConditions", value)
            }
            rows={3}
          />
        </CardBody>
      </Card>
    </div>
  );
};
