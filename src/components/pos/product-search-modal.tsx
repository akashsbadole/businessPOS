import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
  Image,
  Chip,
  Spinner,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Product } from "../../types/pos";
import { usePOSStore } from "../../stores/pos-store";
// import { ProductService } from '../../services/database-factory';

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductSearchModal: React.FC<ProductSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { searchQuery, setSearchQuery, addToCart, isLoading, setLoading } =
    usePOSStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchType, setSearchType] = useState<"name" | "barcode" | "category">(
    "name"
  );

  // Load products when modal opens
  useEffect(() => {
    if (isOpen) {
      loadProducts();
      setSearchQuery("");
      setSelectedProduct(null);
      setQuantity(1);
    }
  }, [isOpen]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products.slice(0, 20)); // Show first 20 products
      return;
    }

    const filtered = products.filter((product) => {
      const query = searchQuery.toLowerCase();
      switch (searchType) {
        case "name":
          return product.name.toLowerCase().includes(query);
        case "barcode":
          return product.barcode?.toLowerCase().includes(query);
        case "category":
          return product.category.toLowerCase().includes(query);
        default:
          return (
            product.name.toLowerCase().includes(query) ||
            product.barcode?.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
          );
      }
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products, searchType]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Sample products for demo
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
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts.slice(0, 20));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = () => {
    if (selectedProduct && quantity > 0) {
      if (selectedProduct.stock < quantity) {
        alert(`Only ${selectedProduct.stock} items available in stock`);
        return;
      }

      addToCart(selectedProduct, quantity);
      onClose();
    }
  };

  const handleQuickAdd = (product: Product) => {
    if (product.stock === 0) {
      alert("Product is out of stock");
      return;
    }

    addToCart(product, 1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:search" className="text-xl" />
            <span>Search Products</span>
          </div>
          <p className="text-sm text-default-500">
            Search by product name, barcode, or category
          </p>
        </ModalHeader>

        <ModalBody>
          {/* Search Controls */}
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" />}
              className="flex-1"
              autoFocus
            />
            <Select
              label="Search by"
              selectedKeys={[searchType]}
              onSelectionChange={(keys) =>
                setSearchType(Array.from(keys)[0] as any)
              }
              className="w-40"
            >
              <SelectItem key="name">Name</SelectItem>
              <SelectItem key="barcode">Barcode</SelectItem>
              <SelectItem key="category">Category</SelectItem>
            </Select>
          </div>

          <div className="flex gap-6 h-96">
            {/* Product List */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3">
                Products ({filteredProducts.length})
              </h3>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Spinner size="lg" label="Loading products..." />
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto h-80">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className={`cursor-pointer ${
                        selectedProduct?.id === product.id
                          ? "border-2 border-primary bg-primary-50"
                          : "hover:bg-content2"
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <CardBody className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-content3 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <Image
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

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-default-500">
                              {product.category} • ₹{product.price}
                            </p>
                            {product.barcode && (
                              <p className="text-xs text-default-400">
                                Barcode: {product.barcode}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <Chip
                              size="sm"
                              color={
                                product.stock > 10
                                  ? "success"
                                  : product.stock > 0
                                  ? "warning"
                                  : "danger"
                              }
                              variant="flat"
                            >
                              Stock: {product.stock}
                            </Chip>
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onPress={() => handleQuickAdd(product)}
                              isDisabled={product.stock === 0}
                            >
                              Quick Add
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}

                  {filteredProducts.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Icon
                        icon="lucide:package-search"
                        className="text-4xl text-default-300 mb-2"
                      />
                      <p className="text-default-500">No products found</p>
                      <p className="text-sm text-default-400">
                        Try adjusting your search terms
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Details & Quantity Selection */}
            {selectedProduct && (
              <>
                <Divider orientation="vertical" />
                <div className="w-80">
                  <h3 className="text-lg font-semibold mb-3">
                    Product Details
                  </h3>

                  <Card>
                    <CardBody className="p-4">
                      <div className="text-center mb-4">
                        <div className="w-24 h-24 mx-auto rounded-lg bg-content3 flex items-center justify-center overflow-hidden mb-3">
                          {selectedProduct.image ? (
                            <Image
                              src={selectedProduct.image}
                              alt={selectedProduct.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon
                              icon="lucide:package"
                              className="text-3xl text-default-400"
                            />
                          )}
                        </div>
                        <h4 className="font-semibold text-lg">
                          {selectedProduct.name}
                        </h4>
                        <p className="text-default-500">
                          {selectedProduct.category}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-semibold">
                            ₹{selectedProduct.price}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Available Stock:</span>
                          <Chip
                            size="sm"
                            color={
                              selectedProduct.stock > 10
                                ? "success"
                                : selectedProduct.stock > 0
                                ? "warning"
                                : "danger"
                            }
                          >
                            {selectedProduct.stock} units
                          </Chip>
                        </div>

                        {selectedProduct.barcode && (
                          <div className="flex justify-between">
                            <span>Barcode:</span>
                            <span className="text-sm">
                              {selectedProduct.barcode}
                            </span>
                          </div>
                        )}

                        <Divider />

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Quantity
                          </label>
                          <div className="flex items-center gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onPress={() =>
                                setQuantity(Math.max(1, quantity - 1))
                              }
                            >
                              <Icon icon="lucide:minus" />
                            </Button>
                            <Input
                              type="number"
                              value={quantity.toString()}
                              onValueChange={(value) =>
                                setQuantity(Math.max(1, parseInt(value) || 1))
                              }
                              className="w-20 text-center"
                              min="1"
                              max={selectedProduct.stock.toString()}
                            />
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onPress={() =>
                                setQuantity(
                                  Math.min(selectedProduct.stock, quantity + 1)
                                )
                              }
                            >
                              <Icon icon="lucide:plus" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total:</span>
                          <span>
                            ₹{(selectedProduct.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          {selectedProduct && (
            <Button
              color="primary"
              onPress={handleAddToCart}
              isDisabled={
                selectedProduct.stock === 0 || quantity > selectedProduct.stock
              }
            >
              Add to Cart ({quantity} items)
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
