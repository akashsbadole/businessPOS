import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { clearAllData, loadDummyDataEnhanced } from "../../data/dummy-database";

interface LoadResult {
  success: boolean;
  message: string;
  counts?: {
    categories: number;
    suppliers: number;
    products: number;
    customers: number;
    transactions: number;
  };
  error?: string;
}

export const DummyDataLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [loadResult, setLoadResult] = useState<LoadResult | null>(null);
  const [progress, setProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLoadData = async (
    options: { clearFirst?: boolean; loadAdditional?: boolean } = {}
  ) => {
    setIsLoading(true);
    setProgress(0);
    setLoadResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await loadDummyDataEnhanced({
        clearFirst: options.clearFirst,
        loadAdditionalData: options.loadAdditional,
        skipExistingCheck: options.clearFirst,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setLoadResult(result);

      // Reset progress after a delay
      setTimeout(() => {
        setProgress(0);
      }, 2000);
    } catch (error) {
      setLoadResult({
        success: false,
        message: "Failed to load dummy data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    setLoadResult(null);

    try {
      const result = await clearAllData();
      setLoadResult(result);
    } catch (error) {
      setLoadResult({
        success: false,
        message: "Failed to clear data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsClearing(false);
      onClose();
    }
  };

  const getTotalCount = (counts?: LoadResult["counts"]) => {
    if (!counts) return 0;
    return (
      counts.categories +
      counts.suppliers +
      counts.products +
      counts.customers +
      counts.transactions
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex gap-3">
        <Icon
          icon="lucide:database"
          width={24}
          height={24}
          className="text-primary"
        />
        <div className="flex flex-col">
          <p className="text-md font-semibold">Dummy Data Loader</p>
          <p className="text-small text-default-500">
            Load sample data to test your POS system
          </p>
        </div>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-default-600">
            This will load comprehensive sample data including:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:folder" width={16} height={16} />
              <span>22+ Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:building" width={16} height={16} />
              <span>22+ Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:package" width={16} height={16} />
              <span>40+ Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:users" width={16} height={16} />
              <span>30+ Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:receipt" width={16} height={16} />
              <span>25+ Transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:chart-bar" width={16} height={16} />
              <span>Sales Analytics</span>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>Loading data...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} color="primary" className="w-full" />
          </div>
        )}

        {loadResult && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Icon
                icon={
                  loadResult.success ? "lucide:check-circle" : "lucide:x-circle"
                }
                width={20}
                height={20}
                className={loadResult.success ? "text-success" : "text-danger"}
              />
              <span
                className={`text-sm font-medium ${
                  loadResult.success ? "text-success" : "text-danger"
                }`}
              >
                {loadResult.message}
              </span>
            </div>

            {loadResult.success && loadResult.counts && (
              <div className="flex flex-wrap gap-2">
                <Chip size="sm" color="primary" variant="flat">
                  Categories: {loadResult.counts.categories}
                </Chip>
                <Chip size="sm" color="secondary" variant="flat">
                  Suppliers: {loadResult.counts.suppliers}
                </Chip>
                <Chip size="sm" color="success" variant="flat">
                  Products: {loadResult.counts.products}
                </Chip>
                <Chip size="sm" color="warning" variant="flat">
                  Customers: {loadResult.counts.customers}
                </Chip>
                <Chip size="sm" color="danger" variant="flat">
                  Transactions: {loadResult.counts.transactions}
                </Chip>
                <Chip size="sm" color="default" variant="flat">
                  Total: {getTotalCount(loadResult.counts)}
                </Chip>
              </div>
            )}

            {loadResult.error && (
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm text-danger-700">
                  <strong>Error:</strong> {loadResult.error}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            color="primary"
            onPress={() => handleLoadData()}
            isLoading={isLoading}
            startContent={
              !isLoading && (
                <Icon icon="lucide:download" width={16} height={16} />
              )
            }
            className="flex-1"
          >
            {isLoading ? "Loading Data..." : "Load Dummy Data"}
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                color="secondary"
                variant="bordered"
                startContent={
                  <Icon icon="lucide:settings" width={16} height={16} />
                }
              >
                Options
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Data management options">
              <DropdownItem
                key="load-fresh"
                startContent={
                  <Icon icon="lucide:refresh-ccw" width={16} height={16} />
                }
                onPress={() =>
                  handleLoadData({ clearFirst: true, loadAdditional: true })
                }
              >
                Load Fresh Data (Clear + Load)
              </DropdownItem>
              <DropdownItem
                key="load-additional"
                startContent={
                  <Icon icon="lucide:plus" width={16} height={16} />
                }
                onPress={() => handleLoadData({ loadAdditional: true })}
              >
                Load with Additional Data
              </DropdownItem>
              <DropdownItem
                key="clear-data"
                color="danger"
                startContent={
                  <Icon icon="lucide:trash-2" width={16} height={16} />
                }
                onPress={onOpen}
              >
                Clear All Data
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Button
            color="default"
            variant="bordered"
            onPress={() => {
              setLoadResult(null);
              setProgress(0);
            }}
            startContent={
              <Icon icon="lucide:refresh-cw" width={16} height={16} />
            }
          >
            Reset
          </Button>
        </div>

        <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icon
              icon="lucide:alert-triangle"
              width={16}
              height={16}
              className="text-warning-600 mt-0.5"
            />
            <div className="text-sm text-warning-700">
              <p className="font-medium">Important Notes:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Basic load only adds data if database is empty</li>
                <li>Use "Options" for advanced loading features</li>
                <li>Perfect for testing and development</li>
                <li>All data includes realistic Indian business scenarios</li>
              </ul>
            </div>
          </div>
        </div>
      </CardBody>

      {/* Clear Data Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon
                icon="lucide:alert-triangle"
                width={24}
                height={24}
                className="text-danger"
              />
              <span>Clear All Data</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-default-600">
                This action will permanently delete all data from your database
                including:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:receipt" width={16} height={16} />
                  <span>All Transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:package" width={16} height={16} />
                  <span>All Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:users" width={16} height={16} />
                  <span>All Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:building" width={16} height={16} />
                  <span>All Suppliers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:folder" width={16} height={16} />
                  <span>All Categories</span>
                </div>
              </div>
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-danger-700 font-medium">
                  ⚠️ This action cannot be undone!
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleClearData}
              isLoading={isClearing}
              startContent={
                !isClearing && (
                  <Icon icon="lucide:trash-2" width={16} height={16} />
                )
              }
            >
              {isClearing ? "Clearing..." : "Clear All Data"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};
