import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface BillItem {
  id: string;
  itemCode: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  taxApplied: number;
  total: number;
  hsn: string;
}

interface InvoiceViewProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  billItems: BillItem[];
  billNumber: string;
  subTotal: number;
  itemDiscount: number;
  itemTax: number;
  roundOff: number;
  totalAmount: number;
  paymentMode: string;
  onPrint: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  isOpen,
  onOpenChange,
  billItems,
  billNumber,
  subTotal,
  itemDiscount,
  itemTax,
  roundOff,
  totalAmount,
  paymentMode,
  onPrint,
}) => {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Convert number to words
  const convertToWords = (num: number) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num === 0) return "Zero";

    const sayNumberInWords = (n: number) => {
      if (n < 20) return units[n];
      if (n < 100)
        return (
          tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + units[n % 10] : "")
        );
      if (n < 1000)
        return (
          units[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 !== 0 ? " " + sayNumberInWords(n % 100) : "")
        );
      if (n < 100000)
        return (
          sayNumberInWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 !== 0 ? " " + sayNumberInWords(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          sayNumberInWords(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 !== 0 ? " " + sayNumberInWords(n % 100000) : "")
        );
      return (
        sayNumberInWords(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 !== 0 ? " " + sayNumberInWords(n % 10000000) : "")
      );
    };

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let result = sayNumberInWords(rupees) + " Rupees";
    if (paise > 0) {
      result += " and " + sayNumberInWords(paise) + " Paise";
    }

    return result + " Only";
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <span>Invoice Preview</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon="lucide:download" />}
                >
                  Download PDF
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  startContent={<Icon icon="lucide:printer" />}
                  onPress={onPrint}
                >
                  Print Invoice
                </Button>
              </div>
            </ModalHeader>
            <ModalBody>
              <div
                className="bg-white p-6 font-mono text-sm print:p-0"
                id="invoice-print"
              >
                {/* Print-specific styles */}
                <style type="text/css" media="print">
                  {`
                    @page { 
                      size: 80mm 297mm; 
                      margin: 0; 
                    }
                    body { 
                      margin: 0; 
                      padding: 0;
                    }
                    #invoice-print {
                      width: 80mm;
                      padding: 5mm;
                      font-size: 10pt;
                    }
                    .no-print {
                      display: none;
                    }
                  `}
                </style>

                <div className="text-center mb-4">
                  <h3 className="font-bold text-base">Akash Badole</h3>
                  <p>123, Main Road, Andheri East</p>
                  <p>Mumbai, Maharashtra - 400069</p>
                  <p>GSTIN: 27AADCB2230M1ZT</p>
                  <p>Phone: +91 9876543210</p>
                </div>

                <div className="flex justify-between mb-4">
                  <div>
                    <p>Invoice: #{billNumber}</p>
                    <p>Date: {currentDate}</p>
                  </div>
                  <div>
                    <p>Time: {currentTime}</p>
                    <p>Cashier: Raj Kumar</p>
                  </div>
                </div>

                <Divider className="my-2" />

                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="py-1">#</th>
                      <th className="py-1">Item</th>
                      <th className="py-1 text-right">Qty</th>
                      <th className="py-1 text-right">Price</th>
                      <th className="py-1 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billItems.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-1">{index + 1}</td>
                        <td className="py-1">
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500">
                            HSN: {item.hsn}
                          </div>
                        </td>
                        <td className="py-1 text-right">
                          {item.quantity.toFixed(2)}
                        </td>
                        <td className="py-1 text-right">
                          {item.price.toFixed(2)}
                        </td>
                        <td className="py-1 text-right">
                          {item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Divider className="my-2" />

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Item Discount:</span>
                    <span>-₹{itemDiscount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST:</span>
                    <span>₹{itemTax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>CGST (9%):</span>
                    <span>₹{(itemTax / 2).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>SGST (9%):</span>
                    <span>₹{(itemTax / 2).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Round Off:</span>
                    <span>-₹{Math.abs(roundOff).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-bold pt-2 border-t border-gray-300 mt-1">
                    <span>Total:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs">
                  <p className="font-medium">Amount in words:</p>
                  <p>{convertToWords(totalAmount)}</p>
                </div>

                <div className="mt-3">
                  <p className="font-medium">Payment Method: {paymentMode}</p>
                </div>

                <Divider className="my-3" />

                <div className="text-center mt-4">
                  <p className="font-medium">Thank you for shopping with us!</p>
                  <p className="text-xs mt-1">Visit us again</p>
                  <p className="text-xs mt-3">Powered by businessPOS</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="no-print">
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                startContent={<Icon icon="lucide:printer" />}
                onPress={onPrint}
              >
                Print Invoice
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
