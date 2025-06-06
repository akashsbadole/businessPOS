import React from "react";
import { Icon } from "@iconify/react";
import { ProductCatalog } from "../../components/pos/product-catalog";
import { ProductSearchModal } from "../../components/pos/product-search-modal";
import { Product, Customer } from "../../types/pos";
import { usePOSStore } from "../../stores/pos-store";
import { useInventoryStore } from "../../stores/inventory-store";
import { useDatabaseStore } from "../../stores/database-store";
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
import { SmartCalculator } from "../../components/pos/smart-calculator";
import { EnhancedPaymentModal } from "../../components/pos/enhanced-payment-modal";
import { InventorySyncStatus } from "../../components/pos/inventory-sync-status";
import { QuantityModal } from "../../components/pos/quantity-modal";
import { DiscountModal } from "../../components/pos/discount-modal";
import { TaxModal } from "../../components/pos/tax-modal";
import { RemarksModal } from "../../components/pos/remarks-modal";
import {
  VoiceSearch,
  processVoiceCommand,
} from "../../components/pos/voice-search";
import { NativeVoiceSearch } from "../../components/pos/native-voice-search";
import { VoiceSearchTest } from "../../components/pos/voice-search-test";
import { AIVoiceSearch } from "../../components/pos/ai-voice-search";
import { CameraBarcodeScanner } from "../../components/pos/camera-barcode-scanner";

