import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Card,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Product, Category } from "../../types/pos";
import { useInventoryStore } from "../../stores/inventory-store";
import { CSVUploadModal } from "../../components/inventory/csv-upload-modal";
import {
  ProductService,
  CategoryService,
} from "../../services/database-factory";

export const InventoryPage: React.FC = () => {
  const {
    products,
    categories,
    filteredProducts,
    isLoading,
    searchQuery,
    selectedCategory,
    sortBy,
    sortOrder,
    isExporting,
    loadProducts,
    loadCategories,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setSortOrder,
    exportToCSV,
    deleteProduct,
  } = useInventoryStore();

  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onOpenChange: onUploadOpenChange,
  } = useDisclosure();
  const [currentPage, setCurrentPage] = React.useState(1);

  const rowsPerPage = 10;

  // Load data on mount
  React.useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const pages = Math.ceil(filteredProducts.length / rowsPerPage);

  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredProducts.slice(start, end);
  }, [currentPage, filteredProducts]);

  const categoryOptions = React.useMemo(() => {
    const allCategories = categories.map((category) => category.name);
    return ["all", ...allCategories];
  }, [categories]);

  const handleExport = async (period?: string) => {
    try {
      await exportToCSV(period as any);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Icon icon="lucide:upload" />}
            onPress={onUploadOpen}
          >
            Import CSV
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                startContent={<Icon icon="lucide:download" />}
                isLoading={isExporting}
              >
                Export
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Export options">
              <DropdownItem
                key="all"
                startContent={<Icon icon="lucide:package" />}
                onPress={() => handleExport()}
              >
                All Products
              </DropdownItem>
              <DropdownItem
                key="monthly"
                startContent={<Icon icon="lucide:calendar" />}
                onPress={() => handleExport("monthly")}
              >
                Updated This Month
              </DropdownItem>
              <DropdownItem
                key="weekly"
                startContent={<Icon icon="lucide:calendar" />}
                onPress={() => handleExport("weekly")}
              >
                Updated This Week
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
            Add Product
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" />}
              isClearable
              className="flex-1"
            />

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  endContent={<Icon icon="lucide:chevron-down" />}
                >
                  {selectedCategory === "all"
                    ? "All Categories"
                    : selectedCategory}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Categories"
                selectionMode="single"
                selectedKeys={[selectedCategory]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedCategory(selected);
                }}
              >
                {categoryOptions.map((category) => (
                  <DropdownItem key={category}>
                    {category === "all" ? "All Categories" : category}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              color="default"
              variant="bordered"
              startContent={<Icon icon="lucide:filter" />}
            >
              Filters
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-default-500 text-sm">
              Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
              products
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                startContent={<Icon icon="lucide:filter" />}
              >
                Sort: {sortBy} ({sortOrder})
              </Button>
              <Button
                size="sm"
                variant="flat"
                startContent={<Icon icon="lucide:download" />}
                onPress={() => handleExport()}
                isLoading={isExporting}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <Table
          removeWrapper
          aria-label="Inventory products table"
          bottomContent={
            pages > 0 ? (
              <div className="flex justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={currentPage}
                  total={pages}
                  onChange={setCurrentPage}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>PRODUCT</TableColumn>
            <TableColumn>CATEGORY</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>HSN CODE</TableColumn>
            <TableColumn>STOCK</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={isLoading ? <Spinner /> : "No products found"}
            isLoading={isLoading}
            loadingContent={<Spinner />}
          >
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-content2 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon
                          icon="lucide:package"
                          className="text-xl text-default-400"
                        />
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                <TableCell>{product.hsn}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={
                      product.stock === 0
                        ? "danger"
                        : product.stock <= 5
                        ? "warning"
                        : "success"
                    }
                    variant="flat"
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : product.stock <= 5
                      ? "Low stock"
                      : "In stock"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button isIconOnly size="sm" variant="light">
                      <Icon icon="lucide:edit" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(product.id)}
                    >
                      <Icon icon="lucide:trash" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* CSV Upload Modal */}
      <CSVUploadModal
        isOpen={isUploadOpen}
        onClose={() => onUploadOpenChange()}
      />
    </div>
  );
};
