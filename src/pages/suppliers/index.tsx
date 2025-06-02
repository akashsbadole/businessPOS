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
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Supplier } from "../../types/pos";
import { SupplierService } from "../../services/database-factory";
import { formatCurrency } from "../../utils/currency";

// Mock data for demonstration
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "ABC Distributors",
    contactPerson: "John Doe",
    phone: "+91 9876543210",
    email: "john@abcdist.com",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    gstin: "27AAAAA0000A1Z5",
    paymentTerms: "30",
    creditLimit: 100000,
    currentBalance: 25000,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "XYZ Suppliers",
    contactPerson: "Jane Smith",
    phone: "+91 9876543211",
    email: "jane@xyzsuppliers.com",
    address: "456 Business Park",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    gstin: "07BBBBB1111B2Z6",
    paymentTerms: "15",
    creditLimit: 50000,
    currentBalance: 0,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSupplier, setSelectedSupplier] =
    React.useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<Supplier>>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadSuppliers = async () => {
      setLoading(true);
      try {
        const allSuppliers = await SupplierService.getAll();
        setSuppliers(allSuppliers);
      } catch (error) {
        console.error("Failed to load suppliers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSuppliers();
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const itemsPerPage = 10;

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone.includes(searchQuery) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setIsEditing(false);
    setFormData({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      gstin: "",
      paymentTerms: "30",
      creditLimit: 0,
      status: "active",
    });
    onOpen();
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditing(true);
    setFormData(supplier);
    onOpen();
  };

  const handleSaveSupplier = async () => {
    try {
      if (isEditing && selectedSupplier) {
        // Update existing supplier
        const updatedSupplier = await SupplierService.update(
          selectedSupplier.id,
          formData
        );
        if (updatedSupplier) {
          setSuppliers((prev) =>
            prev.map((s) =>
              s.id === selectedSupplier.id ? updatedSupplier : s
            )
          );
        }
      } else {
        // Add new supplier
        const newSupplier = await SupplierService.create({
          ...formData,
          currentBalance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Omit<Supplier, "id">);
        setSuppliers((prev) => [...prev, newSupplier]);
      }
      onOpenChange();
    } catch (error) {
      console.error("Failed to save supplier:", error);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      const success = await SupplierService.delete(id);
      if (success) {
        setSuppliers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete supplier:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
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
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-default-600 mt-1">
            Manage your suppliers and vendors
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          onPress={handleAddSupplier}
        >
          Add Supplier
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search suppliers..."
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
              <SelectItem key="active" value="active">
                Active
              </SelectItem>
              <SelectItem key="inactive" value="inactive">
                Inactive
              </SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Suppliers List</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="Suppliers table">
            <TableHeader>
              <TableColumn>SUPPLIER</TableColumn>
              <TableColumn>CONTACT</TableColumn>
              <TableColumn>LOCATION</TableColumn>
              <TableColumn>PAYMENT TERMS</TableColumn>
              <TableColumn>BALANCE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      {supplier.contactPerson && (
                        <p className="text-sm text-default-600">
                          {supplier.contactPerson}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{supplier.phone}</p>
                      {supplier.email && (
                        <p className="text-sm text-default-600">
                          {supplier.email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {supplier.city}, {supplier.state}
                      </p>
                      <p className="text-sm text-default-600">
                        {supplier.pincode}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{supplier.paymentTerms} days</p>
                    <p className="text-sm text-default-600">
                      Limit: {formatCurrency(supplier.creditLimit)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p
                      className={`text-sm font-medium ${
                        supplier.currentBalance > 0
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {formatCurrency(supplier.currentBalance)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(supplier.status)}
                      size="sm"
                      variant="flat"
                    >
                      {supplier.status}
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
                          onPress={() => handleEditSupplier(supplier)}
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
                          key="orders"
                          startContent={<Icon icon="lucide:package" />}
                        >
                          Purchase Orders
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<Icon icon="lucide:trash-2" />}
                          onPress={() => handleDeleteSupplier(supplier.id)}
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

          {/* Pagination */}
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

      {/* Add/Edit Supplier Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {isEditing ? "Edit Supplier" : "Add New Supplier"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Supplier Name"
                    placeholder="Enter supplier name"
                    value={formData.name || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, name: value }))
                    }
                    isRequired
                  />
                  <Input
                    label="Contact Person"
                    placeholder="Enter contact person name"
                    value={formData.contactPerson || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, contactPerson: value }))
                    }
                  />
                  <Input
                    label="Phone"
                    placeholder="Enter phone number"
                    value={formData.phone || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, phone: value }))
                    }
                    isRequired
                  />
                  <Input
                    label="Email"
                    placeholder="Enter email address"
                    type="email"
                    value={formData.email || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, email: value }))
                    }
                  />
                  <Input
                    label="City"
                    placeholder="Enter city"
                    value={formData.city || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, city: value }))
                    }
                  />
                  <Input
                    label="State"
                    placeholder="Enter state"
                    value={formData.state || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, state: value }))
                    }
                  />
                  <Input
                    label="Pincode"
                    placeholder="Enter pincode"
                    value={formData.pincode || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, pincode: value }))
                    }
                  />
                  <Input
                    label="GSTIN"
                    placeholder="Enter GSTIN"
                    value={formData.gstin || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, gstin: value }))
                    }
                  />
                  <Input
                    label="Payment Terms (Days)"
                    placeholder="Enter payment terms"
                    type="number"
                    value={formData.paymentTerms || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, paymentTerms: value }))
                    }
                  />
                  <Input
                    label="Credit Limit"
                    placeholder="Enter credit limit"
                    type="number"
                    value={formData.creditLimit?.toString() || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        creditLimit: parseFloat(value) || 0,
                      }))
                    }
                  />
                  <Select
                    label="Status"
                    selectedKeys={formData.status ? [formData.status] : []}
                    onSelectionChange={(keys) => {
                      const status = Array.from(keys)[0] as string;
                      setFormData((prev) => ({
                        ...prev,
                        status: status as "active" | "inactive",
                      }));
                    }}
                  >
                    <SelectItem key="active" value="active">
                      Active
                    </SelectItem>
                    <SelectItem key="inactive" value="inactive">
                      Inactive
                    </SelectItem>
                  </Select>
                </div>
                <Textarea
                  label="Address"
                  placeholder="Enter full address"
                  value={formData.address || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, address: value }))
                  }
                  className="col-span-2"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveSupplier}>
                  {isEditing ? "Update" : "Add"} Supplier
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
