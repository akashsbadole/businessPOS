import React from "react";
import { Icon } from "@iconify/react";
import { ProductCatalog } from "../../components/pos/product-catalog";
import { ProductSearchModal } from "../../components/pos/product-search-modal";
import { Product, Customer } from "../../types/pos";
import { usePOSStore } from "../../stores/pos-store";
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
  Kbd,
} from "@heroui/react";
import { InvoiceView } from "../../components/pos/invoice-view";

export const POSPage: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Zustand store
  const {
    cartItems,
    selectedCustomer,
    searchQuery,
    isProductSearchOpen,
    invoiceNumber,
    paymentMode,
    amountReceived,
    roundOff,
    isLoading,
    showInvoiceView,
    currentTransaction,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    setSearchQuery,
    openProductSearch,
    closeProductSearch,
    setSelectedCustomer,
    setPaymentMode,
    setAmountReceived,
    setRoundOff,
    generateInvoiceNumber,
    processCheckout,
    setShowInvoiceView,
  } = usePOSStore();

  // Local state for non-store data
  const [products, setProducts] = React.useState<Product[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [searchCustomerQuery, setSearchCustomerQuery] = React.useState("");
  const [filteredCustomers, setFilteredCustomers] = React.useState<Customer[]>(
    []
  );
  const [showAddCustomer, setShowAddCustomer] = React.useState(false);
  const [newCustomer, setNewCustomer] = React.useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Calculate totals from cart items
  const subTotal = React.useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const itemDiscount = React.useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.discount || 0) * item.quantity,
      0
    );
  }, [cartItems]);

  const itemTax = React.useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.taxAmount || 0) * item.quantity,
      0
    );
  }, [cartItems]);

  const totalAmount = React.useMemo(() => {
    return subTotal - itemDiscount + itemTax + roundOff;
  }, [subTotal, itemDiscount, itemTax, roundOff]);

  const calculateChange = () => {
    return Math.max(0, amountReceived - totalAmount);
  };

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
    searchProduct: "Ctrl+F",
  };

  // Initialize invoice number on mount
  React.useEffect(() => {
    if (!invoiceNumber) {
      generateInvoiceNumber();
    }
  }, [invoiceNumber, generateInvoiceNumber]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
        openProductSearch();
      }
      if (event.key === "Escape" && isProductSearchOpen) {
        closeProductSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isProductSearchOpen, openProductSearch, closeProductSearch]);

  // Load sample data for now
  React.useEffect(() => {
    // Sample products
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Sample Product 1",
        price: 100,
        stock: 50,
        category: "Electronics",
        barcode: "123456789",
        hsn: "8517",
        taxRate: 18,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Sample Product 2",
        price: 200,
        stock: 30,
        category: "Clothing",
        barcode: "987654321",
        hsn: "6109",
        taxRate: 12,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Sample customers
    const sampleCustomers: Customer[] = [
      {
        id: "1",
        name: "John Doe",
        phone: "9876543210",
        email: "john@example.com",
        address: "123 Main St",
        totalOrders: 5,
        totalSpent: 1000,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
    setCustomers(sampleCustomers);
    setFilteredCustomers(sampleCustomers);
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

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      alert("Name and phone are required fields.");
      return;
    }

    const createdCustomer: Customer = {
      id: `cust_${Date.now()}`,
      ...newCustomer,
      totalOrders: 0,
      totalSpent: 0,
      status: "active" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update customers list
    setCustomers((prev) => [...prev, createdCustomer]);

    // Select the new customer automatically
    setSelectedCustomer(createdCustomer);
    setSearchCustomerQuery("");

    // Reset form and close modal
    setNewCustomer({ name: "", phone: "", email: "", address: "" });
    setShowAddCustomer(false);

    alert(`${createdCustomer.name} has been added successfully.`);
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
          onFocus={openProductSearch}
          endContent={
            <div className="flex gap-1">
              <Kbd className="hidden sm:inline-block">Ctrl+F</Kbd>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={openProductSearch}
              >
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
        {/* Quick search results */}
        {searchQuery && filteredProducts.length > 0 && !isProductSearchOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
            {filteredProducts.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                onClick={() => {
                  addToCart(product);
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
            <div className="p-2 text-center border-t bg-gray-50">
              <Button
                size="sm"
                variant="flat"
                onPress={openProductSearch}
                startContent={<Icon icon="lucide:search" />}
              >
                Advanced Search (Ctrl+F)
              </Button>
            </div>
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
              {cartItems.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.barcode || item.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{item.name}</span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => removeFromCart(item.id)}
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
                          updateCartItemQuantity(item.id, item.quantity - 1)
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
                          updateCartItemQuantity(item.id, qty);
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
                          updateCartItemQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Icon icon="lucide:plus" width={12} height={12} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>{(item.discount || 0).toFixed(2)}</TableCell>
                  <TableCell>{(item.taxAmount || 0).toFixed(2)}</TableCell>
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
                        setSelectedCustomer(customer);
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
                      {selectedCustomer?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedCustomer?.phone}
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setSelectedCustomer(null);
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
              {cartItems.length > 0 && (
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={clearCart}
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
                    (Items: {cartItems.length}, Quantity:{" "}
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
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
                  onSelectionChange={(keys) =>
                    setPaymentMode(Array.from(keys)[0] as string)
                  }
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
                  value={amountReceived.toString()}
                  onValueChange={(value) =>
                    setAmountReceived(parseFloat(value) || 0)
                  }
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
              onPress={async () => {
                const success = await processCheckout();
                if (success) {
                  addToast({
                    title: "Sale completed",
                    description: "Transaction saved successfully",
                    severity: "success",
                  });
                } else {
                  addToast({
                    title: "Error",
                    description: "Failed to process checkout",
                    severity: "danger",
                  });
                }
              }}
              startContent={<Icon icon="lucide:printer" />}
              isDisabled={cartItems.length === 0}
              isLoading={isLoading}
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
                    onAddToCart={addToCart}
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

      {/* Product Search Modal */}
      <ProductSearchModal
        isOpen={isProductSearchOpen}
        onClose={closeProductSearch}
      />

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
        billItems={cartItems}
        billNumber={invoiceNumber}
        subTotal={subTotal}
        itemDiscount={itemDiscount}
        itemTax={itemTax}
        roundOff={roundOff}
        totalAmount={totalAmount}
        paymentMode={paymentMode}
        onPrint={() => {
          // Print functionality
          window.print();
          clearCart();
        }}
      />
    </div>
  );
};
