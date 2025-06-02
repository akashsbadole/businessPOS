import React from "react";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Transaction } from "../../types/pos";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "cash":
        return "lucide:banknote";
      case "upi":
        return "logos:upi";
      case "card":
        return "lucide:credit-card";
      case "wallet":
        return "lucide:wallet";
      default:
        return "lucide:banknote";
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        <Button 
          size="sm" 
          variant="flat" 
          color="primary"
          endContent={<Icon icon="lucide:arrow-right" />}
        >
          View All
        </Button>
      </CardHeader>
      <CardBody>
        <Table 
          removeWrapper 
          aria-label="Recent transactions"
          classNames={{
            base: "min-h-[280px]",
          }}
        >
          <TableHeader>
            <TableColumn>INVOICE</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>PAYMENT</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No recent transactions">
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:file-text" className="text-default-500" />
                    <span>{transaction.invoiceNumber}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar 
                      name={transaction.customer || "Guest"} 
                      size="sm" 
                      src={transaction.customer ? `https://img.heroui.chat/image/avatar?w=40&h=40&u=${transaction.id}` : undefined}
                    />
                    <span>{transaction.customer || "Guest"}</span>
                  </div>
                </TableCell>
                <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Icon icon={getPaymentIcon(transaction.paymentMethod)} />
                    <span className="capitalize">{transaction.paymentMethod}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip 
                    size="sm" 
                    color={transaction.status === "completed" ? "success" : 
                           transaction.status === "pending" ? "warning" : "danger"} 
                    variant="flat"
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};