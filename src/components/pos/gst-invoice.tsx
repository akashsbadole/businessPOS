import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Card,
  CardBody,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface GSTInvoiceItem {
  id: string;
  name: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxableValue: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

interface BusinessDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  phone: string;
  email: string;
}

interface CustomerDetails {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  phone?: string;
}

interface GSTInvoiceProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  invoiceNumber: string;
  invoiceDate: Date;
  businessDetails: BusinessDetails;
  customerDetails: CustomerDetails;
  items: GSTInvoiceItem[];
  paymentDetails: any;
  onPrint: () => void;
  onDownloadPDF: () => void;
  onEmailInvoice: () => void;
}

export const GSTInvoice: React.FC<GSTInvoiceProps> = ({
  isOpen,
  onOpenChange,
  invoiceNumber,
  invoiceDate,
  businessDetails,
  customerDetails,
  items,
  paymentDetails,
  onPrint,
  onDownloadPDF,
  onEmailInvoice,
}) => {
  // Calculate totals
  const totals = React.useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const taxableValue = subtotal - totalDiscount;
    const totalCGST = items.reduce((sum, item) => sum + item.cgstAmount, 0);
    const totalSGST = items.reduce((sum, item) => sum + item.sgstAmount, 0);
    const totalIGST = items.reduce((sum, item) => sum + item.igstAmount, 0);
    const totalTax = totalCGST + totalSGST + totalIGST;
    const grandTotal = taxableValue + totalTax;
    const roundOff = Math.round(grandTotal) - grandTotal;
    const finalAmount = Math.round(grandTotal);

    return {
      subtotal,
      totalDiscount,
      taxableValue,
      totalCGST,
      totalSGST,
      totalIGST,
      totalTax,
      grandTotal,
      roundOff,
      finalAmount,
    };
  }, [items]);

  // Convert number to words (Indian format)
  const convertToWords = (num: number): string => {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convertHundreds = (n: number): string => {
      let result = "";
      if (n >= 100) {
        result += units[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + " ";
        return result;
      }
      if (n > 0) {
        result += units[n] + " ";
      }
      return result;
    };

    if (num === 0) return "Zero Rupees Only";

    const crores = Math.floor(num / 10000000);
    const lakhs = Math.floor((num % 10000000) / 100000);
    const thousands = Math.floor((num % 100000) / 1000);
    const hundreds = num % 1000;

    let result = "";
    if (crores > 0) result += convertHundreds(crores) + "Crore ";
    if (lakhs > 0) result += convertHundreds(lakhs) + "Lakh ";
    if (thousands > 0) result += convertHundreds(thousands) + "Thousand ";
    if (hundreds > 0) result += convertHundreds(hundreds);

    return result.trim() + " Rupees Only";
  };

  // Check if interstate transaction
  const isInterstate = businessDetails.state !== customerDetails.state;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:file-text" />
                <span>GST Invoice</span>
                <Chip color="primary" variant="flat">#{invoiceNumber}</Chip>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="flat" startContent={<Icon icon="lucide:mail" />} onPress={onEmailInvoice}>
                  Email
                </Button>
                <Button size="sm" variant="flat" startContent={<Icon icon="lucide:download" />} onPress={onDownloadPDF}>
                  PDF
                </Button>
                <Button size="sm" color="primary" startContent={<Icon icon="lucide:printer" />} onPress={onPrint}>
                  Print
                </Button>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="bg-white p-6 font-mono text-sm" id="gst-invoice-print">
                {/* Print Styles */}
                <style type="text/css" media="print">
                  {`
                    @page { size: A4; margin: 0.5in; }
                    body { margin: 0; padding: 0; }
                    #gst-invoice-print { width: 100%; padding: 0; font-size: 10pt; }
                    .no-print { display: none; }
                  `}
                </style>

                {/* Header */}
                <div className="text-center border-2 border-black p-4 mb-4">
                  <h1 className="text-xl font-bold">{businessDetails.name}</h1>
                  <p>{businessDetails.address}</p>
                  <p>{businessDetails.city}, {businessDetails.state} - {businessDetails.pincode}</p>
                  <p>Phone: {businessDetails.phone} | Email: {businessDetails.email}</p>
                  <p className="font-bold">GSTIN: {businessDetails.gstin}</p>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border border-black p-2">
                    <h3 className="font-bold mb-2">Bill To:</h3>
                    <p className="font-bold">{customerDetails.name}</p>
                    {customerDetails.address && <p>{customerDetails.address}</p>}
                    {customerDetails.city && <p>{customerDetails.city}, {customerDetails.state} - {customerDetails.pincode}</p>}
                    {customerDetails.gstin && <p>GSTIN: {customerDetails.gstin}</p>}
                    {customerDetails.phone && <p>Phone: {customerDetails.phone}</p>}
                  </div>
                  <div className="border border-black p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p><strong>Invoice No:</strong></p>
                        <p><strong>Invoice Date:</strong></p>
                        <p><strong>Place of Supply:</strong></p>
                        <p><strong>Payment Terms:</strong></p>
                      </div>
                      <div>
                        <p>{invoiceNumber}</p>
                        <p>{invoiceDate.toLocaleDateString('en-IN')}</p>
                        <p>{customerDetails.state || businessDetails.state}</p>
                        <p>Immediate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse border border-black text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black p-1 text-left">S.No</th>
                      <th className="border border-black p-1 text-left">Description</th>
                      <th className="border border-black p-1 text-left">HSN</th>
                      <th className="border border-black p-1 text-right">Qty</th>
                      <th className="border border-black p-1 text-right">Unit</th>
                      <th className="border border-black p-1 text-right">Rate</th>
                      <th className="border border-black p-1 text-right">Amount</th>
                      <th className="border border-black p-1 text-right">Disc</th>
                      <th className="border border-black p-1 text-right">Taxable</th>
                      {isInterstate ? (
                        <th className="border border-black p-1 text-right">IGST</th>
                      ) : (
                        <>
                          <th className="border border-black p-1 text-right">CGST</th>
                          <th className="border border-black p-1 text-right">SGST</th>
                        </>
                      )}
                      <th className="border border-black p-1 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-black p-1">{index + 1}</td>
                        <td className="border border-black p-1">{item.name}</td>
                        <td className="border border-black p-1">{item.hsn}</td>
                        <td className="border border-black p-1 text-right">{item.quantity}</td>
                        <td className="border border-black p-1 text-right">{item.unit}</td>
                        <td className="border border-black p-1 text-right">₹{item.rate.toFixed(2)}</td>
                        <td className="border border-black p-1 text-right">₹{(item.rate * item.quantity).toFixed(2)}</td>
                        <td className="border border-black p-1 text-right">₹{item.discount.toFixed(2)}</td>
                        <td className="border border-black p-1 text-right">₹{item.taxableValue.toFixed(2)}</td>
                        {isInterstate ? (
                          <td className="border border-black p-1 text-right">
                            {item.igstRate}%<br/>₹{item.igstAmount.toFixed(2)}
                          </td>
                        ) : (
                          <>
                            <td className="border border-black p-1 text-right">
                              {item.cgstRate}%<br/>₹{item.cgstAmount.toFixed(2)}
                            </td>
                            <td className="border border-black p-1 text-right">
                              {item.sgstRate}%<br/>₹{item.sgstAmount.toFixed(2)}
                            </td>
                          </>
                        )}
                        <td className="border border-black p-1 text-right font-bold">₹{item.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="font-bold">Amount in Words:</p>
                    <p className="border border-black p-2 min-h-16">
                      {convertToWords(totals.finalAmount)}
                    </p>
                  </div>
                  <div>
                    <table className="w-full border-collapse border border-black text-xs">
                      <tr>
                        <td className="border border-black p-1">Subtotal</td>
                        <td className="border border-black p-1 text-right">₹{totals.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">Discount</td>
                        <td className="border border-black p-1 text-right">₹{totals.totalDiscount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1">Taxable Amount</td>
                        <td className="border border-black p-1 text-right">₹{totals.taxableValue.toFixed(2)}</td>
                      </tr>
                      {isInterstate ? (
                        <tr>
                          <td className="border border-black p-1">IGST</td>
                          <td className="border border-black p-1 text-right">₹{totals.totalIGST.toFixed(2)}</td>
                        </tr>
                      ) : (
                        <>
                          <tr>
                            <td className="border border-black p-1">CGST</td>
                            <td className="border border-black p-1 text-right">₹{totals.totalCGST.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td className="border border-black p-1">SGST</td>
                            <td className="border border-black p-1 text-right">₹{totals.totalSGST.toFixed(2)}</td>
                          </tr>
                        </>
                      )}
                      <tr>
                        <td className="border border-black p-1">Round Off</td>
                        <td className="border border-black p-1 text-right">₹{totals.roundOff.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-gray-100 font-bold">
                        <td className="border border-black p-1">Grand Total</td>
                        <td className="border border-black p-1 text-right">₹{totals.finalAmount.toFixed(2)}</td>
                      </tr>
                    </table>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mt-4 border border-black p-2">
                  <h4 className="font-bold mb-2">Payment Details:</h4>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p><strong>Payment Method:</strong> {paymentDetails.methodName}</p>
                      <p><strong>Amount Received:</strong> ₹{paymentDetails.amountReceived.toFixed(2)}</p>
                    </div>
                    <div>
                      <p><strong>Payment Status:</strong> 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          paymentDetails.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          paymentDetails.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {paymentDetails.paymentStatus.toUpperCase()}
                        </span>
                      </p>
                      {paymentDetails.change > 0 && <p><strong>Change:</strong> ₹{paymentDetails.change.toFixed(2)}</p>}
                    </div>
                    <div>
                      {paymentDetails.pendingAmount > 0 && (
                        <p className="text-red-600"><strong>Pending:</strong> ₹{paymentDetails.pendingAmount.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center text-xs">
                  <p>This is a computer generated invoice and does not require signature.</p>
                  <p className="mt-2">Thank you for your business!</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="no-print">
              <Button variant="flat" onPress={onClose}>Close</Button>
              <Button color="primary" startContent={<Icon icon="lucide:printer" />} onPress={onPrint}>
                Print Invoice
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
