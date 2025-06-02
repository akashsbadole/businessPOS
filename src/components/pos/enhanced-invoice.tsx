import React from "react";
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CartItem, BusinessSettings } from "../../types/pos";

interface EnhancedInvoiceProps {
  invoiceNumber: string;
  date: Date;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerGSTIN?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  roundOff: number;
  total: number;
  paymentMethod: string;
  businessSettings?: BusinessSettings;
  onPrint?: () => void;
  onDownload?: () => void;
  template?: 'standard' | 'thermal' | 'minimal';
}

export const EnhancedInvoice: React.FC<EnhancedInvoiceProps> = ({
  invoiceNumber,
  date,
  customerName,
  customerPhone,
  customerAddress,
  customerGSTIN,
  items,
  subtotal,
  discount,
  gstAmount,
  cgstAmount,
  sgstAmount,
  igstAmount,
  roundOff,
  total,
  paymentMethod,
  businessSettings,
  onPrint,
  onDownload,
  template = 'standard'
}) => {
  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      
      document.body.innerHTML = `
        <html>
          <head>
            <title>Invoice ${invoiceNumber}</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .no-print { display: none !important; }
                .print-only { display: block !important; }
                .page-break { page-break-after: always; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .text-lg { font-size: 1.125rem; }
                .text-sm { font-size: 0.875rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mt-4 { margin-top: 1rem; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `;
      
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
    onPrint?.();
  };

  const handleDownload = () => {
    // Generate PDF or save as HTML
    onDownload?.();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (template === 'thermal') {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardBody className="p-4">
          <div ref={printRef} className="thermal-receipt">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold">{businessSettings?.businessName || 'Your Business'}</h1>
              {businessSettings?.address && (
                <p className="text-sm text-default-600">{businessSettings.address}</p>
              )}
              {businessSettings?.city && businessSettings?.state && (
                <p className="text-sm text-default-600">
                  {businessSettings.city}, {businessSettings.state} - {businessSettings.pincode}
                </p>
              )}
              {businessSettings?.phone && (
                <p className="text-sm text-default-600">Ph: {businessSettings.phone}</p>
              )}
              {businessSettings?.gstin && (
                <p className="text-sm text-default-600">GSTIN: {businessSettings.gstin}</p>
              )}
            </div>

            <Divider className="my-2" />

            {/* Invoice Details */}
            <div className="text-sm space-y-1 mb-4">
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span className="font-bold">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDate(date)}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{formatTime(date)}</span>
              </div>
              {customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{customerName}</span>
                </div>
              )}
              {customerPhone && (
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{customerPhone}</span>
                </div>
              )}
            </div>

            <Divider className="my-2" />

            {/* Items */}
            <div className="space-y-2 mb-4">
              {items.map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                  <div className="flex justify-between text-default-600">
                    <span>{item.quantity} x {formatCurrency(item.price)}</span>
                    {item.taxRate && <span>GST: {item.taxRate}%</span>}
                  </div>
                </div>
              ))}
            </div>

            <Divider className="my-2" />

            {/* Totals */}
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              {cgstAmount > 0 && (
                <div className="flex justify-between">
                  <span>CGST:</span>
                  <span>{formatCurrency(cgstAmount)}</span>
                </div>
              )}
              {sgstAmount > 0 && (
                <div className="flex justify-between">
                  <span>SGST:</span>
                  <span>{formatCurrency(sgstAmount)}</span>
                </div>
              )}
              {igstAmount > 0 && (
                <div className="flex justify-between">
                  <span>IGST:</span>
                  <span>{formatCurrency(igstAmount)}</span>
                </div>
              )}
              {roundOff !== 0 && (
                <div className="flex justify-between">
                  <span>Round Off:</span>
                  <span>{roundOff > 0 ? '+' : ''}{formatCurrency(roundOff)}</span>
                </div>
              )}
              <Divider className="my-1" />
              <div className="flex justify-between font-bold text-base">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="capitalize">{paymentMethod}</span>
              </div>
            </div>

            <Divider className="my-2" />

            <div className="text-center text-sm text-default-600">
              <p>Thank you for your business!</p>
              <p>Visit again</p>
            </div>
          </div>

          {/* Print Actions */}
          <div className="flex gap-2 mt-4 no-print">
            <Button
              size="sm"
              color="primary"
              startContent={<Icon icon="lucide:printer" />}
              onPress={handlePrint}
              className="flex-1"
            >
              Print
            </Button>
            <Button
              size="sm"
              variant="bordered"
              startContent={<Icon icon="lucide:download" />}
              onPress={handleDownload}
              className="flex-1"
            >
              Save
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Standard A4 Invoice Template
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardBody className="p-8">
        <div ref={printRef} className="standard-invoice">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {businessSettings?.businessName || 'Your Business'}
              </h1>
              {businessSettings?.address && (
                <div className="mt-2 text-default-600">
                  <p>{businessSettings.address}</p>
                  <p>{businessSettings.city}, {businessSettings.state} - {businessSettings.pincode}</p>
                  {businessSettings.phone && <p>Phone: {businessSettings.phone}</p>}
                  {businessSettings.email && <p>Email: {businessSettings.email}</p>}
                  {businessSettings.gstin && <p>GSTIN: {businessSettings.gstin}</p>}
                </div>
              )}
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">INVOICE</h2>
              <p className="text-lg font-semibold">{invoiceNumber}</p>
              <p className="text-default-600">Date: {formatDate(date)}</p>
              <p className="text-default-600">Time: {formatTime(date)}</p>
            </div>
          </div>

          {/* Customer Details */}
          {(customerName || customerPhone || customerAddress) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
              <div className="text-default-600">
                {customerName && <p className="font-medium">{customerName}</p>}
                {customerPhone && <p>Phone: {customerPhone}</p>}
                {customerAddress && <p>{customerAddress}</p>}
                {customerGSTIN && <p>GSTIN: {customerGSTIN}</p>}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-default-300">
              <thead>
                <tr className="bg-default-100">
                  <th className="border border-default-300 p-3 text-left">Item</th>
                  <th className="border border-default-300 p-3 text-center">HSN</th>
                  <th className="border border-default-300 p-3 text-center">Qty</th>
                  <th className="border border-default-300 p-3 text-right">Rate</th>
                  <th className="border border-default-300 p-3 text-center">Tax%</th>
                  <th className="border border-default-300 p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-default-300 p-3">{item.name}</td>
                    <td className="border border-default-300 p-3 text-center">{item.hsn}</td>
                    <td className="border border-default-300 p-3 text-center">{item.quantity}</td>
                    <td className="border border-default-300 p-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="border border-default-300 p-3 text-center">{item.taxRate || 0}%</td>
                    <td className="border border-default-300 p-3 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                {cgstAmount > 0 && (
                  <div className="flex justify-between">
                    <span>CGST:</span>
                    <span>{formatCurrency(cgstAmount)}</span>
                  </div>
                )}
                {sgstAmount > 0 && (
                  <div className="flex justify-between">
                    <span>SGST:</span>
                    <span>{formatCurrency(sgstAmount)}</span>
                  </div>
                )}
                {igstAmount > 0 && (
                  <div className="flex justify-between">
                    <span>IGST:</span>
                    <span>{formatCurrency(igstAmount)}</span>
                  </div>
                )}
                {roundOff !== 0 && (
                  <div className="flex justify-between">
                    <span>Round Off:</span>
                    <span>{roundOff > 0 ? '+' : ''}{formatCurrency(roundOff)}</span>
                  </div>
                )}
                <Divider />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-default-600">
            <p>Thank you for your business!</p>
          </div>
        </div>

        {/* Print Actions */}
        <div className="flex gap-4 mt-8 no-print">
          <Button
            color="primary"
            startContent={<Icon icon="lucide:printer" />}
            onPress={handlePrint}
          >
            Print Invoice
          </Button>
          <Button
            variant="bordered"
            startContent={<Icon icon="lucide:download" />}
            onPress={handleDownload}
          >
            Download PDF
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
