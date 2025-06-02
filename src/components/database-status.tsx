import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  getDatabaseInfo,
  switchToPostgreSQL,
  switchToLocalStorage,
} from "../services/database-factory";

export const DatabaseStatus: React.FC = () => {
  const [dbInfo, setDbInfo] = React.useState(getDatabaseInfo());

  React.useEffect(() => {
    setDbInfo(getDatabaseInfo());
  }, []);

  const handleSwitchDatabase = () => {
    // For browser version, PostgreSQL requires server-side setup
    alert(
      "PostgreSQL support requires server-side deployment. See POSTGRESQL_SETUP.md for details."
    );
  };

  return (
    <Card className="w-full">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                dbInfo.isPostgreSQL
                  ? "bg-blue-100 text-blue-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              <Icon
                icon={
                  dbInfo.isPostgreSQL
                    ? "simple-icons:postgresql"
                    : "lucide:database"
                }
                className="w-5 h-5"
              />
            </div>
            <div>
              <h3 className="font-semibold">Database Status</h3>
              <p className="text-sm text-default-600">
                Currently using: <strong>{dbInfo.type}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Chip
              color={dbInfo.isPostgreSQL ? "success" : "warning"}
              variant="flat"
              size="sm"
            >
              {dbInfo.isPostgreSQL ? "Production Ready" : "Development Mode"}
            </Chip>

            <Button
              size="sm"
              variant="bordered"
              onPress={handleSwitchDatabase}
              startContent={
                <Icon icon="simple-icons:postgresql" className="w-4 h-4" />
              }
            >
              Setup PostgreSQL
            </Button>
          </div>
        </div>

        {dbInfo.isLocalStorage && (
          <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-2">
              <Icon
                icon="lucide:info"
                className="w-4 h-4 text-orange-600 mt-0.5"
              />
              <div className="text-sm">
                <p className="font-medium text-orange-800">Development Mode</p>
                <p className="text-orange-700">
                  Data is stored in browser localStorage. For production use
                  with PostgreSQL, see POSTGRESQL_SETUP.md for server-side
                  deployment instructions.
                </p>
              </div>
            </div>
          </div>
        )}

        {dbInfo.isPostgreSQL && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Icon
                icon="lucide:check-circle"
                className="w-4 h-4 text-blue-600 mt-0.5"
              />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Production Ready</p>
                <p className="text-blue-700">
                  Connected to PostgreSQL database for reliable data
                  persistence.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
