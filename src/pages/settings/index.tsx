import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Input,
  Button,
  Divider,
  Checkbox,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { UsersPermissions } from "./users-permissions";
import { DatabaseStatus } from "../../components/database-status";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("business");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="p-0">
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={setActiveTab as any}
                orientation="vertical"
                color="primary"
                variant="light"
                classNames={{
                  base: "w-full",
                  tabList: "gap-2 w-full",
                  cursor: "w-full bg-primary",
                  tab: "max-w-full justify-start h-12 px-4",
                  tabContent: "group-data-[selected=true]:text-primary",
                }}
              >
                <Tab
                  key="business"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:building-2" />
                      <span>Business Profile</span>
                    </div>
                  }
                />
                <Tab
                  key="tax"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:percent" />
                      <span>Tax Settings</span>
                    </div>
                  }
                />
                <Tab
                  key="payment"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:credit-card" />
                      <span>Payment Methods</span>
                    </div>
                  }
                />
                <Tab
                  key="receipt"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:receipt" />
                      <span>Receipt Settings</span>
                    </div>
                  }
                />
                <Tab
                  key="users"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:users" />
                      <span>Users & Permissions</span>
                    </div>
                  }
                />
                <Tab
                  key="hardware"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:printer" />
                      <span>Hardware</span>
                    </div>
                  }
                />
                <Tab
                  key="backup"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:database" />
                      <span>Backup & Restore</span>
                    </div>
                  }
                />
              </Tabs>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {activeTab === "business" && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Business Profile</h3>
              </CardHeader>
              <CardBody className="gap-6">
                <div className="flex flex-col gap-4">
                  <Input
                    label="Business Name"
                    placeholder="Enter your business name"
                    defaultValue="Sharma General Store"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="GST Number"
                      placeholder="Enter your GST number"
                      defaultValue="27AADCB2230M1ZT"
                    />
                    <Input
                      label="PAN Number"
                      placeholder="Enter your PAN number"
                      defaultValue="AADCB2230M"
                    />
                  </div>

                  <Input
                    label="Business Address"
                    placeholder="Enter your business address"
                    defaultValue="123, Main Road, Andheri East"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      placeholder="Enter city"
                      defaultValue="Mumbai"
                    />
                    <Input
                      label="State"
                      placeholder="Enter state"
                      defaultValue="Maharashtra"
                    />
                    <Input
                      label="PIN Code"
                      placeholder="Enter PIN code"
                      defaultValue="400069"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      placeholder="Enter phone number"
                      defaultValue="+91 9876543210"
                      startContent={<Icon icon="lucide:phone" />}
                    />
                    <Input
                      label="Email Address"
                      placeholder="Enter email address"
                      defaultValue="contact@sharmastores.com"
                      startContent={<Icon icon="lucide:mail" />}
                    />
                  </div>
                </div>

                <Divider />

                <div>
                  <h4 className="text-lg font-medium mb-3">Business Logo</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-content2 rounded-lg flex items-center justify-center">
                      <Icon
                        icon="lucide:image"
                        className="text-4xl text-default-400"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="flat"
                        color="primary"
                        startContent={<Icon icon="lucide:upload" />}
                      >
                        Upload Logo
                      </Button>
                      <p className="text-tiny text-default-500">
                        Recommended size: 200x200px (PNG, JPG)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="flat">Cancel</Button>
                  <Button color="primary">Save Changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === "tax" && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Tax Settings</h3>
              </CardHeader>
              <CardBody className="gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium">GST Settings</h4>
                      <p className="text-default-500 text-sm">
                        Configure how GST is calculated and displayed
                      </p>
                    </div>
                    <Checkbox defaultSelected>Enable GST</Checkbox>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Default GST Type"
                      placeholder="Select GST type"
                      defaultSelectedKeys={["inclusive"]}
                    >
                      <SelectItem key="inclusive" value="inclusive">
                        GST Inclusive
                      </SelectItem>
                      <SelectItem key="exclusive" value="exclusive">
                        GST Exclusive
                      </SelectItem>
                    </Select>

                    <Select
                      label="Default GST Rate"
                      placeholder="Select GST rate"
                      defaultSelectedKeys={["18"]}
                    >
                      <SelectItem key="0" value="0">
                        0% (Exempt)
                      </SelectItem>
                      <SelectItem key="5" value="5">
                        5% (CGST 2.5% + SGST 2.5%)
                      </SelectItem>
                      <SelectItem key="12" value="12">
                        12% (CGST 6% + SGST 6%)
                      </SelectItem>
                      <SelectItem key="18" value="18">
                        18% (CGST 9% + SGST 9%)
                      </SelectItem>
                      <SelectItem key="28" value="28">
                        28% (CGST 14% + SGST 14%)
                      </SelectItem>
                    </Select>
                  </div>

                  <Divider />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium">GST Reporting</h4>
                      <p className="text-default-500 text-sm">
                        Configure GST report generation
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="GSTR-1 Filing Frequency"
                      placeholder="Select frequency"
                      defaultSelectedKeys={["monthly"]}
                    >
                      <SelectItem key="monthly" value="monthly">
                        Monthly
                      </SelectItem>
                      <SelectItem key="quarterly" value="quarterly">
                        Quarterly
                      </SelectItem>
                    </Select>

                    <Input
                      label="GSTIN Verification API Key"
                      placeholder="Enter API key (optional)"
                      type="password"
                    />
                  </div>

                  <Checkbox defaultSelected>
                    Auto-generate GSTR-1 reports at month end
                  </Checkbox>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="flat">Cancel</Button>
                  <Button color="primary">Save Changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardBody>
                <UsersPermissions />
              </CardBody>
            </Card>
          )}

          {activeTab === "backup" && (
            <div className="space-y-6">
              <DatabaseStatus />
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Backup & Restore</h3>
                </CardHeader>
                <CardBody>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-default-500">
                      Backup and restore functionality will be displayed here
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab !== "business" &&
            activeTab !== "tax" &&
            activeTab !== "users" &&
            activeTab !== "backup" && (
              <Card>
                <CardBody>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-default-500">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                      settings will be displayed here
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
};
