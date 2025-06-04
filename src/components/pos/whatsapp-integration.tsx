import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface WhatsAppMessage {
  type: "receipt" | "promotion" | "reminder" | "custom";
  template: string;
  variables: { [key: string]: string };
}

interface WhatsAppIntegrationProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customerPhone?: string;
  customerName?: string;
  invoiceData?: any;
  onSend: (phone: string, message: string) => void;
}

export const WhatsAppIntegration: React.FC<WhatsAppIntegrationProps> = ({
  isOpen,
  onOpenChange,
  customerPhone = "",
  customerName = "",
  invoiceData,
  onSend,
}) => {
  const [phone, setPhone] = React.useState(customerPhone);
  const [messageType, setMessageType] = React.useState<string>("receipt");
  const [customMessage, setCustomMessage] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState("default");

  // WhatsApp message templates for Indian businesses
  const messageTemplates = {
    receipt: {
      default: `🧾 *Receipt from {{businessName}}*

Hi {{customerName}},

Thank you for your purchase!

📋 *Invoice Details:*
• Invoice No: {{invoiceNumber}}
• Date: {{date}}
• Amount: ₹{{amount}}
• Payment: {{paymentMethod}}

{{itemsList}}

💰 *Payment Summary:*
• Subtotal: ₹{{subtotal}}
• Tax (GST): ₹{{tax}}
• Total: ₹{{total}}

🙏 Thank you for choosing us!

For support: {{supportPhone}}
{{businessAddress}}`,
      
      simple: `Hi {{customerName}}! 

Your bill from {{businessName}}:
Invoice: {{invoiceNumber}}
Amount: ₹{{total}}
Date: {{date}}

Thank you! 🙏`,
      
      detailed: `🏪 *{{businessName}}*
📱 Digital Receipt

👤 Customer: {{customerName}}
📋 Invoice: {{invoiceNumber}}
📅 Date: {{date}}

🛒 *Items Purchased:*
{{itemsList}}

💳 *Payment Details:*
Subtotal: ₹{{subtotal}}
GST ({{gstRate}}%): ₹{{tax}}
Total Paid: ₹{{total}}
Payment Mode: {{paymentMethod}}

✅ Payment Status: {{paymentStatus}}

🎉 Thank you for your business!
Visit us again soon!

📞 Support: {{supportPhone}}
📍 {{businessAddress}}`
    },
    
    promotion: {
      festival: `🎉 *{{festivalName}} Special Offer!*

Hi {{customerName}}!

🎊 Celebrate {{festivalName}} with amazing deals:

🔥 *Special Offers:*
• {{offer1}}
• {{offer2}}
• {{offer3}}

⏰ *Limited Time:* {{validTill}}

Visit us at {{businessAddress}}
Call: {{supportPhone}}

🛍️ Happy Shopping!`,
      
      loyalty: `⭐ *Loyalty Reward Alert!*

Hi {{customerName}}!

🎁 You've earned {{points}} loyalty points!
💰 Current Balance: {{totalPoints}} points

🎯 *Redeem Options:*
• 100 points = ₹10 discount
• 500 points = ₹60 discount
• 1000 points = ₹150 discount

Next purchase gets you closer to {{nextTier}} tier!

Visit us soon! 🛍️`,
      
      newProduct: `🆕 *New Arrival Alert!*

Hi {{customerName}}!

Check out our latest products:
{{productList}}

💥 *Launch Offer:* {{discount}}% OFF
🕐 Valid till: {{validTill}}

Visit our store or call {{supportPhone}}

🛒 Shop now!`
    },
    
    reminder: {
      payment: `💰 *Payment Reminder*

Hi {{customerName}},

This is a friendly reminder about your pending payment:

📋 Invoice: {{invoiceNumber}}
📅 Due Date: {{dueDate}}
💵 Amount: ₹{{pendingAmount}}

Please make the payment at your earliest convenience.

For any queries, contact: {{supportPhone}}

Thank you! 🙏`,
      
      pickup: `📦 *Order Ready for Pickup*

Hi {{customerName}}!

Your order is ready for pickup:

📋 Order: {{orderNumber}}
📅 Date: {{date}}
🕐 Pickup Hours: {{pickupHours}}

Please bring this message and a valid ID.

📍 Address: {{businessAddress}}
📞 Call: {{supportPhone}}`,
      
      appointment: `📅 *Appointment Reminder*

Hi {{customerName}},

Reminder for your appointment:

📅 Date: {{appointmentDate}}
🕐 Time: {{appointmentTime}}
👤 With: {{staffName}}
📋 Service: {{serviceName}}

Please arrive 10 minutes early.

To reschedule: {{supportPhone}}

See you soon! 😊`
    }
  };

  const generateMessage = () => {
    if (messageType === "custom") {
      return customMessage;
    }

    const templates = messageTemplates[messageType as keyof typeof messageTemplates];
    const template = templates[selectedTemplate as keyof typeof templates] || templates.default;

    // Replace variables with actual data
    let message = template;
    const variables = {
      businessName: "Your Business Name",
      customerName: customerName || "Valued Customer",
      invoiceNumber: invoiceData?.invoiceNumber || "INV-001",
      date: new Date().toLocaleDateString('en-IN'),
      amount: invoiceData?.total?.toFixed(2) || "0.00",
      subtotal: invoiceData?.subtotal?.toFixed(2) || "0.00",
      tax: invoiceData?.tax?.toFixed(2) || "0.00",
      total: invoiceData?.total?.toFixed(2) || "0.00",
      paymentMethod: invoiceData?.paymentMethod || "Cash",
      paymentStatus: invoiceData?.paymentStatus || "Paid",
      gstRate: "18",
      supportPhone: "+91 9333 911 911",
      businessAddress: "Your Business Address",
      itemsList: generateItemsList(),
      // Add more variables as needed
    };

    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return message;
  };

  const generateItemsList = () => {
    if (!invoiceData?.items) return "• Sample Item - ₹100.00";
    
    return invoiceData.items
      .map((item: any, index: number) => 
        `• ${item.name} (${item.quantity}x) - ₹${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n');
  };

  const handleSend = () => {
    if (!phone.trim()) {
      alert("Please enter a phone number");
      return;
    }

    const message = generateMessage();
    
    // Format phone number for WhatsApp (remove non-digits and add country code if needed)
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('91')) {
      formattedPhone = formattedPhone;
    } else if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Call the onSend callback
    onSend(formattedPhone, message);
    
    // Close modal
    onOpenChange(false);
  };

  const templateOptions = React.useMemo(() => {
    const templates = messageTemplates[messageType as keyof typeof messageTemplates];
    return Object.keys(templates).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1)
    }));
  }, [messageType]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon icon="lucide:message-circle" className="text-green-600" />
              <span>Send WhatsApp Message</span>
              <Chip color="success" variant="flat" size="sm">
                WhatsApp Business
              </Chip>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* Phone Number */}
                <Input
                  label="Customer Phone Number"
                  placeholder="+91 9876543210"
                  value={phone}
                  onValueChange={setPhone}
                  startContent={
                    <div className="flex items-center gap-1">
                      <Icon icon="lucide:phone" className="text-green-600" />
                      <span className="text-sm">+91</span>
                    </div>
                  }
                  isRequired
                />

                {/* Message Type */}
                <Select
                  label="Message Type"
                  selectedKeys={[messageType]}
                  onSelectionChange={(keys) => setMessageType(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="receipt" startContent={<Icon icon="lucide:receipt" />}>
                    Receipt/Invoice
                  </SelectItem>
                  <SelectItem key="promotion" startContent={<Icon icon="lucide:megaphone" />}>
                    Promotion/Offer
                  </SelectItem>
                  <SelectItem key="reminder" startContent={<Icon icon="lucide:bell" />}>
                    Reminder
                  </SelectItem>
                  <SelectItem key="custom" startContent={<Icon icon="lucide:edit" />}>
                    Custom Message
                  </SelectItem>
                </Select>

                {/* Template Selection */}
                {messageType !== "custom" && (
                  <Select
                    label="Template"
                    selectedKeys={[selectedTemplate]}
                    onSelectionChange={(keys) => setSelectedTemplate(Array.from(keys)[0] as string)}
                  >
                    {templateOptions.map((option) => (
                      <SelectItem key={option.key}>{option.label}</SelectItem>
                    ))}
                  </Select>
                )}

                {/* Custom Message */}
                {messageType === "custom" && (
                  <Textarea
                    label="Custom Message"
                    placeholder="Type your custom message here..."
                    value={customMessage}
                    onValueChange={setCustomMessage}
                    minRows={4}
                  />
                )}

                {/* Message Preview */}
                <Card>
                  <CardBody>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon icon="lucide:eye" />
                      Message Preview
                    </h4>
                    <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {generateMessage()}
                      </pre>
                    </div>
                  </CardBody>
                </Card>

                {/* WhatsApp Business Features */}
                <Card>
                  <CardBody>
                    <h4 className="font-semibold mb-2">📱 WhatsApp Business Features</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:check-circle" className="text-green-600" />
                        <span>Professional messaging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:check-circle" className="text-green-600" />
                        <span>Business profile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:check-circle" className="text-green-600" />
                        <span>Quick replies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:check-circle" className="text-green-600" />
                        <span>Message templates</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="success"
                onPress={handleSend}
                startContent={<Icon icon="lucide:send" />}
                isDisabled={!phone.trim() || (messageType === "custom" && !customMessage.trim())}
              >
                Send via WhatsApp
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
