import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Product, CartItem, Customer, Transaction } from "../types/pos";
// import { ProductService, InvoiceService } from "../services/database-factory";

interface POSState {
  // Cart state
  cartItems: CartItem[];
  selectedCustomer: Customer | null;

  // Product search state
  searchQuery: string;
  isProductSearchOpen: boolean;
  filteredProducts: Product[];

  // Transaction state
  currentTransaction: Partial<Transaction> | null;
  invoiceNumber: string;
  paymentMode: string;
  amountReceived: number;
  roundOff: number;

  // UI state
  isLoading: boolean;
  showInvoiceView: boolean;

  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;

  // Product search actions
  setSearchQuery: (query: string) => void;
  openProductSearch: () => void;
  closeProductSearch: () => void;
  searchProducts: (query: string) => Promise<void>;

  // Customer actions
  setSelectedCustomer: (customer: Customer | null) => void;

  // Transaction actions
  setPaymentMode: (mode: string) => void;
  setAmountReceived: (amount: number) => void;
  setRoundOff: (amount: number) => void;
  generateInvoiceNumber: () => void;

  // Checkout actions
  processCheckout: () => Promise<boolean>;

  // UI actions
  setLoading: (loading: boolean) => void;
  setShowInvoiceView: (show: boolean) => void;
}

export const usePOSStore = create<POSState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        cartItems: [],
        selectedCustomer: null,
        searchQuery: "",
        isProductSearchOpen: false,
        filteredProducts: [],
        currentTransaction: null,
        invoiceNumber: "",
        paymentMode: "Cash",
        amountReceived: 0,
        roundOff: 0,
        isLoading: false,
        showInvoiceView: false,

        // Cart actions
        addToCart: (product: Product, quantity = 1) => {
          const { cartItems } = get();
          const existingItem = cartItems.find((item) => item.id === product.id);

          if (existingItem) {
            // Update quantity if item already exists
            set((state) => ({
              cartItems: state.cartItems.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      total: (item.quantity + quantity) * item.price,
                    }
                  : item
              ),
            }));
          } else {
            // Add new item to cart
            const cartItem: CartItem = {
              ...product,
              quantity,
              discount: 0,
              taxAmount: (product.price * (product.taxRate || 18)) / 100,
              total: product.price * quantity,
            };

            set((state) => ({
              cartItems: [...state.cartItems, cartItem],
            }));
          }
        },

        updateCartItemQuantity: (itemId: string, quantity: number) => {
          if (quantity <= 0) {
            get().removeFromCart(itemId);
            return;
          }

          set((state) => ({
            cartItems: state.cartItems.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    quantity,
                    total: quantity * item.price,
                  }
                : item
            ),
          }));
        },

        removeFromCart: (itemId: string) => {
          set((state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== itemId),
          }));
        },

        clearCart: () => {
          set({
            cartItems: [],
            selectedCustomer: null,
            currentTransaction: null,
          });
        },

        // Product search actions
        setSearchQuery: (query: string) => {
          set({ searchQuery: query });
        },

        openProductSearch: () => {
          set({ isProductSearchOpen: true });
        },

        closeProductSearch: () => {
          set({ isProductSearchOpen: false, searchQuery: "" });
        },

        searchProducts: async (query: string) => {
          set({ isLoading: true });
          // For now, just simulate search
          console.log("Searching for:", query);
          setTimeout(() => {
            set({ filteredProducts: [], isLoading: false });
          }, 500);
        },

        // Customer actions
        setSelectedCustomer: (customer: Customer | null) => {
          set({ selectedCustomer: customer });
        },

        // Transaction actions
        setPaymentMode: (mode: string) => {
          set({ paymentMode: mode });
        },

        setAmountReceived: (amount: number) => {
          set({ amountReceived: amount });
        },

        setRoundOff: (amount: number) => {
          set({ roundOff: amount });
        },

        generateInvoiceNumber: () => {
          const invoiceNumber =
            "INV-" +
            new Date().toISOString().slice(2, 10).replace(/-/g, "") +
            "-" +
            Math.floor(Math.random() * 1000)
              .toString()
              .padStart(3, "0");
          set({ invoiceNumber });
        },

        // Checkout actions
        processCheckout: async () => {
          const state = get();
          const {
            cartItems,
            selectedCustomer,
            paymentMode,
            amountReceived,
            invoiceNumber,
          } = state;

          if (cartItems.length === 0) {
            return false;
          }

          try {
            set({ isLoading: true });

            const subtotal = cartItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            const taxAmount = cartItems.reduce(
              (sum, item) => sum + (item.taxAmount || 0) * item.quantity,
              0
            );
            const total = subtotal + taxAmount + state.roundOff;

            // Determine payment status
            const paymentStatus =
              amountReceived >= total
                ? "paid"
                : amountReceived > 0
                ? "partial"
                : "unpaid";

            const transaction: Partial<Transaction> = {
              invoiceNumber,
              date: new Date(),
              customer: selectedCustomer?.name || "Walk-in Customer",
              customerId: selectedCustomer?.id,
              items: cartItems.map((item) => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
              })),
              subtotal,
              taxAmount,
              total,
              paymentMode,
              amountReceived,
              change: Math.max(0, amountReceived - total),
              pendingAmount: Math.max(0, total - amountReceived),
              paymentStatus,
              status: paymentStatus === "paid" ? "completed" : "pending",
            };

            // If payment is not complete, add to pending payments tracking
            if (paymentStatus !== "paid") {
              const pendingPayment = {
                id: `pending_${Date.now()}`,
                invoiceNumber,
                customerName: selectedCustomer?.name || "Walk-in Customer",
                totalAmount: total,
                amountReceived,
                pendingAmount: Math.max(0, total - amountReceived),
                paymentStatus: paymentStatus as "partial" | "unpaid",
                date: new Date(),
              };

              // Store pending payment (in real app, this would go to database)
              const existingPending = JSON.parse(
                localStorage.getItem("pendingPayments") || "[]"
              );
              existingPending.push(pendingPayment);
              localStorage.setItem(
                "pendingPayments",
                JSON.stringify(existingPending)
              );
            }

            // Simulate saving transaction
            console.log("Transaction saved:", transaction);

            set({
              currentTransaction: transaction,
              showInvoiceView: true,
              isLoading: false,
            });

            return true;
          } catch (error) {
            console.error("Error processing checkout:", error);
            set({ isLoading: false });
            return false;
          }
        },

        // UI actions
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setShowInvoiceView: (show: boolean) => {
          set({ showInvoiceView: show });
        },
      }),
      {
        name: "pos-store",
        partialize: (state) => ({
          cartItems: state.cartItems,
          selectedCustomer: state.selectedCustomer,
          paymentMode: state.paymentMode,
          invoiceNumber: state.invoiceNumber,
        }),
      }
    ),
    { name: "POS Store" }
  )
);
