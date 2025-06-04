import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
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
  Chip,
  Tabs,
  Tab,
  useDisclosure,
  Progress,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  manager: string;
  status: "active" | "inactive" | "maintenance";
  todaySales: number;
  todayTransactions: number;
  staff: number;
  inventory: number;
  gstNumber: string;
}

interface StockTransfer {
  id: string;
  fromLocation: string;
  toLocation: string;
  product: string;
  quantity: number;
  status: "pending" | "in-transit" | "completed" | "cancelled";
  requestedBy: string;
  date: string;
}

export const MultiLocationManager: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTab, setSelectedTab] = React.useState("overview");
  
  const [locations, setLocations] = React.useState<Location[]>([
    {
      id: "1",
      name: "Main Store",
      address: "123 Market Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 98765 43210",
      manager: "Rajesh Kumar",
      status: "active",
      todaySales: 45250,
      todayTransactions: 127,
      staff: 8,
      inventory: 2500,
      gstNumber: "27ABCDE1234F1Z5",
    },
    {
      id: "2",
      name: "Branch Store",
      address: "456 Commercial Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      phone: "+91 98765 43211",
      manager: "Priya Sharma",
      status: "active",
      todaySales: 32100,
      todayTransactions: 89,
      staff: 5,
      inventory: 1800,
      gstNumber: "27ABCDE1234F1Z6",
    },
    {
      id: "3",
      name: "Warehouse",
      address: "789 Industrial Area",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      phone: "+91 98765 43212",
      manager: "Amit Singh",
      status: "maintenance",
      todaySales: 0,
      todayTransactions: 0,
      staff: 3,
      inventory: 5000,
      gstNumber: "27ABCDE1234F1Z7",
    },
  ]);

  const [stockTransfers, setStockTransfers] = React.useState<StockTransfer[]>([
    {
      id: "1",
      fromLocation: "Warehouse",
      toLocation: "Main Store",
      product: "Rice (1kg)",
      quantity: 100,
      status: "in-transit",
      requestedBy: "Rajesh Kumar",
      date: "2024-01-15",
    },
    {
      id: "2",
      fromLocation: "Main Store",
      toLocation: "Branch Store",
      product: "Sugar (1kg)",
      quantity: 50,
      status: "completed",
      requestedBy: "Priya Sharma",
      date: "2024-01-14",
    },
  ]);

  const [newLocation, setNewLocation] = React.useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    manager: "",
    gstNumber: "",
  });

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "danger";
      case "maintenance": return "warning";
      default: return "default";
    }
  };

  const getTransferStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "in-transit": return "primary";
      case "pending": return "warning";
      case "cancelled": return "danger";
      default: return "default";
    }
  };

  const getTotalSales = () => {
    return locations.reduce((sum, location) => sum + location.todaySales, 0);
  };

  const getTotalTransactions = () => {
    return locations.reduce((sum, location) => sum + location.todayTransactions, 0);
  };

  const handleAddLocation = () => {
    const location: Location = {
      id: Date.now().toString(),
      ...newLocation,
      status: "active",
      todaySales: 0,
      todayTransactions: 0,
      staff: 0,
      inventory: 0,
    };

    setLocations([...locations, location]);
    setNewLocation({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      manager: "",
      gstNumber: "",
    });
    onOpenChange();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Multi-Location Management</h2>
        <Button
          color="primary"
          onPress={onOpen}
          startContent={<Icon icon="lucide:plus" />}
        >
          Add Location
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon icon="lucide:map-pin" className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Locations</p>
                <p className="text-2xl font-bold text-blue-600">{locations.length}</p>
                <p className="text-xs text-blue-500">
                  {locations.filter(l => l.status === "active").length} active
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon icon="lucide:trending-up" className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(getTotalSales())}
                </p>
                <p className="text-xs text-green-500">Today</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icon icon="lucide:shopping-cart" className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {getTotalTransactions()}
                </p>
                <p className="text-xs text-purple-500">Today</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Icon icon="lucide:users" className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-orange-600">
                  {locations.reduce((sum, location) => sum + location.staff, 0)}
                </p>
                <p className="text-xs text-orange-500">Across all locations</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
        <Tab key="overview" title="Overview">
          <div className="space-y-6">
            {/* Location Performance */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:bar-chart" />
                  <span className="font-semibold">Location Performance</span>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div key={location.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{location.name}</h3>
                          <p className="text-sm text-gray-600">{location.city}, {location.state}</p>
                          <p className="text-sm text-gray-600">Manager: {location.manager}</p>
                        </div>
                        <Chip
                          color={getStatusColor(location.status)}
                          size="sm"
                          variant="flat"
                        >
                          {location.status}
                        </Chip>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Today's Sales</p>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(location.todaySales)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Transactions</p>
                          <p className="font-semibold">{location.todayTransactions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Staff</p>
                          <p className="font-semibold">{location.staff}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Inventory Items</p>
                          <p className="font-semibold">{location.inventory}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sales Performance</span>
                          <span>{Math.round((location.todaySales / getTotalSales()) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(location.todaySales / getTotalSales()) * 100} 
                          color="primary"
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="transfers" title="Stock Transfers">
          <div className="space-y-6">
            {/* Transfer Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:truck" className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">In Transit</p>
                      <p className="text-xl font-bold">
                        {stockTransfers.filter(t => t.status === "in-transit").length}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:clock" className="text-orange-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-xl font-bold">
                        {stockTransfers.filter(t => t.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:check-circle" className="text-green-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-xl font-bold">
                        {stockTransfers.filter(t => t.status === "completed").length}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Transfer List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:arrow-right-left" />
                    <span className="font-semibold">Recent Stock Transfers</span>
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    startContent={<Icon icon="lucide:plus" />}
                  >
                    New Transfer
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Table>
                  <TableHeader>
                    <TableColumn>FROM</TableColumn>
                    <TableColumn>TO</TableColumn>
                    <TableColumn>PRODUCT</TableColumn>
                    <TableColumn>QUANTITY</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {stockTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>{transfer.fromLocation}</TableCell>
                        <TableCell>{transfer.toLocation}</TableCell>
                        <TableCell>{transfer.product}</TableCell>
                        <TableCell>{transfer.quantity}</TableCell>
                        <TableCell>
                          <Chip
                            color={getTransferStatusColor(transfer.status)}
                            size="sm"
                            variant="flat"
                          >
                            {transfer.status}
                          </Chip>
                        </TableCell>
                        <TableCell>{transfer.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:eye" />
                            </Button>
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:edit" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="settings" title="Settings">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:settings" />
                <span className="font-semibold">Location Settings</span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Tax Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Default GST Rate" defaultSelectedKeys={["18"]}>
                      <SelectItem key="5">5%</SelectItem>
                      <SelectItem key="12">12%</SelectItem>
                      <SelectItem key="18">18%</SelectItem>
                      <SelectItem key="28">28%</SelectItem>
                    </Select>
                    <Select label="State" defaultSelectedKeys={["maharashtra"]}>
                      <SelectItem key="maharashtra">Maharashtra</SelectItem>
                      <SelectItem key="gujarat">Gujarat</SelectItem>
                      <SelectItem key="karnataka">Karnataka</SelectItem>
                    </Select>
                  </div>
                </div>

                <Divider />

                <div>
                  <h3 className="font-semibold mb-3">Sync Settings</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Auto-sync inventory</span>
                      <Button size="sm" color="success" variant="flat">Enabled</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Real-time sales sync</span>
                      <Button size="sm" color="success" variant="flat">Enabled</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Customer data sync</span>
                      <Button size="sm" color="success" variant="flat">Enabled</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Add Location Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Location</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Location Name"
                    value={newLocation.name}
                    onValueChange={(value) =>
                      setNewLocation({ ...newLocation, name: value })
                    }
                    isRequired
                  />
                  <Input
                    label="Manager Name"
                    value={newLocation.manager}
                    onValueChange={(value) =>
                      setNewLocation({ ...newLocation, manager: value })
                    }
                    isRequired
                  />
                  <Input
                    label="Phone"
                    value={newLocation.phone}
                    onValueChange={(value) =>
                      setNewLocation({ ...newLocation, phone: value })
                    }
                    isRequired
                  />
                  <Input
                    label="GST Number"
                    value={newLocation.gstNumber}
                    onValueChange={(value) =>
                      setNewLocation({ ...newLocation, gstNumber: value })
                    }
                  />
                  <Input
                    label="City"
                    value={newLocation.city}
                    onValueChange={(value) =>
                      setNewLocation({ ...newLocation, city: value })
                    }
                    isRequired
                  />
                  <Input
                    label="State"
                    value={newLocation.state}
                    onValueChange={(value) =>
                      setNewLocation({ ...newLocation, state: value })
                    }
                    isRequired
                  />
                  <Input
                    label="Pincode"
                    value={newLocation.pincode}
                    onValueChange={(value) =>
                      setNewLocation({ ...newLocation, pincode: value })
                    }
                    isRequired
                  />
                </div>
                <Input
                  label="Address"
                  value={newLocation.address}
                  onValueChange={(value) =>
                    setNewLocation({ ...newLocation, address: value })
                  }
                  isRequired
                  className="mt-4"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddLocation}>
                  Add Location
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
