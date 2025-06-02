import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Checkbox,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  permissions: string[];
}

export const UsersPermissions: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [users, setUsers] = React.useState<User[]>([
    {
      id: "u1",
      name: "Raj Kumar",
      email: "raj@businessPOS.com",
      role: "admin",
      status: "active",
      permissions: ["all"],
    },
    {
      id: "u2",
      name: "Priya Sharma",
      email: "priya@businessPOS.com",
      role: "manager",
      status: "active",
      permissions: ["pos", "inventory", "customers", "reports"],
    },
    {
      id: "u3",
      name: "Amit Patel",
      email: "amit@businessPOS.com",
      role: "cashier",
      status: "active",
      permissions: ["pos"],
    },
    {
      id: "u4",
      name: "Neha Singh",
      email: "neha@businessPOS.com",
      role: "inventory",
      status: "active",
      permissions: ["inventory", "reports_view"],
    },
    {
      id: "u5",
      name: "Vikram Joshi",
      email: "vikram@businessPOS.com",
      role: "cashier",
      status: "inactive",
      permissions: ["pos"],
    },
  ]);

  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    role: "cashier",
    permissions: ["pos"],
  });

  const roles = [
    { key: "admin", label: "Administrator" },
    { key: "manager", label: "Manager" },
    { key: "cashier", label: "Cashier" },
    { key: "inventory", label: "Inventory Manager" },
  ];

  const permissionOptions = [
    { key: "pos", label: "POS Access" },
    { key: "inventory", label: "Inventory Management" },
    { key: "customers", label: "Customer Management" },
    { key: "reports", label: "Reports (Full Access)" },
    { key: "reports_view", label: "Reports (View Only)" },
    { key: "settings", label: "Settings" },
    { key: "users", label: "User Management" },
  ];

  const handleAddUser = () => {
    const newId = `u${users.length + 1}`;
    setUsers([
      ...users,
      {
        id: newId,
        ...newUser,
        status: "active",
      },
    ]);
    onOpenChange(false);
  };

  const handleRoleChange = (role: string) => {
    setNewUser({ ...newUser, role });

    // Set default permissions based on role
    switch (role) {
      case "admin":
        setNewUser({ ...newUser, role, permissions: ["all"] });
        break;
      case "manager":
        setNewUser({
          ...newUser,
          role,
          permissions: ["pos", "inventory", "customers", "reports"],
        });
        break;
      case "cashier":
        setNewUser({ ...newUser, role, permissions: ["pos"] });
        break;
      case "inventory":
        setNewUser({
          ...newUser,
          role,
          permissions: ["inventory", "reports_view"],
        });
        break;
      default:
        setNewUser({ ...newUser, role, permissions: [] });
    }
  };

  const handlePermissionChange = (permission: string) => {
    const currentPermissions = [...newUser.permissions];

    if (currentPermissions.includes(permission)) {
      setNewUser({
        ...newUser,
        permissions: currentPermissions.filter((p) => p !== permission),
      });
    } else {
      setNewUser({
        ...newUser,
        permissions: [...currentPermissions, permission],
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Users & Permissions</h3>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:user-plus" />}
          onPress={onOpen}
        >
          Add User
        </Button>
      </div>

      <Card>
        <CardBody>
          <Table removeWrapper aria-label="Users and permissions table">
            <TableHeader>
              <TableColumn>USER</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>PERMISSIONS</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No users found">
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        user.role === "admin"
                          ? "secondary"
                          : user.role === "manager"
                          ? "primary"
                          : user.role === "cashier"
                          ? "success"
                          : "default"
                      }
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.includes("all") ? (
                        <Chip size="sm" variant="flat" color="secondary">
                          All Permissions
                        </Chip>
                      ) : (
                        user.permissions.map((permission, index) => (
                          <Chip key={index} size="sm" variant="flat">
                            {permission.replace("_", " ")}
                          </Chip>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={user.status === "active" ? "success" : "danger"}
                      variant="flat"
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New User
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    placeholder="Enter user name"
                    value={newUser.name}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, name: value })
                    }
                  />

                  <Input
                    label="Email"
                    placeholder="Enter user email"
                    value={newUser.email}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, email: value })
                    }
                  />

                  <Select
                    label="Role"
                    placeholder="Select role"
                    selectedKeys={[newUser.role]}
                    onSelectionChange={(keys) => {
                      const role = Array.from(keys)[0] as string;
                      handleRoleChange(role);
                    }}
                  >
                    {roles.map((role) => (
                      <SelectItem key={role.key} value={role.key}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </Select>

                  {newUser.role !== "admin" && (
                    <div>
                      <p className="text-small font-medium mb-2">Permissions</p>
                      <div className="flex flex-col gap-2">
                        {permissionOptions.map((permission) => (
                          <Checkbox
                            key={permission.key}
                            isSelected={newUser.permissions.includes(
                              permission.key
                            )}
                            onValueChange={() =>
                              handlePermissionChange(permission.key)
                            }
                          >
                            {permission.label}
                          </Checkbox>
                        ))}
                      </div>
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
                  onPress={handleAddUser}
                  isDisabled={!newUser.name || !newUser.email}
                >
                  Add User
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
