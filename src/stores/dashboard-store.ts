import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Transaction, Product } from "../types/pos";
import {
  InvoiceService,
  ProductService,
  CustomerService,
} from "../services/database-factory";

interface DashboardStats {
  totalSales: number;
  totalTransactions: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  todaySales: number;
  weekSales: number;
  monthSales: number;
  yearSales: number;
  topSellingProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  recentTransactions: Transaction[];
  salesTrend: Array<{
    date: string;
    sales: number;
    transactions: number;
  }>;
  categoryWiseSales: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
}

interface DashboardState {
  stats: DashboardStats;
  isLoading: boolean;
  lastUpdated: Date | null;

  // Export state
  isExporting: boolean;

  // Actions
  loadDashboardData: () => Promise<void>;
  refreshStats: () => Promise<void>;

  // Export actions
  exportSalesReport: (
    period: "monthly" | "weekly" | "quarterly" | "semi-yearly" | "yearly"
  ) => Promise<void>;
  exportTransactionReport: (
    period: "monthly" | "weekly" | "quarterly" | "semi-yearly" | "yearly"
  ) => Promise<void>;
  exportCustomerReport: () => Promise<void>;
  exportInventoryReport: () => Promise<void>;
}

const initialStats: DashboardStats = {
  totalSales: 0,
  totalTransactions: 0,
  totalCustomers: 0,
  totalProducts: 0,
  lowStockProducts: 0,
  todaySales: 0,
  weekSales: 0,
  monthSales: 0,
  yearSales: 0,
  topSellingProducts: [],
  recentTransactions: [],
  salesTrend: [],
  categoryWiseSales: [],
};

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      stats: initialStats,
      isLoading: false,
      lastUpdated: null,
      isExporting: false,

      loadDashboardData: async () => {
        set({ isLoading: true });
        try {
          const [transactions, products, customers] = await Promise.all([
            InvoiceService.getAll(),
            ProductService.getAll(),
            CustomerService.getAll(),
          ]);

          const now = new Date();
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate()
          );
          const yearAgo = new Date(
            today.getFullYear() - 1,
            today.getMonth(),
            today.getDate()
          );

          // Calculate sales metrics
          const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
          const todaySales = transactions
            .filter((t) => new Date(t.date) >= today)
            .reduce((sum, t) => sum + t.total, 0);
          const weekSales = transactions
            .filter((t) => new Date(t.date) >= weekAgo)
            .reduce((sum, t) => sum + t.total, 0);
          const monthSales = transactions
            .filter((t) => new Date(t.date) >= monthAgo)
            .reduce((sum, t) => sum + t.total, 0);
          const yearSales = transactions
            .filter((t) => new Date(t.date) >= yearAgo)
            .reduce((sum, t) => sum + t.total, 0);

          // Low stock products (stock <= 10)
          const lowStockProducts = products.filter((p) => p.stock <= 10).length;

          // Top selling products
          const productSales = new Map<
            string,
            { quantity: number; revenue: number }
          >();
          transactions.forEach((transaction) => {
            transaction.items?.forEach((item) => {
              const existing = productSales.get(item.productId) || {
                quantity: 0,
                revenue: 0,
              };
              productSales.set(item.productId, {
                quantity: existing.quantity + item.quantity,
                revenue: existing.revenue + item.total,
              });
            });
          });

          const topSellingProducts = Array.from(productSales.entries())
            .map(([productId, data]) => ({
              product: products.find((p) => p.id === productId)!,
              quantity: data.quantity,
              revenue: data.revenue,
            }))
            .filter((item) => item.product)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);

          // Recent transactions
          const recentTransactions = transactions
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 10);

          // Sales trend (last 30 days)
          const salesTrend = [];
          for (let i = 29; i >= 0; i--) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const dayStart = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            );
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

            const dayTransactions = transactions.filter((t) => {
              const tDate = new Date(t.date);
              return tDate >= dayStart && tDate < dayEnd;
            });

            salesTrend.push({
              date: date.toISOString().split("T")[0],
              sales: dayTransactions.reduce((sum, t) => sum + t.total, 0),
              transactions: dayTransactions.length,
            });
          }

          // Category wise sales
          const categorySales = new Map<string, number>();
          transactions.forEach((transaction) => {
            transaction.items?.forEach((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (product) {
                const existing = categorySales.get(product.category) || 0;
                categorySales.set(product.category, existing + item.total);
              }
            });
          });

          const categoryWiseSales = Array.from(categorySales.entries())
            .map(([category, sales]) => ({
              category,
              sales,
              percentage: (sales / totalSales) * 100,
            }))
            .sort((a, b) => b.sales - a.sales);

          const stats: DashboardStats = {
            totalSales,
            totalTransactions: transactions.length,
            totalCustomers: customers.length,
            totalProducts: products.length,
            lowStockProducts,
            todaySales,
            weekSales,
            monthSales,
            yearSales,
            topSellingProducts,
            recentTransactions,
            salesTrend,
            categoryWiseSales,
          };

          set({
            stats,
            isLoading: false,
            lastUpdated: new Date(),
          });
        } catch (error) {
          console.error("Error loading dashboard data:", error);
          set({ isLoading: false });
        }
      },

      refreshStats: async () => {
        await get().loadDashboardData();
      },

      exportSalesReport: async (period) => {
        set({ isExporting: true });
        try {
          const transactions = await InvoiceService.getAll();

          // Filter by period
          const now = new Date();
          const filterDate = new Date();

          switch (period) {
            case "weekly":
              filterDate.setDate(now.getDate() - 7);
              break;
            case "monthly":
              filterDate.setMonth(now.getMonth() - 1);
              break;
            case "quarterly":
              filterDate.setMonth(now.getMonth() - 3);
              break;
            case "semi-yearly":
              filterDate.setMonth(now.getMonth() - 6);
              break;
            case "yearly":
              filterDate.setFullYear(now.getFullYear() - 1);
              break;
          }

          const filteredTransactions = transactions.filter(
            (t) => new Date(t.date) >= filterDate
          );

          // Create CSV content
          const headers = [
            "Date",
            "Invoice Number",
            "Customer",
            "Items",
            "Subtotal",
            "Tax",
            "Total",
            "Payment Mode",
          ];
          const csvContent = [
            headers.join(","),
            ...filteredTransactions.map((t) =>
              [
                new Date(t.date).toLocaleDateString(),
                t.invoiceNumber,
                `"${t.customer}"`,
                t.items?.length || 0,
                t.subtotal?.toFixed(2) || "0.00",
                t.taxAmount?.toFixed(2) || "0.00",
                t.total.toFixed(2),
                t.paymentMode || "Cash",
              ].join(",")
            ),
          ].join("\n");

          // Download CSV
          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sales_report_${period}_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error exporting sales report:", error);
          throw error;
        } finally {
          set({ isExporting: false });
        }
      },

      exportTransactionReport: async (period) => {
        set({ isExporting: true });
        try {
          const transactions = await InvoiceService.getAll();

          // Filter by period (same logic as sales report)
          const now = new Date();
          const filterDate = new Date();

          switch (period) {
            case "weekly":
              filterDate.setDate(now.getDate() - 7);
              break;
            case "monthly":
              filterDate.setMonth(now.getMonth() - 1);
              break;
            case "quarterly":
              filterDate.setMonth(now.getMonth() - 3);
              break;
            case "semi-yearly":
              filterDate.setMonth(now.getMonth() - 6);
              break;
            case "yearly":
              filterDate.setFullYear(now.getFullYear() - 1);
              break;
          }

          const filteredTransactions = transactions.filter(
            (t) => new Date(t.date) >= filterDate
          );

          // Create detailed transaction CSV
          const headers = [
            "Date",
            "Time",
            "Invoice Number",
            "Customer",
            "Product Name",
            "Quantity",
            "Unit Price",
            "Total",
            "Payment Mode",
            "Status",
          ];
          const rows: string[] = [];

          filteredTransactions.forEach((transaction) => {
            const date = new Date(transaction.date);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();

            if (transaction.items && transaction.items.length > 0) {
              transaction.items.forEach((item) => {
                rows.push(
                  [
                    dateStr,
                    timeStr,
                    transaction.invoiceNumber,
                    `"${transaction.customer}"`,
                    `"${item.name}"`,
                    item.quantity,
                    item.price.toFixed(2),
                    item.total.toFixed(2),
                    transaction.paymentMode || "Cash",
                    transaction.status || "completed",
                  ].join(",")
                );
              });
            } else {
              rows.push(
                [
                  dateStr,
                  timeStr,
                  transaction.invoiceNumber,
                  `"${transaction.customer}"`,
                  "No items",
                  0,
                  "0.00",
                  transaction.total.toFixed(2),
                  transaction.paymentMode || "Cash",
                  transaction.status || "completed",
                ].join(",")
              );
            }
          });

          const csvContent = [headers.join(","), ...rows].join("\n");

          // Download CSV
          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `transaction_report_${period}_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error exporting transaction report:", error);
          throw error;
        } finally {
          set({ isExporting: false });
        }
      },

      exportCustomerReport: async () => {
        set({ isExporting: true });
        try {
          const customers = await CustomerService.getAll();

          const headers = [
            "ID",
            "Name",
            "Phone",
            "Email",
            "Address",
            "Created Date",
          ];
          const csvContent = [
            headers.join(","),
            ...customers.map((customer) =>
              [
                customer.id,
                `"${customer.name}"`,
                customer.phone || "",
                customer.email || "",
                `"${customer.address || ""}"`,
                customer.createdAt
                  ? new Date(customer.createdAt).toLocaleDateString()
                  : "",
              ].join(",")
            ),
          ].join("\n");

          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `customer_report_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error exporting customer report:", error);
          throw error;
        } finally {
          set({ isExporting: false });
        }
      },

      exportInventoryReport: async () => {
        set({ isExporting: true });
        try {
          const products = await ProductService.getAll();

          const headers = [
            "ID",
            "Name",
            "Category",
            "Price",
            "Stock",
            "HSN",
            "Barcode",
            "Tax Rate",
            "Status",
          ];
          const csvContent = [
            headers.join(","),
            ...products.map((product) =>
              [
                product.id,
                `"${product.name}"`,
                product.category,
                product.price.toFixed(2),
                product.stock,
                product.hsn || "",
                product.barcode || "",
                product.taxRate || 18,
                product.isActive ? "Active" : "Inactive",
              ].join(",")
            ),
          ].join("\n");

          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `inventory_report_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error exporting inventory report:", error);
          throw error;
        } finally {
          set({ isExporting: false });
        }
      },
    }),
    { name: "Dashboard Store" }
  )
);
