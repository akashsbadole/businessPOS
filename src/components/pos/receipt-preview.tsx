import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CartItem } from "../../types/pos";

interface ReceiptPreviewProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  paymentMethod: string;
  invoiceNumber: string;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  isOpen,
  onOpenChange,
  items,
  subtotal,
  gstAmount,
  discount,
  total,
  paymentMethod,
  invoiceNumber
}) => {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  
  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
  
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      // Add the receipt content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt</title>
          <style>
            @page {
              size: 80mm 297mm;
              margin: 0;
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 10pt;
              line-height: 1.2;
              width: 80mm;
              margin: 0;
              padding: 5mm;
            }
            .text-center {
              text-align: center;
            }
            .mb-4 {
              margin-bottom: 16px;
            }
            .mb-2 {
              margin-bottom: 8px;
            }
            .mt-2 {
              margin-top: 8px;
            }
            .mt-4 {
              margin-top: 16px;
            }
            .flex {
              display: flex;
            }
            .justify-between {
              justify-content: space-between;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 8px 0;
            }
            .font-bold {
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              text-align: left;
              padding: 2px 0;
            }
            .text-right {
              text-align: right;
            }
            .text-xs {
              font-size: 8pt;
            }
          </style>
        </head>
        <body>
          <div class="text-center mb-4">
            <h3 class="font-bold">SHARMA GENERAL STORE</h3>
            <p>123, Main Road, Andheri East</p>
            <p>Mumbai, Maharashtra - 400069</p>
            <p>GSTIN: 27AADCB2230M1ZT</p>
            <p>Phone: +91 9876543210</p>
          </div>
          
          <div class="flex justify-between mb-4">
            <div>
              <p>Invoice: ${invoiceNumber}</p>
              <p>Date: ${currentDate}</p>
            </div>
            <div>
              <p>Time: ${currentTime}</p>
              <p>Cashier: Raj Kumar</p>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${item.price.toFixed(2)}</td>
                  <td class="text-right">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="divider"></div>
          
          <div class="flex justify-between">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          
          <div class="flex justify-between">
            <span>GST (18%):</span>
            <span>₹${gstAmount.toFixed(2)}</span>
          </div>
          
          <div class="flex justify-between">
            <span>CGST (9%):</span>
            <span>₹${(gstAmount / 2).toFixed(2)}</span>
          </div>
          
          <div class="flex justify-between">
            <span>SGST (9%):</span>
            <span>₹${(gstAmount / 2).toFixed(2)}</span>
          </div>
          
          ${discount > 0 ? `
          <div class="flex justify-between">
            <span>Discount:</span>
            <span>-₹${discount.toFixed(2)}</span>
          </div>
          ` : ''}
          
          <div class="flex justify-between font-bold mt-2">
            <span>Total:</span>
            <span>₹${total.toFixed(2)}</span>
          </div>
          
          <div class="mt-2">
            <p>Payment Method: ${paymentMethod.toUpperCase()}</p>
          </div>
          
          <div class="divider"></div>
          
          <div class="text-center mt-4">
            <p>Thank you for shopping with us!</p>
            <p class="text-xs mt-2">Visit us again</p>
          </div>
        </body>
        </html>
      `);
      
      // Print and close the window
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Receipt Preview</ModalHeader>
            <ModalBody>
              <div className="bg-white p-6 font-mono text-sm">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-base">SHARMA GENERAL STORE</h3>
                  <p>123, Main Road, Andheri East</p>
                  <p>Mumbai, Maharashtra - 400069</p>
                  <p>GSTIN: 27AADCB2230M1ZT</p>
                  <p>Phone: +91 9876543210</p>
                </div>
                
                <div className="flex justify-between mb-4">
                  <div>
                    <p>Invoice: {invoiceNumber}</p>
                    <p>Date: {currentDate}</p>
                  </div>
                  <div>
                    <p>Time: {currentTime}</p>
                    <p>Cashier: Raj Kumar</p>
                  </div>
                </div>
                
                <Divider className="my-2" />
                
                <div className="mb-2">
                  <div className="flex justify-between font-bold">
                    <span className="w-1/2">Item</span>
                    <span className="w-1/6 text-right">Qty</span>
                    <span className="w-1/6 text-right">Price</span>
                    <span className="w-1/6 text-right">Amount</span>
                  </div>
                </div>
                
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between mb-1">
                    <span className="w-1/2 truncate">{item.name}</span>
                    <span className="w-1/6 text-right">{item.quantity}</span>
                    <span className="w-1/6 text-right">{item.price.toFixed(2)}</span>
                    <span className="w-1/6 text-right">{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <Divider className="my-2" />
                
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>CGST (9%):</span>
                  <span>₹{(gstAmount / 2).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>SGST (9%):</span>
                  <span>₹{(gstAmount / 2).toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold mt-2">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                
                <div className="mt-2">
                  <p>Payment Method: {paymentMethod.toUpperCase()}</p>
                </div>
                
                <Divider className="my-2" />
                
                <div className="text-center mt-4">
                  <p>Thank you for shopping with us!</p>
                  <p className="text-xs mt-1">Visit us again</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button 
                color="primary" 
                startContent={<Icon icon="lucide:printer" />}
                onPress={handlePrint}
              >
                Print Receipt
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};