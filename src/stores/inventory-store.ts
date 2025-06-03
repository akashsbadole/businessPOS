import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Product, Category } from "../types/pos";
import { ProductService } from "../services/database-factory";

interface InventoryState {
  // Products state
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];

  // UI state
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  sortBy: "name" | "price" | "stock" | "category";
  sortOrder: "asc" | "desc";

  // CSV import/export state
  isImporting: boolean;
  isExporting: boolean;
  importProgress: number;

  // Actions
  loadProducts: () => Promise<void>;
  loadCategories: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Search and filter actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sortBy: "name" | "price" | "stock" | "category") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  filterProducts: () => void;

  // CSV actions
  exportToCSV: (
    period?: "monthly" | "weekly" | "quarterly" | "semi-yearly" | "yearly"
  ) => Promise<void>;
  importFromCSV: (file: File) => Promise<void>;

  // Bulk actions
  updateStock: (updates: { id: string; stock: number }[]) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        products: [],
        categories: [],
        filteredProducts: [],
        isLoading: false,
        searchQuery: "",
        selectedCategory: "all",
        sortBy: "name",
        sortOrder: "asc",
        isImporting: false,
        isExporting: false,
        importProgress: 0,

        // Load products
        loadProducts: async () => {
          set({ isLoading: true });
          try {
            const products = await ProductService.getAll();
            set({ products, filteredProducts: products, isLoading: false });
            get().filterProducts();
          } catch (error) {
            console.error("Error loading products:", error);
            set({ isLoading: false });
          }
        },

        // Load categories
        loadCategories: async () => {
          try {
            const { products } = get();
            const categorySet = new Set(products.map((p) => p.category));
            const categories: Category[] = Array.from(categorySet).map(
              (name, index) => ({
                id: `cat_${index}`,
                name,
                description: "",
                isActive: true,
                sortOrder: index,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            );
            set({ categories });
          } catch (error) {
            console.error("Error loading categories:", error);
          }
        },

        // Add product
        addProduct: async (productData: Omit<Product, "id">) => {
          try {
            const newProduct = await ProductService.create({
              ...productData,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as Product);

            set((state) => ({
              products: [...state.products, newProduct],
            }));

            get().filterProducts();
          } catch (error) {
            console.error("Error adding product:", error);
            throw error;
          }
        },

        // Update product
        updateProduct: async (id: string, productData: Partial<Product>) => {
          try {
            const updatedProduct = await ProductService.update(id, {
              ...productData,
              updatedAt: new Date(),
            });

            set((state) => ({
              products: state.products.map((p) =>
                p.id === id ? { ...p, ...updatedProduct } : p
              ),
            }));

            get().filterProducts();
          } catch (error) {
            console.error("Error updating product:", error);
            throw error;
          }
        },

        // Delete product
        deleteProduct: async (id: string) => {
          try {
            await ProductService.delete(id);
            set((state) => ({
              products: state.products.filter((p) => p.id !== id),
            }));
            get().filterProducts();
          } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
          }
        },

        // Search and filter actions
        setSearchQuery: (query: string) => {
          set({ searchQuery: query });
          get().filterProducts();
        },

        setSelectedCategory: (category: string) => {
          set({ selectedCategory: category });
          get().filterProducts();
        },

        setSortBy: (sortBy: "name" | "price" | "stock" | "category") => {
          set({ sortBy });
          get().filterProducts();
        },

        setSortOrder: (order: "asc" | "desc") => {
          set({ sortOrder: order });
          get().filterProducts();
        },

        filterProducts: () => {
          const { products, searchQuery, selectedCategory, sortBy, sortOrder } =
            get();

          let filtered = [...products];

          // Filter by search query
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
              (product) =>
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.barcode?.toLowerCase().includes(query)
            );
          }

          // Filter by category
          if (selectedCategory !== "all") {
            filtered = filtered.filter(
              (product) => product.category === selectedCategory
            );
          }

          // Sort products
          filtered.sort((a, b) => {
            let aValue: any = a[sortBy];
            let bValue: any = b[sortBy];

            if (typeof aValue === "string") {
              aValue = aValue.toLowerCase();
              bValue = bValue.toLowerCase();
            }

            if (sortOrder === "asc") {
              return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
              return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
          });

          set({ filteredProducts: filtered });
        },

        // CSV export
        exportToCSV: async (period) => {
          set({ isExporting: true });
          try {
            const { products } = get();

            // Filter products by period if specified
            let filteredProducts = products;
            if (period) {
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

              filteredProducts = products.filter(
                (p) => p.updatedAt && new Date(p.updatedAt) >= filterDate
              );
            }

            // Create CSV content
            const headers = [
              "ID",
              "Name",
              "Category",
              "Price",
              "Stock",
              "HSN",
              "Barcode",
              "Tax Rate",
            ];
            const csvContent = [
              headers.join(","),
              ...filteredProducts.map((product) =>
                [
                  product.id,
                  `"${product.name}"`,
                  product.category,
                  product.price,
                  product.stock,
                  product.hsn || "",
                  product.barcode || "",
                  product.taxRate || 18,
                ].join(",")
              ),
            ].join("\n");

            // Download CSV
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `inventory_${period || "all"}_${
              new Date().toISOString().split("T")[0]
            }.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Error exporting CSV:", error);
            throw error;
          } finally {
            set({ isExporting: false });
          }
        },

        // CSV import
        importFromCSV: async (file: File) => {
          set({ isImporting: true, importProgress: 0 });

          try {
            const text = await file.text();
            const lines = text.split("\n");
            const headers = lines[0]
              .split(",")
              .map((h) => h.trim().replace(/"/g, ""));

            const products: Omit<Product, "id">[] = [];

            for (let i = 1; i < lines.length; i++) {
              if (!lines[i].trim()) continue;

              const values = lines[i]
                .split(",")
                .map((v) => v.trim().replace(/"/g, ""));

              const product: Omit<Product, "id"> = {
                name: values[headers.indexOf("Name")] || "",
                category: values[headers.indexOf("Category")] || "general",
                price: parseFloat(values[headers.indexOf("Price")]) || 0,
                stock: parseInt(values[headers.indexOf("Stock")]) || 0,
                hsn: values[headers.indexOf("HSN")] || "",
                barcode: values[headers.indexOf("Barcode")] || undefined,
                taxRate: parseFloat(values[headers.indexOf("Tax Rate")]) || 18,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              products.push(product);
              set({ importProgress: (i / lines.length) * 100 });
            }

            // Save products to database
            for (const product of products) {
              await get().addProduct(product);
            }

            await get().loadProducts();
          } catch (error) {
            console.error("Error importing CSV:", error);
            throw error;
          } finally {
            set({ isImporting: false, importProgress: 0 });
          }
        },

        // Bulk update stock
        updateStock: async (updates: { id: string; stock: number }[]) => {
          try {
            for (const update of updates) {
              await get().updateProduct(update.id, { stock: update.stock });
            }
          } catch (error) {
            console.error("Error updating stock:", error);
            throw error;
          }
        },

        // Bulk delete
        bulkDelete: async (ids: string[]) => {
          try {
            for (const id of ids) {
              await get().deleteProduct(id);
            }
          } catch (error) {
            console.error("Error bulk deleting:", error);
            throw error;
          }
        },
      }),
      {
        name: "inventory-store",
        partialize: (state) => ({
          searchQuery: state.searchQuery,
          selectedCategory: state.selectedCategory,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    { name: "Inventory Store" }
  )
);
