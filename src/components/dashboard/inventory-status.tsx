import React from "react";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Product } from "../../types/pos";

interface InventoryStatusProps {
  products: Product[];
}

export const InventoryStatus: React.FC<InventoryStatusProps> = ({ products }) => {
  const lowStockProducts = React.useMemo(() => {
    return products
      .filter(product => product.stock <= 10)
      .sort((a, b) => a.stock - b.stock);
  }, [products]);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Low Stock Items</h3>
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
          aria-label="Low stock inventory items"
          classNames={{
            base: "min-h-[280px]",
          }}
        >
          <TableHeader>
            <TableColumn>PRODUCT</TableColumn>
            <TableColumn>CATEGORY</TableColumn>
            <TableColumn>STOCK</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No low stock items found">
            {lowStockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-content2 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Icon icon="lucide:package" className="text-xl text-default-400" />
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Chip 
                    size="sm" 
                    color={product.stock === 0 ? "danger" : "warning"} 
                    variant="flat"
                  >
                    {product.stock === 0 ? "Out of stock" : "Low stock"}
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