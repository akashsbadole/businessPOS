import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Pagination, Card, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { sampleCustomers } from "../../data/sample-data";

export const CustomersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  
  const rowsPerPage = 10;

  const filteredCustomers = React.useMemo(() => {
    return sampleCustomers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const pages = Math.ceil(filteredCustomers.length / rowsPerPage);
  
  const paginatedCustomers = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredCustomers.slice(start, end);
  }, [currentPage, filteredCustomers]);

  const statuses = ["all", "active", "inactive"];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" />}
        >
          Add Customer
        </Button>
      </div>

      <Card className="mb-8">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search customers..."
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
                  {selectedStatus === "all" ? "All Statuses" : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Statuses" 
                selectionMode="single" 
                selectedKeys={[selectedStatus]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedStatus(selected);
                }}
              >
                {statuses.map((status) => (
                  <DropdownItem key={status}>
                    {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
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
              Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
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
          aria-label="Customers table"
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
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>PHONE</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>TOTAL ORDERS</TableColumn>
            <TableColumn>TOTAL SPENT</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No customers found">
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar 
                      name={customer.name} 
                      src={`https://img.heroui.chat/image/avatar?w=40&h=40&u=${customer.id}`} 
                    />
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell>₹{customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip 
                    size="sm" 
                    color={customer.status === "active" ? "success" : "danger"} 
                    variant="flat"
                  >
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
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