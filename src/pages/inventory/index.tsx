import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Pagination, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Product } from "../../types/pos";
import { sampleProducts } from "../../data/sample-data";

export const InventoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  
  const rowsPerPage = 10;

  const filteredProducts = React.useMemo(() => {
    return sampleProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const pages = Math.ceil(filteredProducts.length / rowsPerPage);
  
  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredProducts.slice(start, end);
  }, [currentPage, filteredProducts]);

  const categories = React.useMemo(() => {
    const allCategories = sampleProducts.map(product => product.category);
    return ["all", ...Array.from(new Set(allCategories))];
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" />}
        >
          Add Product
        </Button>
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
                  {selectedCategory === "all" ? "All Categories" : selectedCategory}
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
                {categories.map((category) => (
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
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
            <Button 
              size="sm" 
              variant="flat" 
              startContent={<Icon icon="lucide:download" />}
            >
              Export
            </Button>
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
          <TableBody emptyContent="No products found">
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-content2 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Icon icon="lucide:package" className="text-xl text-default-400" />
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
                      product.stock === 0 ? "danger" : 
                      product.stock <= 5 ? "warning" : 
                      "success"
                    } 
                    variant="flat"
                  >
                    {product.stock === 0 ? "Out of stock" : 
                     product.stock <= 5 ? "Low stock" : 
                     "In stock"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button isIconOnly size="sm" variant="light">
                      <Icon icon="lucide:edit" />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" color="danger">
                      <Icon icon="lucide:trash" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};