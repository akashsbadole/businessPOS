import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { PurchaseOrder, Supplier, Product } from "../../types/pos";

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "ABC Distributors",
    contactPerson: "John Doe",
    phone: "+91 9876543210",
    email: "john@abcdist.com",
    paymentTerms: "30",
    creditLimit: 100000,
    currentBalance: 25000,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Tata Salt",
    price: 20,
    category: "grocery",
    stock: 50,
    hsn: "2501",
    costPrice: 18,
    sellingPrice: 20,
  },
  {
    id: "2",
    name: "Aashirvaad Atta 5kg",
    price: 250,
    category: "grocery",
    stock: 25,
    hsn: "1101",
    costPrice: 220,
    sellingPrice: 250,
  },
];

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    supplierId: "1",
    supplier: mockSuppliers[0],
    orderDate: new Date(),
    expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "pending",
    subtotal: 5000,
    taxAmount: 900,
    discount: 0,
    total: 5900,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const PurchaseOrdersPage: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] =
    React.useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [suppliers] = React.useState<Supplier[]>(mockSuppliers);
  const [products] = React.useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPO, setSelectedPO] = React.useState<PurchaseOrder | null>(
    null
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<PurchaseOrder>>({});
  const [orderItems, setOrderItems] = React.useState<any[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const itemsPerPage = 10;

  const filteredPOs = purchaseOrders.filter(
    (po) =>
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPOs = filteredPOs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);

  const handleAddPO = () => {
    setSelectedPO(null);
    setIsEditing(false);
    setFormData({
      poNumber: `PO-${new Date().getFullYear()}-${String(
        purchaseOrders.length + 1
      ).padStart(3, "0")}`,
      supplierId: "",
      orderDate: new Date(),
      expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "pending",
      subtotal: 0,
      taxAmount: 0,
      discount: 0,
      total: 0,
    });
    setOrderItems([]);
    onOpen();
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsEditing(true);
    setFormData(po);
    setOrderItems(po.items || []);
    onOpen();
  };

  const handleSavePO = () => {
    if (isEditing && selectedPO) {
      setPurchaseOrders((prev) =>
        prev.map((po) =>
          po.id === selectedPO.id
            ? { ...po, ...formData, items: orderItems, updatedAt: new Date() }
            : po
        )
      );
    } else {
      const newPO: PurchaseOrder = {
        ...(formData as PurchaseOrder),
        id: Date.now().toString(),
        items: orderItems,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPurchaseOrders((prev) => [...prev, newPO]);
    }
    onOpenChange();
  };

  const handleDeletePO = (id: string) => {
    setPurchaseOrders((prev) => prev.filter((po) => po.id !== id));
  };

  const addOrderItem = () => {
    setOrderItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        productId: "",
        quantity: 1,
        unitCost: 0,
        receivedQuantity: 0,
        taxRate: 18,
        discount: 0,
        total: 0,
      },
    ]);
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (
            field === "quantity" ||
            field === "unitCost" ||
            field === "discount"
          ) {
            const subtotal = updatedItem.quantity * updatedItem.unitCost;
            const discountAmount = (subtotal * updatedItem.discount) / 100;
            const taxableAmount = subtotal - discountAmount;
            const taxAmount = (taxableAmount * updatedItem.taxRate) / 100;
            updatedItem.total = taxableAmount + taxAmount;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const removeOrderItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0
    );
    const discount = orderItems.reduce(
      (sum, item) =>
        sum + (item.quantity * item.unitCost * item.discount) / 100,
      0
    );
    const taxAmount = orderItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitCost;
      const itemDiscount = (itemSubtotal * item.discount) / 100;
      const taxableAmount = itemSubtotal - itemDiscount;
      return sum + (taxableAmount * item.taxRate) / 100;
    }, 0);
    const total = subtotal - discount + taxAmount;

    setFormData((prev) => ({
      ...prev,
      subtotal,
      discount,
      taxAmount,
      total,
    }));
  };

  React.useEffect(() => {
    calculateTotals();
  }, [orderItems]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "partial":
        return "primary";
      case "received":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-default-600 mt-1">
            Manage your purchase orders and inventory procurement
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          onPress={handleAddPO}
        >
          Create Purchase Order
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search purchase orders..."
              startContent={<Icon icon="lucide:search" />}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex-1"
            />
            <Select
              placeholder="Status"
              className="w-40"
              aria-label="Filter by status"
              label="Status"
            >
              <SelectItem key="all" value="all">
                All Status
              </SelectItem>
              <SelectItem key="pending" value="pending">
                Pending
              </SelectItem>
              <SelectItem key="partial" value="partial">
                Partial
              </SelectItem>
              <SelectItem key="received" value="received">
                Received
              </SelectItem>
              <SelectItem key="cancelled" value="cancelled">
                Cancelled
              </SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Purchase Orders</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="Purchase orders table">
            <TableHeader>
              <TableColumn>PO NUMBER</TableColumn>
              <TableColumn>SUPPLIER</TableColumn>
              <TableColumn>ORDER DATE</TableColumn>
              <TableColumn>EXPECTED DATE</TableColumn>
              <TableColumn>TOTAL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedPOs.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{po.poNumber}</p>
                      <p className="text-sm text-default-600">
                        {po.items?.length || 0} items
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{po.supplier?.name}</p>
                      <p className="text-sm text-default-600">
                        {po.supplier?.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{formatDate(po.orderDate)}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {po.expectedDate ? formatDate(po.expectedDate) : "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{formatCurrency(po.total)}</p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(po.status)}
                      size="sm"
                      variant="flat"
                    >
                      {po.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <Icon icon="lucide:more-vertical" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="edit"
                          startContent={<Icon icon="lucide:edit" />}
                          onPress={() => handleEditPO(po)}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          key="view"
                          startContent={<Icon icon="lucide:eye" />}
                        >
                          View Details
                        </DropdownItem>
                        <DropdownItem
                          key="receive"
                          startContent={<Icon icon="lucide:package-check" />}
                        >
                          Receive Items
                        </DropdownItem>
                        <DropdownItem
                          key="print"
                          startContent={<Icon icon="lucide:printer" />}
                        >
                          Print PO
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<Icon icon="lucide:trash-2" />}
                          onPress={() => handleDeletePO(po.id)}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center p-4">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add/Edit Purchase Order Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {isEditing ? "Edit Purchase Order" : "Create Purchase Order"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="PO Number"
                      value={formData.poNumber || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, poNumber: value }))
                      }
                      isRequired
                    />
                    <Autocomplete
                      label="Supplier"
                      placeholder="Select supplier"
                      selectedKey={formData.supplierId}
                      onSelectionChange={(key) =>
                        setFormData((prev) => ({
                          ...prev,
                          supplierId: key as string,
                        }))
                      }
                      isRequired
                    >
                      {suppliers.map((supplier) => (
                        <AutocompleteItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    <Input
                      label="Expected Date"
                      type="date"
                      value={
                        formData.expectedDate?.toISOString().split("T")[0] || ""
                      }
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          expectedDate: new Date(value),
                        }))
                      }
                    />
                  </div>

                  {/* Order Items */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold">Order Items</h4>
                      <Button
                        size="sm"
                        color="primary"
                        startContent={<Icon icon="lucide:plus" />}
                        onPress={addOrderItem}
                      >
                        Add Item
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-2 items-end p-3 bg-default-50 rounded-lg"
                        >
                          <div className="col-span-3">
                            <Autocomplete
                              label="Product"
                              placeholder="Select product"
                              selectedKey={item.productId}
                              onSelectionChange={(key) =>
                                updateOrderItem(index, "productId", key)
                              }
                              size="sm"
                            >
                              {products.map((product) => (
                                <AutocompleteItem
                                  key={product.id}
                                  value={product.id}
                                >
                                  {product.name}
                                </AutocompleteItem>
                              ))}
                            </Autocomplete>
                          </div>
                          <div className="col-span-2">
                            <Input
                              label="Quantity"
                              type="number"
                              value={item.quantity?.toString() || ""}
                              onValueChange={(value) =>
                                updateOrderItem(
                                  index,
                                  "quantity",
                                  parseFloat(value) || 0
                                )
                              }
                              size="sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              label="Unit Cost"
                              type="number"
                              value={item.unitCost?.toString() || ""}
                              onValueChange={(value) =>
                                updateOrderItem(
                                  index,
                                  "unitCost",
                                  parseFloat(value) || 0
                                )
                              }
                              size="sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              label="Tax %"
                              type="number"
                              value={item.taxRate?.toString() || ""}
                              onValueChange={(value) =>
                                updateOrderItem(
                                  index,
                                  "taxRate",
                                  parseFloat(value) || 0
                                )
                              }
                              size="sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              label="Total"
                              value={formatCurrency(item.total || 0)}
                              isReadOnly
                              size="sm"
                            />
                          </div>
                          <div className="col-span-1">
                            <Button
                              isIconOnly
                              size="sm"
                              color="danger"
                              variant="light"
                              onPress={() => removeOrderItem(index)}
                            >
                              <Icon icon="lucide:trash-2" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-80 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(formData.subtotal || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>{formatCurrency(formData.discount || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(formData.taxAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(formData.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSavePO}>
                  {isEditing ? "Update" : "Create"} Purchase Order
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
