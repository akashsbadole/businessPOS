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
  Tabs,
  Tab,
  Progress,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  gstin?: string;
  totalOrders: number;
  totalSpent: number;
  lastVisit: Date;
  loyaltyPoints: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  status: "active" | "inactive";
  notes?: string;
}

interface CustomerManagementProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  onUpdateCustomer: (id: string, customer: Partial<Customer>) => void;
  onSendWhatsApp: (customerId: string, message: string) => void;
  onSendPromotion: (customerIds: string[], promotion: any) => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onSendWhatsApp,
  onSendPromotion,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTier, setSelectedTier] = React.useState("all");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = React.useState(false);

  const [newCustomer, setNewCustomer] = React.useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    gstin: "",
    notes: "",
  });

  // Filter customers
  const filteredCustomers = React.useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.phone.includes(searchQuery) ||
                           customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = selectedTier === "all" || customer.tier === selectedTier;
      return matchesSearch && matchesTier;
    });
  }, [customers, searchQuery, selectedTier]);

  // Customer analytics
  const analytics = React.useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === "active").length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0;
    
    const tierDistribution = customers.reduce((acc, customer) => {
      acc[customer.tier] = (acc[customer.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      avgOrderValue,
      tierDistribution,
    };
  }, [customers]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze": return "default";
      case "silver": return "secondary";
      case "gold": return "warning";
      case "platinum": return "success";
      default: return "default";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "bronze": return "lucide:award";
      case "silver": return "lucide:medal";
      case "gold": return "lucide:crown";
      case "platinum": return "lucide:gem";
      default: return "lucide:user";
    }
  };

  const handleAddCustomer = () => {
    const customer = {
      ...newCustomer,
      totalOrders: 0,
      totalSpent: 0,
      lastVisit: new Date(),
      loyaltyPoints: 0,
      tier: "bronze" as const,
      status: "active" as const,
    };
    onAddCustomer(customer);
    setNewCustomer({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      gstin: "",
      notes: "",
    });
    setShowAddModal(false);
  };

  const handleSendBulkPromotion = () => {
    const selectedIds = filteredCustomers.map(c => c.id);
    const promotion = {
      title: "Special Offer",
      message: "Get 20% off on your next purchase!",
      validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
    onSendPromotion(selectedIds, promotion);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <div className="flex gap-2">
          <Button
            color="secondary"
            variant="flat"
            startContent={<Icon icon="lucide:megaphone" />}
            onPress={handleSendBulkPromotion}
          >
            Send Promotion
          </Button>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:user-plus" />}
            onPress={() => setShowAddModal(true)}
          >
            Add Customer
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{analytics.totalCustomers}</p>
              </div>
              <Icon icon="lucide:users" className="text-3xl text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{analytics.activeCustomers}</p>
              </div>
              <Icon icon="lucide:user-check" className="text-3xl text-green-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">₹{analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <Icon icon="lucide:indian-rupee" className="text-3xl text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-orange-600">₹{analytics.avgOrderValue.toFixed(0)}</p>
              </div>
              <Icon icon="lucide:shopping-cart" className="text-3xl text-orange-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Customer Tier Distribution */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Customer Tier Distribution</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.tierDistribution).map(([tier, count]) => (
              <div key={tier} className="text-center">
                <Icon icon={getTierIcon(tier)} className="text-3xl mx-auto mb-2" />
                <div className="text-lg font-bold">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{tier}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Icon icon="lucide:search" />}
          className="flex-1"
        />
        <Select
          placeholder="Filter by tier"
          selectedKeys={[selectedTier]}
          onSelectionChange={(keys) => setSelectedTier(Array.from(keys)[0] as string)}
          className="w-48"
        >
          <SelectItem key="all">All Tiers</SelectItem>
          <SelectItem key="bronze">Bronze</SelectItem>
          <SelectItem key="silver">Silver</SelectItem>
          <SelectItem key="gold">Gold</SelectItem>
          <SelectItem key="platinum">Platinum</SelectItem>
        </Select>
      </div>

      {/* Customer Table */}
      <Card>
        <CardBody>
          <Table aria-label="Customers table">
            <TableHeader>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>CONTACT</TableColumn>
              <TableColumn>TIER</TableColumn>
              <TableColumn>ORDERS</TableColumn>
              <TableColumn>TOTAL SPENT</TableColumn>
              <TableColumn>LOYALTY POINTS</TableColumn>
              <TableColumn>LAST VISIT</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      {customer.city && <div className="text-sm text-gray-500">{customer.city}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{customer.phone}</div>
                      {customer.email && <div className="text-sm text-gray-500">{customer.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getTierColor(customer.tier)}
                      variant="flat"
                      size="sm"
                      startContent={<Icon icon={getTierIcon(customer.tier)} />}
                    >
                      {customer.tier.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>₹{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>{customer.loyaltyPoints}</TableCell>
                  <TableCell>{customer.lastVisit.toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => {
                          setSelectedCustomer(customer);
                          setShowCustomerDetails(true);
                        }}
                      >
                        <Icon icon="lucide:eye" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="success"
                        isIconOnly
                        onPress={() => onSendWhatsApp(customer.id, "Thank you for being our valued customer!")}
                      >
                        <Icon icon="lucide:message-circle" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Add Customer Modal */}
      <Modal isOpen={showAddModal} onOpenChange={setShowAddModal} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Customer</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    value={newCustomer.name}
                    onValueChange={(value) => setNewCustomer({...newCustomer, name: value})}
                    isRequired
                  />
                  <Input
                    label="Phone"
                    value={newCustomer.phone}
                    onValueChange={(value) => setNewCustomer({...newCustomer, phone: value})}
                    isRequired
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={newCustomer.email}
                    onValueChange={(value) => setNewCustomer({...newCustomer, email: value})}
                  />
                  <Input
                    label="GSTIN"
                    value={newCustomer.gstin}
                    onValueChange={(value) => setNewCustomer({...newCustomer, gstin: value})}
                  />
                  <Input
                    label="City"
                    value={newCustomer.city}
                    onValueChange={(value) => setNewCustomer({...newCustomer, city: value})}
                  />
                  <Input
                    label="State"
                    value={newCustomer.state}
                    onValueChange={(value) => setNewCustomer({...newCustomer, state: value})}
                  />
                </div>
                <Input
                  label="Address"
                  value={newCustomer.address}
                  onValueChange={(value) => setNewCustomer({...newCustomer, address: value})}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleAddCustomer}>Add Customer</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
