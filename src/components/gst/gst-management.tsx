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
  Select,
  SelectItem,
  DatePicker,
  Chip,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface GSTReport {
  id: string;
  period: string;
  totalSales: number;
  totalPurchases: number;
  outputGST: number;
  inputGST: number;
  netGST: number;
  status: "draft" | "filed" | "pending";
  dueDate: Date;
}

interface GSTManagementProps {
  onExportGSTR1: () => void;
  onExportGSTR3B: () => void;
  onGenerateReport: (period: string) => void;
}

export const GSTManagement: React.FC<GSTManagementProps> = ({
  onExportGSTR1,
  onExportGSTR3B,
  onGenerateReport,
}) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState("current_month");
  const [gstReports, setGstReports] = React.useState<GSTReport[]>([
    {
      id: "1",
      period: "March 2024",
      totalSales: 500000,
      totalPurchases: 300000,
      outputGST: 90000,
      inputGST: 54000,
      netGST: 36000,
      status: "filed",
      dueDate: new Date("2024-04-20"),
    },
    {
      id: "2",
      period: "April 2024",
      totalSales: 750000,
      totalPurchases: 450000,
      outputGST: 135000,
      inputGST: 81000,
      netGST: 54000,
      status: "pending",
      dueDate: new Date("2024-05-20"),
    },
  ]);

  const gstRates = [
    { rate: 0, description: "Exempt", items: ["Basic food items", "Educational services"] },
    { rate: 5, description: "Essential goods", items: ["Sugar", "Tea", "Coffee"] },
    { rate: 12, description: "Standard rate", items: ["Computers", "Processed food"] },
    { rate: 18, description: "Most goods", items: ["Electronics", "Textiles"] },
    { rate: 28, description: "Luxury items", items: ["Cars", "Tobacco"] },
  ];

  const periods = [
    { key: "current_month", label: "Current Month" },
    { key: "last_month", label: "Last Month" },
    { key: "current_quarter", label: "Current Quarter" },
    { key: "last_quarter", label: "Last Quarter" },
    { key: "current_year", label: "Current Financial Year" },
    { key: "custom", label: "Custom Period" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filed": return "success";
      case "pending": return "warning";
      case "draft": return "default";
      default: return "default";
    }
  };

  const calculateGSTBreakdown = (amount: number, rate: number, isIntrastate: boolean = true) => {
    const gstAmount = (amount * rate) / 100;
    if (isIntrastate) {
      return {
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        igst: 0,
        total: gstAmount,
      };
    } else {
      return {
        cgst: 0,
        sgst: 0,
        igst: gstAmount,
        total: gstAmount,
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">GST Management</h2>
        <div className="flex gap-2">
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon icon="lucide:file-text" />}
            onPress={onExportGSTR1}
          >
            Export GSTR-1
          </Button>
          <Button
            color="secondary"
            variant="flat"
            startContent={<Icon icon="lucide:file-spreadsheet" />}
            onPress={onExportGSTR3B}
          >
            Export GSTR-3B
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Output GST</p>
                <p className="text-2xl font-bold text-green-600">₹1,35,000</p>
              </div>
              <Icon icon="lucide:trending-up" className="text-3xl text-green-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Input GST</p>
                <p className="text-2xl font-bold text-blue-600">₹81,000</p>
              </div>
              <Icon icon="lucide:trending-down" className="text-3xl text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net GST Payable</p>
                <p className="text-2xl font-bold text-orange-600">₹54,000</p>
              </div>
              <Icon icon="lucide:calculator" className="text-3xl text-orange-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="text-lg font-bold text-red-600">20 May 2024</p>
              </div>
              <Icon icon="lucide:calendar" className="text-3xl text-red-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* GST Rate Reference */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">GST Rate Reference</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {gstRates.map((rate) => (
              <div key={rate.rate} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{rate.rate}%</div>
                <div className="text-sm font-medium">{rate.description}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {rate.items.slice(0, 2).map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* GST Calculator */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">GST Calculator</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              label="Amount (Excluding GST)"
              placeholder="Enter amount"
              startContent="₹"
            />
            <Select label="GST Rate" placeholder="Select GST rate">
              {gstRates.map((rate) => (
                <SelectItem key={rate.rate} value={rate.rate.toString()}>
                  {rate.rate}% - {rate.description}
                </SelectItem>
              ))}
            </Select>
            <div className="flex items-end">
              <Button color="primary" className="w-full">
                Calculate GST
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* GST Reports */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">GST Returns</h3>
            <div className="flex gap-2">
              <Select
                size="sm"
                selectedKeys={[selectedPeriod]}
                onSelectionChange={(keys) => setSelectedPeriod(Array.from(keys)[0] as string)}
                className="w-48"
              >
                {periods.map((period) => (
                  <SelectItem key={period.key}>{period.label}</SelectItem>
                ))}
              </Select>
              <Button
                size="sm"
                color="primary"
                onPress={() => onGenerateReport(selectedPeriod)}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Table aria-label="GST reports table">
            <TableHeader>
              <TableColumn>PERIOD</TableColumn>
              <TableColumn>TOTAL SALES</TableColumn>
              <TableColumn>OUTPUT GST</TableColumn>
              <TableColumn>INPUT GST</TableColumn>
              <TableColumn>NET GST</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DUE DATE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {gstReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.period}</TableCell>
                  <TableCell>₹{report.totalSales.toLocaleString()}</TableCell>
                  <TableCell>₹{report.outputGST.toLocaleString()}</TableCell>
                  <TableCell>₹{report.inputGST.toLocaleString()}</TableCell>
                  <TableCell className="font-bold">₹{report.netGST.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(report.status)} variant="flat" size="sm">
                      {report.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>{report.dueDate.toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="flat">View</Button>
                      <Button size="sm" variant="flat" color="primary">File</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};
