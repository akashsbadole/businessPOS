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
  Avatar,
  Progress,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "owner" | "manager" | "cashier" | "sales" | "accountant";
  status: "active" | "inactive" | "on_leave";
  joinDate: Date;
  salary: number;
  commission: number;
  locationId?: string;
  permissions: string[];
  avatar?: string;
  lastLogin?: Date;
  todaySales: number;
  monthSales: number;
  performance: {
    transactionsToday: number;
    avgTransactionValue: number;
    customerSatisfaction: number;
    targetAchievement: number;
  };
}

interface StaffPerformance {
  staffId: string;
  date: Date;
  salesAmount: number;
  transactionCount: number;
  hoursWorked: number;
  commission: number;
}

interface StaffManagementProps {
  staff: StaffMember[];
  performance: StaffPerformance[];
  onAddStaff: (staff: Omit<StaffMember, 'id'>) => void;
  onUpdateStaff: (id: string, staff: Partial<StaffMember>) => void;
  onDeleteStaff: (id: string) => void;
  onUpdatePermissions: (staffId: string, permissions: string[]) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  staff,
  performance,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onUpdatePermissions,
}) => {
  const [selectedTab, setSelectedTab] = React.useState("overview");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedStaff, setSelectedStaff] = React.useState<StaffMember | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");

  const [newStaff, setNewStaff] = React.useState({
    name: "",
    email: "",
    phone: "",
    role: "cashier" as const,
    salary: 0,
    commission: 0,
    locationId: "",
  });

  // Available permissions
  const availablePermissions = [
    { id: "pos_access", label: "POS Access", description: "Access to point of sale system" },
    { id: "inventory_view", label: "View Inventory", description: "View product inventory" },
    { id: "inventory_edit", label: "Edit Inventory", description: "Add/edit products" },
    { id: "customer_view", label: "View Customers", description: "View customer information" },
    { id: "customer_edit", label: "Edit Customers", description: "Add/edit customers" },
    { id: "reports_view", label: "View Reports", description: "Access to sales reports" },
    { id: "reports_export", label: "Export Reports", description: "Export reports to PDF/CSV" },
    { id: "settings_view", label: "View Settings", description: "View system settings" },
    { id: "settings_edit", label: "Edit Settings", description: "Modify system settings" },
    { id: "staff_manage", label: "Manage Staff", description: "Add/edit staff members" },
    { id: "financial_view", label: "View Financials", description: "Access financial data" },
    { id: "discount_apply", label: "Apply Discounts", description: "Apply discounts to sales" },
  ];

  // Role-based default permissions
  const rolePermissions = {
    owner: availablePermissions.map(p => p.id),
    manager: [
      "pos_access", "inventory_view", "inventory_edit", "customer_view", "customer_edit",
      "reports_view", "reports_export", "discount_apply", "staff_manage"
    ],
    cashier: ["pos_access", "customer_view", "customer_edit"],
    sales: ["pos_access", "customer_view", "customer_edit", "inventory_view", "discount_apply"],
    accountant: ["reports_view", "reports_export", "financial_view", "settings_view"],
  };

  // Filter staff
  const filteredStaff = React.useMemo(() => {
    return staff.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staff, searchQuery, roleFilter]);

  // Calculate analytics
  const analytics = React.useMemo(() => {
    const activeStaff = staff.filter(s => s.status === "active").length;
    const totalSalary = staff.reduce((sum, s) => sum + s.salary, 0);
    const todaysSales = staff.reduce((sum, s) => sum + s.todaySales, 0);
    const avgPerformance = staff.reduce((sum, s) => sum + s.performance.targetAchievement, 0) / staff.length;

    return {
      totalStaff: staff.length,
      activeStaff,
      totalSalary,
      todaysSales,
      avgPerformance: avgPerformance || 0,
    };
  }, [staff]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "success";
      case "manager": return "primary";
      case "cashier": return "secondary";
      case "sales": return "warning";
      case "accountant": return "default";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "danger";
      case "on_leave": return "warning";
      default: return "default";
    }
  };

  const handleAddStaff = () => {
    const staffData = {
      ...newStaff,
      status: "active" as const,
      joinDate: new Date(),
      permissions: rolePermissions[newStaff.role] || [],
      todaySales: 0,
      monthSales: 0,
      performance: {
        transactionsToday: 0,
        avgTransactionValue: 0,
        customerSatisfaction: 0,
        targetAchievement: 0,
      },
    };

    onAddStaff(staffData);
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      role: "cashier",
      salary: 0,
      commission: 0,
      locationId: "",
    });
    setShowAddModal(false);
  };

  const handleUpdatePermissions = (permissions: string[]) => {
    if (selectedStaff) {
      onUpdatePermissions(selectedStaff.id, permissions);
      setShowPermissionsModal(false);
      setSelectedStaff(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:user-plus" />}
          onPress={() => setShowAddModal(true)}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{analytics.totalStaff}</p>
                <p className="text-sm text-green-600">{analytics.activeStaff} active</p>
              </div>
              <Icon icon="lucide:users" className="text-3xl text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Salary</p>
                <p className="text-2xl font-bold">₹{analytics.totalSalary.toLocaleString()}</p>
              </div>
              <Icon icon="lucide:banknote" className="text-3xl text-green-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold">₹{analytics.todaysSales.toLocaleString()}</p>
              </div>
              <Icon icon="lucide:trending-up" className="text-3xl text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold">{analytics.avgPerformance.toFixed(1)}%</p>
                <Progress value={analytics.avgPerformance} className="mt-1" />
              </div>
              <Icon icon="lucide:target" className="text-3xl text-orange-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search staff..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Icon icon="lucide:search" />}
          className="flex-1"
        />
        <Select
          placeholder="Filter by role"
          selectedKeys={[roleFilter]}
          onSelectionChange={(keys) => setRoleFilter(Array.from(keys)[0] as string)}
          className="w-48"
        >
          <SelectItem key="all">All Roles</SelectItem>
          <SelectItem key="owner">Owner</SelectItem>
          <SelectItem key="manager">Manager</SelectItem>
          <SelectItem key="cashier">Cashier</SelectItem>
          <SelectItem key="sales">Sales</SelectItem>
          <SelectItem key="accountant">Accountant</SelectItem>
        </Select>
      </div>

      {/* Staff Table */}
      <Card>
        <CardBody>
          <Table aria-label="Staff table">
            <TableHeader>
              <TableColumn>STAFF MEMBER</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>TODAY'S SALES</TableColumn>
              <TableColumn>PERFORMANCE</TableColumn>
              <TableColumn>LAST LOGIN</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={member.avatar}
                        name={member.name}
                        size="sm"
                      />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip color={getRoleColor(member.role)} variant="flat" size="sm">
                      {member.role.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(member.status)} variant="flat" size="sm">
                      {member.status.replace('_', ' ').toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>₹{member.todaySales.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={member.performance.targetAchievement} 
                        className="w-16" 
                        size="sm"
                      />
                      <span className="text-sm">{member.performance.targetAchievement}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.lastLogin ? 
                      new Date(member.lastLogin).toLocaleDateString('en-IN') : 
                      'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => {
                          setSelectedStaff(member);
                          setShowPermissionsModal(true);
                        }}
                      >
                        <Icon icon="lucide:shield" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                      >
                        <Icon icon="lucide:edit" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isIconOnly
                      >
                        <Icon icon="lucide:trash" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Add Staff Modal */}
      <Modal isOpen={showAddModal} onOpenChange={setShowAddModal} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Staff Member</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={newStaff.name}
                    onValueChange={(value) => setNewStaff({...newStaff, name: value})}
                    isRequired
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={newStaff.email}
                    onValueChange={(value) => setNewStaff({...newStaff, email: value})}
                    isRequired
                  />
                  <Input
                    label="Phone"
                    value={newStaff.phone}
                    onValueChange={(value) => setNewStaff({...newStaff, phone: value})}
                    isRequired
                  />
                  <Select
                    label="Role"
                    selectedKeys={[newStaff.role]}
                    onSelectionChange={(keys) => 
                      setNewStaff({...newStaff, role: Array.from(keys)[0] as any})
                    }
                  >
                    <SelectItem key="cashier">Cashier</SelectItem>
                    <SelectItem key="sales">Sales Person</SelectItem>
                    <SelectItem key="manager">Manager</SelectItem>
                    <SelectItem key="accountant">Accountant</SelectItem>
                  </Select>
                  <Input
                    label="Monthly Salary"
                    type="number"
                    value={newStaff.salary.toString()}
                    onValueChange={(value) => setNewStaff({...newStaff, salary: parseFloat(value) || 0})}
                    startContent="₹"
                  />
                  <Input
                    label="Commission %"
                    type="number"
                    value={newStaff.commission.toString()}
                    onValueChange={(value) => setNewStaff({...newStaff, commission: parseFloat(value) || 0})}
                    endContent="%"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleAddStaff}>Add Staff</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Permissions Modal */}
      <Modal isOpen={showPermissionsModal} onOpenChange={setShowPermissionsModal} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Manage Permissions - {selectedStaff?.name}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{permission.label}</div>
                        <div className="text-sm text-gray-500">{permission.description}</div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={selectedStaff?.permissions.includes(permission.id)}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={() => handleUpdatePermissions([])}>
                  Update Permissions
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
