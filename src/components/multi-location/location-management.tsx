import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
  Progress,
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
  email: string;
  manager: string;
  status: "active" | "inactive" | "maintenance";
  todaySales: number;
  monthSales: number;
  inventory: number;
  staff: number;
  lastSync: Date;
  isOnline: boolean;
}

interface LocationManagementProps {
  locations: Location[];
  onAddLocation: (location: Omit<Location, 'id'>) => void;
  onUpdateLocation: (id: string, location: Partial<Location>) => void;
  onSyncLocation: (id: string) => void;
  onTransferInventory: (fromId: string, toId: string, items: any[]) => void;
}

export const LocationManagement: React.FC<LocationManagementProps> = ({
  locations,
  onAddLocation,
  onUpdateLocation,
  onSyncLocation,
  onTransferInventory,
}) => {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [showLocationDetails, setShowLocationDetails] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [newLocation, setNewLocation] = React.useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    manager: "",
    status: "active" as const,
    todaySales: 0,
    monthSales: 0,
    inventory: 0,
    staff: 0,
    lastSync: new Date(),
    isOnline: true,
  });

  // Filter locations
  const filteredLocations = React.useMemo(() => {
    return locations.filter(location =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.manager.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  // Analytics
  const analytics = React.useMemo(() => {
    const totalLocations = locations.length;
    const activeLocations = locations.filter(l => l.status === "active").length;
    const totalSales = locations.reduce((sum, l) => sum + l.todaySales, 0);
    const totalInventory = locations.reduce((sum, l) => sum + l.inventory, 0);
    const onlineLocations = locations.filter(l => l.isOnline).length;

    return {
      totalLocations,
      activeLocations,
      totalSales,
      totalInventory,
      onlineLocations,
    };
  }, [locations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "danger";
      case "maintenance": return "warning";
      default: return "default";
    }
  };

  const handleAddLocation = () => {
    onAddLocation(newLocation);
    setNewLocation({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      manager: "",
      status: "active",
      todaySales: 0,
      monthSales: 0,
      inventory: 0,
      staff: 0,
      lastSync: new Date(),
      isOnline: true,
    });
    setShowAddModal(false);
  };

  const handleSyncAll = () => {
    locations.forEach(location => {
      if (location.isOnline) {
        onSyncLocation(location.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Multi-Location Management</h2>
        <div className="flex gap-2">
          <Button
            color="secondary"
            variant="flat"
            startContent={<Icon icon="lucide:refresh-cw" />}
            onPress={handleSyncAll}
          >
            Sync All
          </Button>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:map-pin" />}
            onPress={() => setShowAddModal(true)}
          >
            Add Location
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Locations</p>
                <p className="text-2xl font-bold">{analytics.totalLocations}</p>
              </div>
              <Icon icon="lucide:map-pin" className="text-3xl text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Locations</p>
                <p className="text-2xl font-bold text-green-600">{analytics.activeLocations}</p>
              </div>
              <Icon icon="lucide:check-circle" className="text-3xl text-green-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online Status</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.onlineLocations}/{analytics.totalLocations}</p>
              </div>
              <Icon icon="lucide:wifi" className="text-3xl text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-orange-600">₹{analytics.totalSales.toLocaleString()}</p>
              </div>
              <Icon icon="lucide:trending-up" className="text-3xl text-orange-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inventory</p>
                <p className="text-2xl font-bold text-purple-600">₹{analytics.totalInventory.toLocaleString()}</p>
              </div>
              <Icon icon="lucide:package" className="text-3xl text-purple-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search */}
      <Input
        placeholder="Search locations..."
        value={searchQuery}
        onValueChange={setSearchQuery}
        startContent={<Icon icon="lucide:search" />}
        className="max-w-md"
      />

      {/* Locations Table */}
      <Card>
        <CardBody>
          <Table aria-label="Locations table">
            <TableHeader>
              <TableColumn>LOCATION</TableColumn>
              <TableColumn>MANAGER</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>TODAY'S SALES</TableColumn>
              <TableColumn>INVENTORY</TableColumn>
              <TableColumn>STAFF</TableColumn>
              <TableColumn>LAST SYNC</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {location.name}
                        {location.isOnline ? (
                          <Icon icon="lucide:wifi" className="text-green-500 text-sm" />
                        ) : (
                          <Icon icon="lucide:wifi-off" className="text-red-500 text-sm" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{location.city}, {location.state}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{location.manager}</div>
                      <div className="text-sm text-gray-500">{location.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(location.status)} variant="flat" size="sm">
                      {location.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>₹{location.todaySales.toLocaleString()}</TableCell>
                  <TableCell>₹{location.inventory.toLocaleString()}</TableCell>
                  <TableCell>{location.staff}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {location.lastSync.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => {
                          setSelectedLocation(location);
                          setShowLocationDetails(true);
                        }}
                      >
                        <Icon icon="lucide:eye" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        isIconOnly
                        onPress={() => onSyncLocation(location.id)}
                        isDisabled={!location.isOnline}
                      >
                        <Icon icon="lucide:refresh-cw" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="secondary"
                        isIconOnly
                      >
                        <Icon icon="lucide:settings" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Add Location Modal */}
      <Modal isOpen={showAddModal} onOpenChange={setShowAddModal} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Location</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Location Name"
                    value={newLocation.name}
                    onValueChange={(value) => setNewLocation({...newLocation, name: value})}
                    isRequired
                  />
                  <Input
                    label="Manager Name"
                    value={newLocation.manager}
                    onValueChange={(value) => setNewLocation({...newLocation, manager: value})}
                    isRequired
                  />
                  <Input
                    label="Phone"
                    value={newLocation.phone}
                    onValueChange={(value) => setNewLocation({...newLocation, phone: value})}
                    isRequired
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={newLocation.email}
                    onValueChange={(value) => setNewLocation({...newLocation, email: value})}
                  />
                  <Input
                    label="City"
                    value={newLocation.city}
                    onValueChange={(value) => setNewLocation({...newLocation, city: value})}
                    isRequired
                  />
                  <Input
                    label="State"
                    value={newLocation.state}
                    onValueChange={(value) => setNewLocation({...newLocation, state: value})}
                    isRequired
                  />
                  <Input
                    label="Pincode"
                    value={newLocation.pincode}
                    onValueChange={(value) => setNewLocation({...newLocation, pincode: value})}
                    isRequired
                  />
                  <Select
                    label="Status"
                    selectedKeys={[newLocation.status]}
                    onSelectionChange={(keys) => 
                      setNewLocation({...newLocation, status: Array.from(keys)[0] as any})
                    }
                  >
                    <SelectItem key="active">Active</SelectItem>
                    <SelectItem key="inactive">Inactive</SelectItem>
                    <SelectItem key="maintenance">Maintenance</SelectItem>
                  </Select>
                </div>
                <Input
                  label="Address"
                  value={newLocation.address}
                  onValueChange={(value) => setNewLocation({...newLocation, address: value})}
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleAddLocation}>Add Location</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
