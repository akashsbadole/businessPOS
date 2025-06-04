import React from "react";
import { Card, CardBody, Button, Chip, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useInventoryStore } from "../../stores/inventory-store";

interface InventorySyncStatusProps {
  className?: string;
}

export const InventorySyncStatus: React.FC<InventorySyncStatusProps> = ({
  className = "",
}) => {
  const {
    products,
    isLoading,
    isImporting,
    importProgress,
    loadProducts,
  } = useInventoryStore();

  const [lastSyncTime, setLastSyncTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (products.length > 0) {
      setLastSyncTime(new Date());
    }
  }, [products.length]);

  const getStatusColor = () => {
    if (isLoading || isImporting) return "warning";
    if (products.length === 0) return "danger";
    return "success";
  };

  const getStatusText = () => {
    if (isImporting) return "Importing products...";
    if (isLoading) return "Loading products...";
    if (products.length === 0) return "No products found";
    return `${products.length} products loaded`;
  };

  const handleRefresh = () => {
    loadProducts();
  };

  const handleGoToInventory = () => {
    window.location.href = "/inventory";
  };

  return (
    <Card className={`${className}`}>
      <CardBody className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Icon 
                icon={
                  isLoading || isImporting 
                    ? "lucide:loader-2" 
                    : products.length > 0 
                    ? "lucide:check-circle" 
                    : "lucide:alert-circle"
                } 
                className={`text-lg ${
                  isLoading || isImporting ? "animate-spin" : ""
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Inventory Status</span>
                  <Chip 
                    size="sm" 
                    color={getStatusColor()} 
                    variant="flat"
                  >
                    {getStatusText()}
                  </Chip>
                </div>
                {lastSyncTime && (
                  <div className="text-xs text-gray-500">
                    Last synced: {lastSyncTime.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              isIconOnly
              onPress={handleRefresh}
              isLoading={isLoading}
              title="Refresh inventory"
            >
              <Icon icon="lucide:refresh-cw" />
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:package-plus" />}
              onPress={handleGoToInventory}
            >
              Manage
            </Button>
          </div>
        </div>

        {/* Import Progress */}
        {isImporting && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Importing products...</span>
              <span>{Math.round(importProgress)}%</span>
            </div>
            <Progress 
              value={importProgress} 
              color="primary" 
              size="sm"
            />
          </div>
        )}

        {/* Quick Actions */}
        {products.length === 0 && !isLoading && !isImporting && (
          <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-2">
              <Icon icon="lucide:info" className="text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">
                  No products in inventory
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Import products via CSV or add them manually to start selling
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    color="warning"
                    variant="flat"
                    startContent={<Icon icon="lucide:upload" />}
                    onPress={handleGoToInventory}
                  >
                    Import CSV
                  </Button>
                  <Button
                    size="sm"
                    color="warning"
                    variant="flat"
                    startContent={<Icon icon="lucide:plus" />}
                    onPress={handleGoToInventory}
                  >
                    Add Products
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {products.length > 0 && (
          <div className="mt-2">
            {(() => {
              const lowStockCount = products.filter(p => p.stock <= 5).length;
              const outOfStockCount = products.filter(p => p.stock === 0).length;
              
              if (outOfStockCount > 0 || lowStockCount > 0) {
                return (
                  <div className="flex items-center gap-2 text-xs">
                    {outOfStockCount > 0 && (
                      <Chip size="sm" color="danger" variant="flat">
                        {outOfStockCount} out of stock
                      </Chip>
                    )}
                    {lowStockCount > 0 && (
                      <Chip size="sm" color="warning" variant="flat">
                        {lowStockCount} low stock
                      </Chip>
                    )}
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