export const POSPage: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Zustand stores
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

  // Inventory store for products
  const {
    products: inventoryProducts,
    loadProducts,
    isLoading: isLoadingProducts,
  } = useInventoryStore();

  // Database store for real data
  const {
    products: dbProducts,
    customers: dbCustomers,
    loadProducts: loadDbProducts,
    loadCustomers: loadDbCustomers,
    addCustomer: addDbCustomer,
    saveTransaction,
    isLoading: isDbLoading,
  } = useDatabaseStore();

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

  // New component states
  const [showCalculator, setShowCalculator] = React.useState(false);
  const [showEnhancedPayment, setShowEnhancedPayment] = React.useState(false);
  const [calculatorTitle, setCalculatorTitle] = React.useState("Calculator");

  // Calculate totals from cart items with proper tax and discount calculations
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
    return cartItems.reduce((sum, item) => {
      const itemSubtotal = item.price * item.quantity;
      const itemDiscountAmount = (item.discount || 0) * item.quantity;
      const taxableAmount = itemSubtotal - itemDiscountAmount;
      const taxAmount = (taxableAmount * (item.taxRate || 18)) / 100;
      return sum + taxAmount;
    }, 0);
  }, [cartItems]);

  const totalAmount = React.useMemo(() => {
    const finalAmount = subTotal - itemDiscount + itemTax + roundOff;
    return Math.round(finalAmount * 100) / 100; // Round to 2 decimal places
  }, [subTotal, itemDiscount, itemTax, roundOff]);

  // Payment calculations
  const calculateChange = () => {
    return Math.max(0, amountReceived - totalAmount);
  };

  const calculatePendingAmount = () => {
    return Math.max(0, totalAmount - amountReceived);
  };

  const getPaymentStatus = () => {
    if (amountReceived >= totalAmount) return "paid";
    if (amountReceived > 0) return "partial";
    return "unpaid";
  };

  // Handle new bill creation
  const handleNewBill = () => {
    clearCart();
    setSelectedCustomer(null);
    setSearchCustomerQuery("");
    setAmountReceived(0);
    generateInvoiceNumber();
    console.log("New Bill Created - Ready for new transaction");
  };

  // Convert CartItem to BillItem for invoice
  const convertCartItemsToBillItems = (items: typeof cartItems) => {
    return items.map((item) => ({
      id: item.id,
      itemCode: item.barcode || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      discount: item.discount || 0,
      taxApplied: item.taxAmount || 0,
      total: item.total,
      hsn: item.hsn || "",
    }));
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

  // State for modals and dialogs
  const [showQuantityModal, setShowQuantityModal] = React.useState(false);
  const [showDiscountModal, setShowDiscountModal] = React.useState(false);
  const [showTaxModal, setShowTaxModal] = React.useState(false);
  const [showRemarksModal, setShowRemarksModal] = React.useState(false);
  const [selectedCartItemId, setSelectedCartItemId] = React.useState<
    string | null
  >(null);

  // Bill-level state
  const [billDiscount, setBillDiscount] = React.useState(0);
  const [billTaxRate, setBillTaxRate] = React.useState(0);
  const [billRemarks, setBillRemarks] = React.useState("");

  // Voice and camera features
  const [showVoiceSearch, setShowVoiceSearch] = React.useState(false);
  const [showCameraScanner, setShowCameraScanner] = React.useState(false);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      // Handle shortcuts
      switch (event.key) {
        case "F2":
          event.preventDefault();
          if (cartItems.length > 0) {
            setSelectedCartItemId(cartItems[0].id);
            setShowQuantityModal(true);
          }
          break;
        case "F3":
          event.preventDefault();
          if (cartItems.length > 0) {
            setSelectedCartItemId(cartItems[0].id);
            setShowDiscountModal(true);
          }
          break;
        case "F4":
          event.preventDefault();
          if (cartItems.length > 0) {
            removeFromCart(cartItems[0].id);
          }
          break;
        case "F7":
          event.preventDefault();
          setShowTaxModal(true);
          break;
        case "F9":
          event.preventDefault();
          setShowDiscountModal(true);
          break;
        case "F10":
          event.preventDefault();
          // Loyalty points functionality
          console.log("Loyalty points feature - F10 pressed");
          break;
        case "F12":
          event.preventDefault();
          setShowRemarksModal(true);
          break;
        case "Escape":
          event.preventDefault();
          if (isProductSearchOpen) {
            closeProductSearch();
          } else if (showQuantityModal) {
            setShowQuantityModal(false);
          } else if (showDiscountModal) {
            setShowDiscountModal(false);
          } else if (showTaxModal) {
            setShowTaxModal(false);
          } else if (showRemarksModal) {
            setShowRemarksModal(false);
          }
          break;
      }

      // Handle Ctrl combinations
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case "f":
            event.preventDefault();
            openProductSearch();
            break;
          case "t":
            event.preventDefault();
            handleNewBill();
            break;
          case "p":
            event.preventDefault();
            if (cartItems.length > 0) {
              processCheckout();
            }
            break;
          case "b":
            event.preventDefault();
            // Partial payment functionality
            setShowEnhancedPayment(true);
            break;
          case "m":
            event.preventDefault();
            // Multi payment functionality
            setShowEnhancedPayment(true);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isProductSearchOpen,
    openProductSearch,
    closeProductSearch,
    cartItems,
    removeFromCart,
    handleNewBill,
    processCheckout,
    showQuantityModal,
    showDiscountModal,
    showTaxModal,
    showRemarksModal,
  ]);

  // Initialize data
  React.useEffect(() => {
    const initializeData = async () => {
      // Load products and customers from database
      await loadDbProducts();
      await loadDbCustomers();

      // Also load from inventory store for compatibility
      await loadProducts();
    };

    initializeData();
  }, [loadDbProducts, loadDbCustomers, loadProducts]);

  // Update products when database or inventory changes
  React.useEffect(() => {
    // Prioritize database products, fallback to inventory products
    const productsToUse =
      dbProducts.length > 0 ? dbProducts : inventoryProducts;
    if (productsToUse.length > 0) {
      setProducts(productsToUse);
      setFilteredProducts(productsToUse);
    }
  }, [dbProducts, inventoryProducts]);

  // Update customers when database changes
  React.useEffect(() => {
    if (dbCustomers.length > 0) {
      // Convert database customers to POS customers format
      const posCustomers: Customer[] = dbCustomers.map((dbCustomer) => ({
        id: dbCustomer.id,
        name: dbCustomer.name,
        phone: dbCustomer.phone,
        email: dbCustomer.email || "",
        address: dbCustomer.address,
        totalOrders: dbCustomer.total_orders,
        totalSpent: dbCustomer.total_spent,
        status: dbCustomer.status as "active" | "inactive",
        city: dbCustomer.city,
        state: dbCustomer.state,
        pincode: dbCustomer.pincode,
        gstin: dbCustomer.gstin,
        createdAt: new Date(dbCustomer.created_at),
        updatedAt: new Date(dbCustomer.updated_at),
      }));
      setCustomers(posCustomers);
      setFilteredCustomers(posCustomers);
    }
  }, [dbCustomers]);

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

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      alert("Name and phone are required fields.");
      return;
    }

    try {
      // Add customer to database
      const customerId = await addDbCustomer(newCustomer);

      // Reload customers from database
      await loadDbCustomers();

      // Create customer object for immediate selection
      const createdCustomer: Customer = {
        id: customerId,
        ...newCustomer,
        email: newCustomer.email || "",
        totalOrders: 0,
        totalSpent: 0,
        status: "active" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Select the new customer automatically
      setSelectedCustomer(createdCustomer);
      setSearchCustomerQuery("");

      // Reset form and close modal
      setNewCustomer({ name: "", phone: "", email: "", address: "" });
      setShowAddCustomer(false);

      alert(`${createdCustomer.name} has been added successfully.`);
    } catch (error) {
      console.error("Failed to add customer:", error);
      alert("Failed to add customer. Please try again.");
    }
  };

  // Voice command handlers
  const voiceActions = {
    searchProduct: (query: string) => {
      setSearchQuery(query);
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    },
    addCustomer: (name: string) => {
      setNewCustomer({ ...newCustomer, name });
      setShowAddCustomer(true);
    },
    showTotal: () => {
      alert(`Total Amount: ₹${totalAmount.toFixed(2)}`);
    },
    printReceipt: () => {
      if (cartItems.length > 0) {
        processCheckout();
      } else {
        alert("Cart is empty");
      }
    },
    newBill: () => {
      clearCart();
      setSelectedCustomer(null);
    },
    addToCart: (productName: string, quantity = 1) => {
      const product = products.find((p) =>
        p.name.toLowerCase().includes(productName.toLowerCase())
      );
      if (product) {
        addToCart(product, quantity);
      } else {
        alert(`Product "${productName}" not found`);
      }
    },
  };

  const handleVoiceResult = (text: string) => {
    const result = processVoiceCommand(text, voiceActions);
    console.log("Voice command processed:", result);
  };

  const handleVoiceProductFound = (product: Product, quantity: number = 1) => {
    if (product.stock === 0) {
      alert(`${product.name} is out of stock`);
      return;
    }

    if (product.stock < quantity) {
      alert(`Only ${product.stock} ${product.name} available in stock`);
      quantity = product.stock;
    }

    addToCart(product, quantity);

    // Show success feedback
    const message = `Added ${quantity} ${product.name} to cart`;
    console.log(message);

    // You could add a toast notification here instead of alert
    // For now, we'll use a subtle alert
    setTimeout(() => {
      alert(message);
    }, 100);
  };

  const handleCameraScan = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode);
    if (product) {
      addToCart(product);
    } else {
      alert("Product not found for barcode: " + barcode);
    }
    setShowCameraScanner(false);
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
          <span className="text-gray-600 px-2 py-1">#{invoiceNumber}</span>
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

      {/* Inventory Status */}
      <div className="p-2 border-b border-gray-200">
        <InventorySyncStatus />
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
              <Kbd className="hidden sm:inline-block">Ctrl+F</Kbd>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={openProductSearch}
                title="Advanced Search"
              >
                <Icon icon="lucide:search" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => loadProducts()}
                isLoading={isLoadingProducts}
                title="Refresh Products"
              >
                <Icon icon="lucide:refresh-cw" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => setShowVoiceSearch(!showVoiceSearch)}
                title="Voice Search"
                color={showVoiceSearch ? "primary" : "default"}
              >
                <Icon icon="lucide:mic" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => setShowCameraScanner(true)}
                title="Camera Barcode Scanner"
              >
                <Icon icon="lucide:camera" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={onOpen}
                aria-label="Open Product Catalog"
                title="Product Catalog"
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
                  selectedKeys={[paymentMode.toLowerCase()]}
                  onSelectionChange={(keys) =>
                    setPaymentMode(Array.from(keys)[0] as string)
                  }
                  className="w-full"
                  aria-label="Payment Mode"
                  label="Payment Mode"
                >
                  <SelectItem key="cash">Cash</SelectItem>
                  <SelectItem key="upi">UPI</SelectItem>
                  <SelectItem key="card">Card</SelectItem>
                  <SelectItem key="wallet">Digital Wallet</SelectItem>
                  <SelectItem key="credit">Credit</SelectItem>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Amount Received:
                </label>
                <div className="flex gap-2">
                  <Input
                    size="sm"
                    type="number"
                    value={amountReceived.toString()}
                    onValueChange={(value) =>
                      setAmountReceived(parseFloat(value) || 0)
                    }
                    startContent="₹"
                    className="flex-1"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={() => {
                      setCalculatorTitle("Amount Calculator");
                      setShowCalculator(true);
                    }}
                    title="Open Calculator"
                  >
                    <Icon icon="lucide:calculator" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Change to Return:</span>
                <span className="font-medium text-green-600">
                  ₹ {calculateChange().toFixed(2)}
                </span>
              </div>

              {/* Payment Status */}
              {calculatePendingAmount() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Amount:</span>
                  <span className="font-medium text-red-600">
                    ₹ {calculatePendingAmount().toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span
                  className={`font-medium px-2 py-1 rounded text-xs ${
                    getPaymentStatus() === "paid"
                      ? "bg-green-100 text-green-800"
                      : getPaymentStatus() === "partial"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {getPaymentStatus().toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-2">
              <Button
                color="primary"
                className="py-3 rounded-none"
                onPress={() => setShowEnhancedPayment(true)}
                startContent={<Icon icon="lucide:credit-card" />}
                isDisabled={cartItems.length === 0}
              >
                Payment Options
              </Button>
              <Button
                color="success"
                className="py-3 rounded-none"
                onPress={async () => {
                  const success = await processCheckout();
                  if (success) {
                    console.log(
                      "Sale completed - Transaction saved successfully"
                    );
                  } else {
                    console.error("Error - Failed to process checkout");
                  }
                }}
                startContent={<Icon icon="lucide:printer" />}
                isDisabled={cartItems.length === 0}
                isLoading={isLoading}
              >
                Quick Cash & Print
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-px bg-gray-200">
              <Button
                variant="flat"
                className="rounded-none py-2"
                size="sm"
                onPress={() => {
                  if (cartItems.length > 0) {
                    setSelectedCartItemId(cartItems[0].id);
                    setShowQuantityModal(true);
                  }
                }}
                isDisabled={cartItems.length === 0}
              >
                Change Quantity [{shortcutKeys.changeQuantity}]
              </Button>
              <Button
                variant="flat"
                className="rounded-none py-2"
                size="sm"
                onPress={() => {
                  if (cartItems.length > 0) {
                    setSelectedCartItemId(cartItems[0].id);
                    setShowDiscountModal(true);
                  }
                }}
                isDisabled={cartItems.length === 0}
              >
                Item Discount [{shortcutKeys.itemDiscount}]
              </Button>
              <Button
                variant="flat"
                className="rounded-none py-2"
                size="sm"
                onPress={() => {
                  if (cartItems.length > 0) {
                    removeFromCart(cartItems[0].id);
                  }
                }}
                isDisabled={cartItems.length === 0}
              >
                Remove Item [{shortcutKeys.removeItem}]
              </Button>
              <Button
                variant="flat"
                className="rounded-none py-2"
                size="sm"
                onPress={() => setShowTaxModal(true)}
              >
                Bill Tax [{shortcutKeys.billTax}]
              </Button>
              <Button
                variant="flat"
                className="rounded-none py-2"
                size="sm"
                onPress={() => setShowDiscountModal(true)}
              >
                Bill Discount [{shortcutKeys.billDiscount}]
              </Button>
              <Button
                variant="flat"
                className="rounded-none py-2"
                size="sm"
                color="secondary"
                onPress={() => {
                  console.log("Loyalty points feature activated");
                  // Add loyalty points functionality here
                }}
              >
                Loyalty Points [{shortcutKeys.loyaltyPoints}]
              </Button>
              <Button
                variant="flat"
                className="rounded-none py-2"
                size="sm"
                onPress={() => setShowRemarksModal(true)}
              >
                Remarks [{shortcutKeys.remarks}]
              </Button>
              <Button
                variant="flat"
                className="rounded-none py-2"
                size="sm"
                onPress={() => setShowEnhancedPayment(true)}
                isDisabled={cartItems.length === 0}
              >
                Partial Pay [{shortcutKeys.partialPay}]
              </Button>
              <Button
                variant="flat"
                className="rounded-none py-2 col-span-2"
                size="sm"
                color="primary"
                onPress={() => setShowEnhancedPayment(true)}
                isDisabled={cartItems.length === 0}
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
                {isLoadingProducts || isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-default-500">Loading products...</p>
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Icon
                        icon="lucide:package-x"
                        className="text-6xl text-default-300 mx-auto mb-4"
                      />
                      <p className="text-default-500 text-lg mb-2">
                        No products found
                      </p>
                      <p className="text-default-400 text-sm mb-4">
                        Import products from inventory or add them manually
                      </p>
                      <Button
                        color="primary"
                        variant="flat"
                        startContent={<Icon icon="lucide:plus" />}
                        onPress={() => {
                          // Navigate to inventory page
                          window.location.href = "/inventory";
                        }}
                      >
                        Go to Inventory
                      </Button>
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
                <div className="flex justify-between w-full">
                  <div className="flex gap-2">
                    <Button
                      variant="flat"
                      startContent={<Icon icon="lucide:refresh-cw" />}
                      onPress={() => {
                        loadProducts();
                      }}
                      isLoading={isLoadingProducts}
                    >
                      Refresh Products
                    </Button>
                    <Button
                      variant="flat"
                      color="secondary"
                      startContent={<Icon icon="lucide:package-plus" />}
                      onPress={() => {
                        window.location.href = "/inventory";
                      }}
                    >
                      Manage Inventory
                    </Button>
                  </div>
                  <Button variant="flat" onPress={onClose}>
                    Close
                  </Button>
                </div>
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
        billItems={convertCartItemsToBillItems(cartItems)}
        billNumber={invoiceNumber}
        subTotal={subTotal}
        itemDiscount={itemDiscount}
        itemTax={itemTax}
        roundOff={roundOff}
        totalAmount={totalAmount}
        paymentMode={paymentMode}
        amountReceived={amountReceived}
        changeAmount={calculateChange()}
        pendingAmount={calculatePendingAmount()}
        paymentStatus={getPaymentStatus()}
        onPrint={() => {
          // Print functionality
          window.print();
          clearCart();
        }}
      />

      {/* Smart Calculator Modal */}
      <SmartCalculator
        isOpen={showCalculator}
        onOpenChange={setShowCalculator}
        title={calculatorTitle}
        initialValue={amountReceived}
        onResult={(result) => {
          setAmountReceived(result);
        }}
      />

      {/* Enhanced Payment Modal */}
      <EnhancedPaymentModal
        isOpen={showEnhancedPayment}
        onOpenChange={setShowEnhancedPayment}
        totalAmount={totalAmount}
        onPaymentComplete={(paymentData) => {
          console.log("Payment completed:", paymentData);
          setAmountReceived(paymentData.amountReceived);
          setPaymentMode(paymentData.method);
          setShowEnhancedPayment(false);

          // Process checkout with enhanced payment data
          processCheckout();
        }}
      />

      {/* Quantity Modal */}
      {selectedCartItemId && (
        <QuantityModal
          isOpen={showQuantityModal}
          onOpenChange={setShowQuantityModal}
          currentQuantity={
            cartItems.find((item) => item.id === selectedCartItemId)
              ?.quantity || 1
          }
          productName={
            cartItems.find((item) => item.id === selectedCartItemId)?.name || ""
          }
          onQuantityChange={(newQuantity) => {
            updateCartItemQuantity(selectedCartItemId, newQuantity);
            setSelectedCartItemId(null);
          }}
        />
      )}

      {/* Discount Modal */}
      <DiscountModal
        isOpen={showDiscountModal}
        onOpenChange={setShowDiscountModal}
        currentDiscount={
          selectedCartItemId
            ? cartItems.find((item) => item.id === selectedCartItemId)
                ?.discount || 0
            : billDiscount
        }
        productName={
          selectedCartItemId
            ? cartItems.find((item) => item.id === selectedCartItemId)?.name
            : undefined
        }
        productPrice={
          selectedCartItemId
            ? cartItems.find((item) => item.id === selectedCartItemId)?.price ||
              0
            : subTotal
        }
        type={selectedCartItemId ? "item" : "bill"}
        onDiscountChange={(discount, type) => {
          if (selectedCartItemId) {
            // Apply item discount (implement in cart store)
            console.log("Apply item discount:", discount, type);
          } else {
            setBillDiscount(discount);
          }
          setSelectedCartItemId(null);
        }}
      />

      {/* Tax Modal */}
      <TaxModal
        isOpen={showTaxModal}
        onOpenChange={setShowTaxModal}
        currentTaxRate={billTaxRate}
        billAmount={subTotal - billDiscount}
        onTaxChange={(taxRate) => {
          setBillTaxRate(taxRate);
        }}
      />

      {/* Remarks Modal */}
      <RemarksModal
        isOpen={showRemarksModal}
        onOpenChange={setShowRemarksModal}
        currentRemarks={billRemarks}
        onRemarksChange={(remarks) => {
          setBillRemarks(remarks);
        }}
      />

      {/* Voice Search */}
      {showVoiceSearch && (
        <div className="fixed bottom-4 right-4 z-50 w-80 space-y-4">
          {/* AI-Powered Voice Search (Primary) */}
          <div className="bg-white rounded-lg shadow-lg p-4 border border-blue-200">
            <h3 className="text-sm font-medium mb-2 text-blue-700">
              🤖 AI Voice Search (Gemini Flash 2.0)
            </h3>
            <AIVoiceSearch
              onResult={handleVoiceResult}
              onProductFound={handleVoiceProductFound}
              products={products}
              language="en-IN"
            />
          </div>

          {/* React Speech Recognition Implementation (Fallback) */}
          <div className="bg-white rounded-lg shadow-lg p-4 border">
            <h3 className="text-sm font-medium mb-2 text-gray-700">
              🎤 React Speech Recognition (Fallback)
            </h3>
            <VoiceSearch
              onResult={handleVoiceResult}
              onProductFound={handleVoiceProductFound}
              products={products}
              language="en-IN"
            />
          </div>

          {/* Native Web Speech API Implementation */}
          <div className="bg-white rounded-lg shadow-lg p-4 border">
            <h3 className="text-sm font-medium mb-2 text-gray-700">
              🎤 Native Web Speech API
            </h3>
            <NativeVoiceSearch
              onResult={handleVoiceResult}
              onProductFound={handleVoiceProductFound}
              products={products}
              language="en-IN"
            />
          </div>

          {/* Voice Search Test Suite */}
          <div className="bg-white rounded-lg shadow-lg p-4 border">
            <VoiceSearchTest
              onProductFound={handleVoiceProductFound}
              products={products}
            />
          </div>

          {/* Close Button */}
          <div className="text-center">
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={() => setShowVoiceSearch(false)}
              startContent={<Icon icon="lucide:x" />}
            >
              Close Voice Search
            </Button>
          </div>
        </div>
      )}

      {/* Camera Barcode Scanner */}
      <CameraBarcodeScanner
        isOpen={showCameraScanner}
        onOpenChange={setShowCameraScanner}
        onScan={handleCameraScan}
        onError={(error) => {
          console.error("Camera scanner error:", error);
          alert(error);
        }}
      />
    </div>
  );
};
