import React from "react";
import { addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ProductCatalog } from "../../components/pos/product-catalog";
import { Cart } from "../../components/pos/cart";
import { Product, CartItem } from "../../types/pos";
import { sampleProducts } from "../../data/sample-data";
import { Button, Card, CardBody, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Tabs, Tab, Select, SelectItem } from "@heroui/react";
import { InvoiceView } from "../../components/pos/invoice-view";

export const POSPage: React.FC = () => {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = React.useState("pos");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [invoiceNumber, setInvoiceNumber] = React.useState("INV-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"));
  const [discount, setDiscount] = React.useState(0);
  const [roundOff, setRoundOff] = React.useState(0);
  const [paymentMode, setPaymentMode] = React.useState("Cash");
  const [amountReceived, setAmountReceived] = React.useState("0.00");
  const [billNumber, setBillNumber] = React.useState("10");
  const [showInvoiceView, setShowInvoiceView] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState("");
  const [shortcutKeys, setShortcutKeys] = React.useState({
    newBill: "Ctrl+T",
    changeQuantity: "F2",
    itemDiscount: "F3",
    removeItem: "F4",
    billTax: "F7",
    billDiscount: "F9",
    loyaltyPoints: "F10",
    remarks: "F12",
    partialPay: "Ctrl+B",
    multiPay: "Ctrl+M",
    saveAndPrint: "Ctrl+P"
  });
  
  // Sample products based on the image
  const sampleBillItems = [
    {
      id: "p1",
      itemCode: "38671572297",
      name: "Basmati Rice, 1Kg",
      price: 200.00,
      quantity: 1.00,
      discount: 20.00,
      taxApplied: 0.00,
      total: 180.00,
      hsn: "1006"
    },
    {
      id: "p2",
      itemCode: "38645371846",
      name: "Fortune Oil, 1L",
      price: 113.00,
      quantity: 1.00,
      discount: 13.56,
      taxApplied: 4.97,
      total: 104.41,
      hsn: "1512"
    },
    {
      id: "p3",
      itemCode: "38658999396",
      name: "Surf Excel Powder, 3Kg",
      price: 555.00,
      quantity: 1.00,
      discount: 66.60,
      taxApplied: 0.00,
      total: 488.40,
      hsn: "3402"
    },
    {
      id: "p4",
      itemCode: "38678387182",
      name: "Maggi, 4pack",
      price: 300.00,
      quantity: 1.00,
      discount: 36.00,
      taxApplied: 13.20,
      total: 277.20,
      hsn: "1902"
    }
  ];
  
  const [billItems, setBillItems] = React.useState(sampleBillItems);
  
  // Calculate bill totals
  const subTotal = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemDiscount = billItems.reduce((sum, item) => sum + item.discount, 0);
  const itemTax = billItems.reduce((sum, item) => sum + item.taxApplied, 0);
  
  // Update the roundOff state with the fixed value from the image
  React.useEffect(() => {
    setRoundOff(-0.01);
  }, []);
  
  const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0) + roundOff;
  
  React.useEffect(() => {
    setAmountReceived(totalAmount.toFixed(2));
  }, [totalAmount]);
  
  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      addToast({
        title: "Out of stock",
        description: `${product.name} is currently out of stock.`,
        severity: "danger",
      });
      return;
    }
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newTotal = (item.price * quantity) - item.discount + item.taxApplied;
          return { ...item, quantity, total: parseFloat(newTotal.toFixed(2)) };
        }
        return item;
      })
    );
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleClearCart = () => {
    setCartItems([]);
  };
  
  const handleCheckout = (paymentMethod: string) => {
    addToast({
      title: "Sale completed",
      description: `Payment received via ${paymentMethod}.`,
      severity: "success",
    });
    
    // In a real app, this would send the transaction to the server
    console.log("Checkout completed with payment method:", paymentMethod);
    console.log("Cart items:", cartItems);
    console.log("Invoice:", {
      invoiceNumber,
      subtotal,
      gstAmount,
      discount,
      roundOff,
      total,
      customerPhone
    });
    
    setCartItems([]);
    onOpenChange(false);
    
    // Generate new invoice number for next sale
    setInvoiceNumber("INV-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"));
  };
  
  const handleNewBill = () => {
    setBillItems([]);
    setBillNumber((parseInt(billNumber) + 1).toString());
  };
  
  const handleSaveAndPrint = () => {
    // In a real app, this would save the invoice to the database
    // and send it to the printer
    setShowInvoiceView(true);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const calculateChange = () => {
    const received = parseFloat(amountReceived);
    return received > totalAmount ? received - totalAmount : 0;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with customer support */}
      <div className="bg-white border-b border-gray-200 py-2 px-4 flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="text-center">
          <span className="text-gray-600">Customer Support : </span>
          <a href="tel:+919333911911" className="text-blue-600 ml-1">
            <Icon icon="lucide:phone" className="inline mr-1" />
            (+91) 9333 911 911
          </a>
          <span className="mx-1">|</span>
          <a href="tel:+916366827420" className="text-green-600">
            <Icon icon="lucide:phone" className="inline mr-1" />
            (+91) 6366827420
          </a>
        </div>
        <div className="flex-1 flex justify-end">
          <Button isIconOnly variant="light" size="sm">
            <Icon icon="lucide:settings" />
          </Button>
          <Button isIconOnly variant="light" size="sm">
            <Icon icon="lucide:minus" />
          </Button>
          <Button isIconOnly variant="light" size="sm">
            <Icon icon="lucide:x" />
          </Button>
        </div>
      </div>
      
      {/* Tab bar with bill number */}
      <div className="flex items-center bg-gray-100 px-2 py-1 border-b border-gray-200">
        <div className="flex items-center mr-2">
          <span className="text-gray-600 px-2 py-1">#{billNumber}</span>
          <Button isIconOnly variant="light" size="sm" className="ml-1">
            <Icon icon="lucide:x" size={14} />
          </Button>
        </div>
        <Button 
          size="sm"
          color="primary"
          startContent={<Icon icon="lucide:plus" size={14} />}
          onPress={handleNewBill}
        >
          New Bill [{shortcutKeys.newBill}]
        </Button>
      </div>
      
      {/* Search bar */}
      <div className="p-2 border-b border-gray-200">
        <Input
          placeholder="Scan or search by item code, model no or item name"
          size="sm"
          endContent={
            <Button isIconOnly variant="light" size="sm">
              <Icon icon="lucide:search" />
            </Button>
          }
        />
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Bill items */}
        <div className="flex-1 overflow-auto">
          <Table 
            removeWrapper 
            aria-label="Bill items"
            className="min-w-full"
          >
            <TableHeader>
              <TableColumn className="bg-gray-50 text-xs w-10">#</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">ITEM CODE</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">ITEM NAME</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">QTY</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">UNIT</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">
                <div>PRICE/UNIT(₹)</div>
                <div className="text-[10px] text-gray-500">Without Tax</div>
              </TableColumn>
              <TableColumn className="bg-gray-50 text-xs">DISCOUNT (₹)</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">TAX APPLIED(₹)</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">TOTAL(₹)</TableColumn>
            </TableHeader>
            <TableBody>
              {billItems.map((item, index) => (
                <TableRow key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.itemCode}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity.toFixed(2)}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.discount.toFixed(2)}</TableCell>
                  <TableCell>{item.taxApplied.toFixed(2)}</TableCell>
                  <TableCell>{item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Right side - Customer and bill details */}
        <div className="w-80 border-l border-gray-200 flex flex-col">
          {/* Customer details */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-2">Customer Details</h2>
            <Input
              placeholder="Search for a customer by name, phone number..."
              size="sm"
              className="mb-2"
              endContent={<Icon icon="lucide:chevron-down" />}
            />
          </div>
          
          {/* Bill details */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-2">Bill Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Total:</span>
                <span className="font-medium">₹ {subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Item Discount:</span>
                <span className="font-medium text-red-600">- ₹ {itemDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Item Tax:</span>
                <span className="font-medium">₹ {itemTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Round Off:</span>
                <span className="font-medium text-red-600">- ₹ {Math.abs(roundOff).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-800 font-medium">Total Amount</span>
                <div className="text-right">
                  <div className="text-xs text-gray-500">(Items: {billItems.length}, Quantity: {billItems.reduce((sum, item) => sum + item.quantity, 0)})</div>
                  <div className="font-bold text-lg">₹ {totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment section */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-2">Cash/UPI</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Payment Mode:</label>
                <Select
                  size="sm"
                  selectedKeys={[paymentMode]}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full"
                >
                  <SelectItem key="Cash" value="Cash">Cash</SelectItem>
                  <SelectItem key="UPI" value="UPI">UPI</SelectItem>
                  <SelectItem key="Card" value="Card">Card</SelectItem>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Amount Received:</label>
                <Input
                  size="sm"
                  type="number"
                  value={amountReceived}
                  onValueChange={setAmountReceived}
                  startContent="₹"
                  className="w-full"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Change to Return:</span>
                <span className="font-medium">₹ {calculateChange().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-auto">
            <Button
              color="success"
              className="w-full py-3 rounded-none"
              onPress={handleSaveAndPrint}
              startContent={<Icon icon="lucide:printer" />}
            >
              Save & Print Bill [{shortcutKeys.saveAndPrint}]
            </Button>
            
            <div className="grid grid-cols-2 gap-px bg-gray-200">
              <Button variant="flat" className="rounded-none py-2" size="sm">
                Change Quantity [{shortcutKeys.changeQuantity}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm">
                Item Discount [{shortcutKeys.itemDiscount}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm">
                Remove Item [{shortcutKeys.removeItem}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm">
                Bill Tax [{shortcutKeys.billTax}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm">
                Bill Discount [{shortcutKeys.billDiscount}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm" color="secondary">
                Loyalty Points [{shortcutKeys.loyaltyPoints}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm">
                Remarks [{shortcutKeys.remarks}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm">
                Partial Pay [{shortcutKeys.partialPay}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm" color="primary" className="col-span-2">
                Multi Pay [{shortcutKeys.multiPay}]
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Invoice View Modal */}
      <InvoiceView 
        isOpen={showInvoiceView} 
        onOpenChange={setShowInvoiceView}
        billItems={billItems}
        billNumber={billNumber}
        subTotal={subTotal}
        itemDiscount={itemDiscount}
        itemTax={itemTax}
        roundOff={roundOff}
        totalAmount={totalAmount}
        paymentMode={paymentMode}
        onPrint={handlePrint}
      />
    </div>
  );
};