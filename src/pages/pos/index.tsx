import React from "react";
import { addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ProductCatalog } from "../../components/pos/product-catalog";
import { Product, Customer } from "../../types/pos";
import {
  ProductService,
  CustomerService,
  InvoiceService,
} from "../../services/database-factory";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import { InvoiceView } from "../../components/pos/invoice-view";

export const POSPage: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchQuery, setSearchQuery] = React.useState("");

  const [invoiceNumber, setInvoiceNumber] = React.useState(
    "INV-" +
      new Date().toISOString().slice(2, 10).replace(/-/g, "") +
      "-" +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
  );

  const [roundOff, setRoundOff] = React.useState(0);
  const [paymentMode, setPaymentMode] = React.useState("Cash");
  const [amountReceived, setAmountReceived] = React.useState("0.00");
  const [billNumber, setBillNumber] = React.useState("10");
  const [showInvoiceView, setShowInvoiceView] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [searchCustomerQuery, setSearchCustomerQuery] = React.useState("");
  const [filteredCustomers, setFilteredCustomers] = React.useState<Customer[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAddCustomer, setShowAddCustomer] = React.useState(false);
  const [newCustomer, setNewCustomer] = React.useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const shortcutKeys = {
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
    saveAndPrint: "Ctrl+P",
  };

  // Load products and customers from database
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load products
        const productsData = await ProductService.getAll();
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Load customers
        const customersData = await CustomerService.getAll();
        setCustomers(customersData);
        setFilteredCustomers(customersData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          title: "Error loading data",
          description:
            "Failed to load products and customers. Please try again.",
          severity: "danger",
        });
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Search products
  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.hsn?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Search customers
  React.useEffect(() => {
    if (searchCustomerQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name
            .toLowerCase()
            .includes(searchCustomerQuery.toLowerCase()) ||
          customer.phone.includes(searchCustomerQuery) ||
          customer.email
            ?.toLowerCase()
            .includes(searchCustomerQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchCustomerQuery, customers]);

  // Sample products based on the image
  const sampleBillItems = [
    {
      id: "p1",
      itemCode: "38671572297",
      name: "Basmati Rice, 1Kg",
      price: 200.0,
      quantity: 1.0,
      discount: 20.0,
      taxApplied: 0.0,
      total: 180.0,
      hsn: "1006",
    },
    {
      id: "p2",
      itemCode: "38645371846",
      name: "Fortune Oil, 1L",
      price: 113.0,
      quantity: 1.0,
      discount: 13.56,
      taxApplied: 4.97,
      total: 104.41,
      hsn: "1512",
    },
    {
      id: "p3",
      itemCode: "38658999396",
      name: "Surf Excel Powder, 3Kg",
      price: 555.0,
      quantity: 1.0,
      discount: 66.6,
      taxApplied: 0.0,
      total: 488.4,
      hsn: "3402",
    },
    {
      id: "p4",
      itemCode: "38678387182",
      name: "Maggi, 4pack",
      price: 300.0,
      quantity: 1.0,
      discount: 36.0,
      taxApplied: 13.2,
      total: 277.2,
      hsn: "1902",
    },
  ];

  const [billItems, setBillItems] = React.useState(sampleBillItems);

  // Calculate bill totals
  const subTotal = billItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemDiscount = billItems.reduce((sum, item) => sum + item.discount, 0);
  const itemTax = billItems.reduce((sum, item) => sum + item.taxApplied, 0);

  // Update the roundOff state with the fixed value from the image
  React.useEffect(() => {
    setRoundOff(-0.01);
  }, []);

  const totalAmount =
    billItems.reduce((sum, item) => sum + item.total, 0) + roundOff;

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

    // Convert Product to CartItem format
    const cartItem = {
      id: product.id,
      itemCode: product.barcode || product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      discount: 0,
      taxApplied: (product.price * (product.taxRate || 18)) / 100,
      total: product.price + (product.price * (product.taxRate || 18)) / 100,
      hsn: product.hsn || "",
    };

    setBillItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total:
                  (item.quantity + 1) * item.price +
                  item.taxApplied * (item.quantity + 1),
              }
            : item
        );
      } else {
        return [...prevItems, cartItem];
      }
    });

    addToast({
      title: "Item added",
      description: `${product.name} added to cart.`,
      severity: "success",
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    const product = products.find((p) => p.id === id);
    if (product && quantity > product.stock) {
      addToast({
        title: "Insufficient stock",
        description: `Only ${product.stock} items available in stock.`,
        severity: "warning",
      });
      return;
    }

    setBillItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newTotal = item.price * quantity + item.taxApplied * quantity;
          return { ...item, quantity, total: parseFloat(newTotal.toFixed(2)) };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setBillItems((prevItems) => prevItems.filter((item) => item.id !== id));
    addToast({
      title: "Item removed",
      description: "Item has been removed from cart.",
      severity: "success",
    });
  };

  const handleClearCart = () => {
    setBillItems([]);
    addToast({
      title: "Cart cleared",
      description: "All items have been removed from cart.",
      severity: "success",
    });
  };

  const handleNewBill = () => {
    setBillItems([]);
    setBillNumber((parseInt(billNumber) + 1).toString());
  };

  const handleSaveAndPrint = async () => {
    if (billItems.length === 0) {
      addToast({
        title: "No items",
        description: "Please add items to the cart before saving.",
        severity: "warning",
      });
      return;
    }

    try {
      // Create invoice data
      const invoiceData = {
        invoiceNumber,
        customer:
          selectedCustomer && selectedCustomer.trim() ? selectedCustomer : null,
        date: new Date(),
        items: billItems,
        subtotal: subTotal,
        discount: itemDiscount,
        taxAmount: itemTax,
        roundOff,
        amount: totalAmount,
        paymentMethod: paymentMode,
        amountReceived: parseFloat(amountReceived) || 0,
        change: calculateChange(),
        status: "completed" as const,
      };

      // Save invoice to database
      await InvoiceService.createWithItems(invoiceData, billItems);

      addToast({
        title: "Invoice saved",
        description: `Invoice ${invoiceNumber} has been saved successfully.`,
        severity: "success",
      });

      // Show invoice view for printing
      setShowInvoiceView(true);

      // Clear the bill after successful save
      setBillItems([]);
      setSelectedCustomer("");
      setSearchCustomerQuery("");

      // Generate new invoice number
      setInvoiceNumber(
        "INV-" +
          new Date().toISOString().slice(2, 10).replace(/-/g, "") +
          "-" +
          Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")
      );
    } catch (error) {
      console.error("Error saving invoice:", error);
      addToast({
        title: "Error saving invoice",
        description: "Failed to save the invoice. Please try again.",
        severity: "danger",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateChange = () => {
    const received = parseFloat(amountReceived);
    return received > totalAmount ? received - totalAmount : 0;
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      addToast({
        title: "Validation Error",
        description: "Name and phone are required fields.",
        severity: "warning",
      });
      return;
    }

    try {
      const customerData = {
        ...newCustomer,
        totalOrders: 0,
        totalSpent: 0,
        status: "active" as const,
      };

      const createdCustomer = await CustomerService.create(customerData);

      // Update customers list
      setCustomers((prev) => [...prev, createdCustomer]);

      // Select the new customer automatically
      setSelectedCustomer(createdCustomer.id);
      setSearchCustomerQuery("");

      // Reset form and close modal
      setNewCustomer({ name: "", phone: "", email: "", address: "" });
      setShowAddCustomer(false);

      addToast({
        title: "Customer Added",
        description: `${createdCustomer.name} has been added successfully.`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      addToast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        severity: "danger",
      });
    }
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
            <Icon icon="lucide:x" width={14} height={14} />
          </Button>
        </div>
        <Button
          size="sm"
          color="primary"
          startContent={<Icon icon="lucide:plus" width={14} height={14} />}
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
          value={searchQuery}
          onValueChange={setSearchQuery}
          endContent={
            <div className="flex gap-1">
              <Button isIconOnly variant="light" size="sm">
                <Icon icon="lucide:search" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={onOpen}
                aria-label="Open Product Catalog"
              >
                <Icon icon="lucide:package" />
              </Button>
            </div>
          }
        />
        {/* Product search results */}
        {searchQuery && filteredProducts.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
            {filteredProducts.slice(0, 10).map((product) => (
              <div
                key={product.id}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                onClick={() => {
                  handleAddToCart(product);
                  setSearchQuery("");
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      {product.barcode} | Stock: {product.stock}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{product.price}</div>
                    <div className="text-sm text-gray-500">
                      {product.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Bill items */}
        <div className="flex-1 overflow-auto">
          <Table removeWrapper aria-label="Bill items" className="min-w-full">
            <TableHeader>
              <TableColumn className="bg-gray-50 text-xs w-10">#</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">
                ITEM CODE
              </TableColumn>
              <TableColumn className="bg-gray-50 text-xs">
                ITEM NAME
              </TableColumn>
              <TableColumn className="bg-gray-50 text-xs">QTY</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">UNIT</TableColumn>
              <TableColumn className="bg-gray-50 text-xs">
                <div>PRICE/UNIT(₹)</div>
                <div className="text-[10px] text-gray-500">Without Tax</div>
              </TableColumn>
              <TableColumn className="bg-gray-50 text-xs">
                DISCOUNT (₹)
              </TableColumn>
              <TableColumn className="bg-gray-50 text-xs">
                TAX APPLIED(₹)
              </TableColumn>
              <TableColumn className="bg-gray-50 text-xs">TOTAL(₹)</TableColumn>
            </TableHeader>
            <TableBody>
              {billItems.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.itemCode}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{item.name}</span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleRemoveItem(item.id)}
                        className="ml-2"
                      >
                        <Icon icon="lucide:trash-2" width={14} height={14} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Icon icon="lucide:minus" width={12} height={12} />
                      </Button>
                      <Input
                        size="sm"
                        type="number"
                        value={item.quantity.toString()}
                        onValueChange={(value) => {
                          const qty = parseFloat(value) || 1;
                          handleUpdateQuantity(item.id, qty);
                        }}
                        className="w-16 text-center"
                        min="1"
                        step="0.1"
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Icon icon="lucide:plus" width={12} height={12} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.discount.toFixed(2)}</TableCell>
                  <TableCell>{item.taxApplied.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">
                    {item.total.toFixed(2)}
                  </TableCell>
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
            <div className="relative">
              <Input
                placeholder="Search for a customer by name, phone number..."
                size="sm"
                className="mb-2"
                value={searchCustomerQuery}
                onValueChange={setSearchCustomerQuery}
                endContent={<Icon icon="lucide:chevron-down" />}
              />
              {/* Customer search results */}
              {searchCustomerQuery && filteredCustomers.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-auto">
                  {filteredCustomers.slice(0, 5).map((customer) => (
                    <div
                      key={customer.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                      onClick={() => {
                        setSelectedCustomer(customer.id);
                        setSearchCustomerQuery("");
                      }}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">
                        {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="text-sm text-gray-500">
                          {customer.email}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedCustomer && (
              <div className="mt-2 p-2 bg-blue-50 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Selected Customer:
                    </div>
                    <div className="text-sm text-gray-600">
                      {customers.find((c) => c.id === selectedCustomer)?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {customers.find((c) => c.id === selectedCustomer)?.phone}
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setSelectedCustomer("");
                      setSearchCustomerQuery("");
                    }}
                  >
                    <Icon icon="lucide:x" width={14} height={14} />
                  </Button>
                </div>
              </div>
            )}
            <Button
              size="sm"
              color="primary"
              variant="flat"
              className="mt-2"
              startContent={<Icon icon="lucide:user-plus" />}
              onPress={() => setShowAddCustomer(true)}
            >
              Add New Customer
            </Button>
          </div>

          {/* Bill details */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Bill Details</h2>
              {billItems.length > 0 && (
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={handleClearCart}
                  startContent={
                    <Icon icon="lucide:trash-2" width={14} height={14} />
                  }
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Total:</span>
                <span className="font-medium">₹ {subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Item Discount:</span>
                <span className="font-medium text-red-600">
                  - ₹ {itemDiscount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Item Tax:</span>
                <span className="font-medium">₹ {itemTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Round Off:</span>
                <span className="font-medium text-red-600">
                  - ₹ {Math.abs(roundOff).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-800 font-medium">Total Amount</span>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    (Items: {billItems.length}, Quantity:{" "}
                    {billItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </div>
                  <div className="font-bold text-lg">
                    ₹ {totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment section */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-2">Cash/UPI</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Payment Mode:
                </label>
                <Select
                  size="sm"
                  selectedKeys={[paymentMode]}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full"
                  aria-label="Payment Mode"
                  label="Payment Mode"
                >
                  <SelectItem key="Cash">Cash</SelectItem>
                  <SelectItem key="UPI">UPI</SelectItem>
                  <SelectItem key="Card">Card</SelectItem>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Amount Received:
                </label>
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
                <span className="font-medium">
                  ₹ {calculateChange().toFixed(2)}
                </span>
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
              <Button
                variant="flat"
                className="rounded-none py-2"
                size="sm"
                color="secondary"
              >
                Loyalty Points [{shortcutKeys.loyaltyPoints}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm">
                Remarks [{shortcutKeys.remarks}]
              </Button>
              <Button variant="flat" className="rounded-none py-2" size="sm">
                Partial Pay [{shortcutKeys.partialPay}]
              </Button>
              <Button
                variant="flat"
                className="rounded-none py-2 col-span-2"
                size="sm"
                color="primary"
              >
                Multi Pay [{shortcutKeys.multiPay}]
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Catalog Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:package" />
                  <span>Product Catalog</span>
                </div>
              </ModalHeader>
              <ModalBody>
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-default-500">Loading products...</p>
                    </div>
                  </div>
                ) : (
                  <ProductCatalog
                    products={filteredProducts}
                    onAddToCart={handleAddToCart}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add Customer Modal */}
      <Modal isOpen={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:user-plus" />
                  <span>Add New Customer</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Customer Name"
                    placeholder="Enter customer name"
                    value={newCustomer.name}
                    onValueChange={(value) =>
                      setNewCustomer((prev) => ({ ...prev, name: value }))
                    }
                    isRequired
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Enter phone number"
                    value={newCustomer.phone}
                    onValueChange={(value) =>
                      setNewCustomer((prev) => ({ ...prev, phone: value }))
                    }
                    isRequired
                  />
                  <Input
                    label="Email"
                    placeholder="Enter email address"
                    type="email"
                    value={newCustomer.email}
                    onValueChange={(value) =>
                      setNewCustomer((prev) => ({ ...prev, email: value }))
                    }
                  />
                  <Input
                    label="Address"
                    placeholder="Enter address"
                    value={newCustomer.address}
                    onValueChange={(value) =>
                      setNewCustomer((prev) => ({ ...prev, address: value }))
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddCustomer}>
                  Add Customer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
