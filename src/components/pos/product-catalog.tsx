import React from "react";
import { Input, Button, Card, CardBody, Tabs, Tab, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Product } from "../../types/pos";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [barcodeInput, setBarcodeInput] = React.useState("");
  const [scanResult, setScanResult] = React.useState<Product | null>(null);

  const categories = React.useMemo(() => {
    const allCategories = products.map(product => product.category);
    return ["all", ...Array.from(new Set(allCategories))];
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleBarcodeScan = () => {
    if (!barcodeInput.trim()) return;
    
    // Simulate finding product by barcode (in a real app, barcode would be a field in the product data)
    const found = products.find(p => p.id === `p${barcodeInput}` || p.hsn === barcodeInput);
    
    if (found) {
      setScanResult(found);
    } else {
      setScanResult(null);
    }
  };

  const handleAddScannedProduct = () => {
    if (scanResult) {
      onAddToCart(scanResult);
      setBarcodeInput("");
      setScanResult(null);
      onOpenChange(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex gap-3">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Icon icon="lucide:search" />}
          isClearable
          className="flex-1"
        />
        <Button 
          isIconOnly
          color="primary"
          aria-label="Scan barcode"
          onPress={onOpen}
        >
          <Icon icon="lucide:barcode" />
        </Button>
      </div>

      <div className="category-scroll mb-4">
        <Tabs 
          selectedKey={selectedCategory} 
          onSelectionChange={setSelectedCategory as any}
          variant="light"
          color="primary"
          classNames={{
            base: "w-full",
            tabList: "gap-2 w-full relative rounded-md p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-4 h-10",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          {categories.map((category) => (
            <Tab 
              key={category} 
              title={category.charAt(0).toUpperCase() + category.slice(1)}
            />
          ))}
        </Tabs>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:barcode" />
                  <span>Barcode Scanner</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter barcode or HSN code"
                      value={barcodeInput}
                      onValueChange={setBarcodeInput}
                      className="flex-1"
                      autoFocus
                    />
                    <Button color="primary" onPress={handleBarcodeScan}>
                      Scan
                    </Button>
                  </div>
                  
                  {scanResult ? (
                    <div className="border border-default-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-md bg-content2 flex items-center justify-center overflow-hidden">
                          {scanResult.image ? (
                            <img src={scanResult.image} alt={scanResult.name} className="w-full h-full object-cover" />
                          ) : (
                            <Icon icon="lucide:package" className="text-2xl text-default-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{scanResult.name}</p>
                          <p className="text-default-500 text-sm">HSN: {scanResult.hsn}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-primary-600 font-semibold">₹{scanResult.price.toFixed(2)}</p>
                        <Chip 
                          size="sm" 
                          color={scanResult.stock === 0 ? "danger" : scanResult.stock <= 5 ? "warning" : "success"} 
                          variant="flat"
                        >
                          {scanResult.stock === 0 ? "Out of stock" : `${scanResult.stock} in stock`}
                        </Chip>
                      </div>
                    </div>
                  ) : barcodeInput ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Icon icon="lucide:alert-circle" className="text-danger text-3xl mb-2" />
                      <p className="text-danger">No product found with this barcode/HSN</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Icon icon="lucide:barcode-scan" className="text-default-300 text-5xl mb-4" />
                      <p className="text-default-500">Enter a barcode or HSN code to scan</p>
                      <p className="text-tiny text-default-400 mt-1">Try using "p1" through "p20" or any HSN code</p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleAddScannedProduct}
                  isDisabled={!scanResult || scanResult.stock === 0}
                >
                  Add to Cart
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center h-64">
          <Icon icon="lucide:package-search" className="text-default-300 text-5xl mb-4" />
          <p className="text-default-500">No products found</p>
          <p className="text-tiny text-default-400 mt-1">Try a different search term or category</p>
        </div>
      ) : (
        <div className="product-grid overflow-y-auto pb-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card 
      isPressable 
      onPress={() => onAddToCart(product)}
      className="overflow-visible"
    >
      <CardBody className="p-0 overflow-visible">
        <div className="relative">
          <div className="h-32 bg-content2 flex items-center justify-center overflow-hidden rounded-t-lg">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon icon="lucide:package" className="text-4xl text-default-300" />
            )}
          </div>
          
          {product.stock <= 5 && (
            <Chip 
              size="sm" 
              color={product.stock === 0 ? "danger" : "warning"} 
              variant="flat"
              className="absolute top-2 right-2"
            >
              {product.stock === 0 ? "Out of stock" : "Low stock"}
            </Chip>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-default-900 truncate">{product.name}</h3>
          <div className="flex justify-between items-center mt-1">
            <p className="text-primary-600 font-semibold">₹{product.price.toFixed(2)}</p>
            <p className="text-tiny text-default-500">HSN: {product.hsn}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};