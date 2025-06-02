import React from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import { InvoiceTemplate, InvoiceData } from '../../types/invoice-template';

interface TemplatePreviewProps {
  template: InvoiceTemplate;
  data?: InvoiceData;
}

// Sample invoice data for preview
const sampleData: InvoiceData = {
  invoiceNumber: 'INV-2024-001',
  date: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  businessInfo: {
    name: 'Your Business Name',
    address: '123 Business Street, City, State 12345',
    phone: '(555) 123-4567',
    email: 'info@yourbusiness.com',
    website: 'www.yourbusiness.com',
    gstin: 'GST123456789',
  },
  customerInfo: {
    name: 'Customer Name',
    address: '456 Customer Ave, City, State 67890',
    phone: '(555) 987-6543',
    email: 'customer@email.com',
    gstin: 'GST987654321',
  },
  items: [
    {
      name: 'Product 1',
      description: 'High quality product',
      quantity: 2,
      rate: 100.00,
      amount: 200.00,
      tax: 36.00,
      discount: 0,
    },
    {
      name: 'Product 2',
      description: 'Another great product',
      quantity: 1,
      rate: 150.00,
      amount: 150.00,
      tax: 27.00,
      discount: 15.00,
    },
    {
      name: 'Service 1',
      description: 'Professional service',
      quantity: 3,
      rate: 75.00,
      amount: 225.00,
      tax: 40.50,
      discount: 0,
    },
  ],
  totals: {
    subtotal: 575.00,
    discount: 15.00,
    tax: 103.50,
    total: 663.50,
  },
  notes: 'Thank you for your business! Payment is due within 30 days.',
  terms: 'Payment terms: Net 30 days. Late payments may incur additional charges.',
};

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  data = sampleData,
}) => {
  // Calculate canvas dimensions
  const getCanvasDimensions = () => {
    const { paperSize, orientation, dimensions } = template;
    
    let width = dimensions.width;
    let height = dimensions.height;
    
    if (orientation === 'landscape') {
      [width, height] = [height, width];
    }
    
    // Convert to pixels and scale for preview
    const scale = 1.5;
    return {
      width: (width * 96 / 25.4) * scale,
      height: (height * 96 / 25.4) * scale,
      scale,
    };
  };

  const canvasDimensions = getCanvasDimensions();

  const renderElementContent = (element: any) => {
    const { type, content, properties, styles } = element;
    
    switch (type) {
      case 'text':
        return (
          <div
            className="w-full h-full flex items-center"
            style={{
              fontSize: (styles?.fontSize || 14) * canvasDimensions.scale,
              fontWeight: styles?.fontWeight || 'normal',
              textAlign: styles?.textAlign || 'left',
              color: styles?.color || '#000000',
            }}
          >
            {content || 'Text'}
          </div>
        );
        
      case 'business-info':
        return (
          <div
            className="w-full h-full"
            style={{
              fontSize: (styles?.fontSize || 12) * canvasDimensions.scale,
              color: styles?.color || '#000000',
            }}
          >
            <div className="font-semibold">{data.businessInfo.name}</div>
            <div>{data.businessInfo.address}</div>
            <div>Phone: {data.businessInfo.phone}</div>
            <div>Email: {data.businessInfo.email}</div>
            {data.businessInfo.gstin && <div>GSTIN: {data.businessInfo.gstin}</div>}
          </div>
        );
        
      case 'customer-info':
        return (
          <div
            className="w-full h-full"
            style={{
              fontSize: (styles?.fontSize || 12) * canvasDimensions.scale,
              color: styles?.color || '#000000',
            }}
          >
            <div className="font-semibold">Bill To:</div>
            <div className="font-semibold">{data.customerInfo.name}</div>
            {data.customerInfo.address && <div>{data.customerInfo.address}</div>}
            {data.customerInfo.phone && <div>Phone: {data.customerInfo.phone}</div>}
            {data.customerInfo.email && <div>Email: {data.customerInfo.email}</div>}
            {data.customerInfo.gstin && <div>GSTIN: {data.customerInfo.gstin}</div>}
          </div>
        );
        
      case 'items-table':
        return (
          <div className="w-full h-full border border-gray-300 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-r border-gray-300 p-1 text-left">Item</th>
                  <th className="border-r border-gray-300 p-1 text-center">Qty</th>
                  <th className="border-r border-gray-300 p-1 text-right">Rate</th>
                  <th className="p-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="border-r border-gray-300 p-1">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-gray-600 text-xs">{item.description}</div>
                      )}
                    </td>
                    <td className="border-r border-gray-300 p-1 text-center">{item.quantity}</td>
                    <td className="border-r border-gray-300 p-1 text-right">${item.rate.toFixed(2)}</td>
                    <td className="p-1 text-right">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'totals':
        return (
          <div
            className="w-full h-full space-y-1"
            style={{
              fontSize: (styles?.fontSize || 12) * canvasDimensions.scale,
              textAlign: styles?.textAlign || 'right',
            }}
          >
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${data.totals.subtotal.toFixed(2)}</span>
            </div>
            {data.totals.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${data.totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${data.totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-1">
              <span>Total:</span>
              <span>${data.totals.total.toFixed(2)}</span>
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Icon icon="lucide:image" className="text-gray-400" />
          </div>
        );
        
      case 'line':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: styles?.backgroundColor || '#000000',
            }}
          />
        );
        
      case 'qr-code':
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Icon icon="lucide:qr-code" className="text-gray-600" />
          </div>
        );
        
      case 'barcode':
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Icon icon="lucide:scan-line" className="text-gray-600" />
          </div>
        );
        
      case 'footer':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              fontSize: (styles?.fontSize || 10) * canvasDimensions.scale,
              textAlign: styles?.textAlign || 'center',
              color: styles?.color || '#666666',
            }}
          >
            {content || data.notes || 'Thank you for your business!'}
          </div>
        );
        
      default:
        return <div className="w-full h-full bg-gray-100" />;
    }
  };

  return (
    <div className="p-8 min-h-full flex items-center justify-center bg-default-50">
      <div className="relative">
        {/* Preview Canvas */}
        <Card
          className="relative bg-white shadow-lg overflow-hidden"
          style={{
            width: canvasDimensions.width,
            height: canvasDimensions.height,
            minHeight: canvasDimensions.height,
          }}
        >
          {/* Elements */}
          {template.elements
            .filter(element => element.visible !== false)
            .map((element) => (
              <div
                key={element.id}
                className="absolute overflow-hidden"
                style={{
                  left: element.x * canvasDimensions.scale,
                  top: element.y * canvasDimensions.scale,
                  width: element.width * canvasDimensions.scale,
                  height: element.height * canvasDimensions.scale,
                }}
              >
                {renderElementContent(element)}
              </div>
            ))}
        </Card>

        {/* Preview Info */}
        <div className="absolute -bottom-8 left-0 text-xs text-default-500">
          Preview • {template.paperSize} • {template.orientation}
        </div>
      </div>
    </div>
  );
};
