import React from "react";
import { Card, CardBody, CardHeader, Tabs, Tab, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface GSTReportItem {
  invoiceNumber: string;
  date: string;
  customer: string;
  amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  hsn: string;
}

export const GSTReports: React.FC = () => {
  const [reportType, setReportType] = React.useState("gstr1");
  const [period, setPeriod] = React.useState("current");
  
  // Sample GST report data
  const gstReportData: GSTReportItem[] = [
    {
      invoiceNumber: "INV-001",
      date: "2024-05-01",
      customer: "Raj Kumar",
      amount: 520.50,
      cgst: 46.85,
      sgst: 46.85,
      igst: 0,
      hsn: "2501"
    },
    {
      invoiceNumber: "INV-002",
      date: "2024-05-01",
      customer: "Priya Sharma",
      amount: 1250.75,
      cgst: 112.57,
      sgst: 112.57,
      igst: 0,
      hsn: "1101"
    },
    {
      invoiceNumber: "INV-003",
      date: "2024-05-02",
      customer: "Guest",
      amount: 75.00,
      cgst: 6.75,
      sgst: 6.75,
      igst: 0,
      hsn: "1905"
    },
    {
      invoiceNumber: "INV-004",
      date: "2024-05-02",
      customer: "Amit Patel",
      amount: 2100.25,
      cgst: 189.02,
      sgst: 189.02,
      igst: 0,
      hsn: "3306"
    },
    {
      invoiceNumber: "INV-005",
      date: "2024-05-03",
      customer: "Neha Singh",
      amount: 450.00,
      cgst: 40.50,
      sgst: 40.50,
      igst: 0,
      hsn: "0405"
    }
  ];
  
  // Calculate totals
  const totalAmount = gstReportData.reduce((sum, item) => sum + item.amount, 0);
  const totalCGST = gstReportData.reduce((sum, item) => sum + item.cgst, 0);
  const totalSGST = gstReportData.reduce((sum, item) => sum + item.sgst, 0);
  const totalIGST = gstReportData.reduce((sum, item) => sum + item.igst, 0);
  const totalTax = totalCGST + totalSGST + totalIGST;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select 
              label="Report Type" 
              placeholder="Select report type"
              selectedKeys={[reportType]}
              onSelectionChange={(keys) => setReportType(Array.from(keys)[0] as string)}
            >
              <SelectItem key="gstr1" value="gstr1">GSTR-1 (Outward Supplies)</SelectItem>
              <SelectItem key="gstr3b" value="gstr3b">GSTR-3B (Summary Return)</SelectItem>
              <SelectItem key="gstr9" value="gstr9">GSTR-9 (Annual Return)</SelectItem>
            </Select>
            
            <Select 
              label="Period" 
              placeholder="Select period"
              selectedKeys={[period]}
              onSelectionChange={(keys) => setPeriod(Array.from(keys)[0] as string)}
            >
              <SelectItem key="current" value="current">Current Month (May 2024)</SelectItem>
              <SelectItem key="previous" value="previous">Previous Month (April 2024)</SelectItem>
              <SelectItem key="custom" value="custom">Custom Period</SelectItem>
            </Select>
            
            <div className="flex items-end gap-2">
              <Button 
                color="primary"
                className="flex-1"
                startContent={<Icon icon="lucide:file-text" />}
              >
                Generate Report
              </Button>
              
              <Button 
                variant="flat"
                startContent={<Icon icon="lucide:download" />}
              >
                Export
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-4">
            <p className="text-default-500 text-small">Total Sales</p>
            <p className="text-2xl font-semibold">₹{totalAmount.toFixed(2)}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-4">
            <p className="text-default-500 text-small">CGST Collected</p>
            <p className="text-2xl font-semibold">₹{totalCGST.toFixed(2)}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-4">
            <p className="text-default-500 text-small">SGST Collected</p>
            <p className="text-2xl font-semibold">₹{totalSGST.toFixed(2)}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-4">
            <p className="text-default-500 text-small">Total Tax</p>
            <p className="text-2xl font-semibold">₹{totalTax.toFixed(2)}</p>
          </CardBody>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">GST Transaction Details</h3>
        </CardHeader>
        <CardBody>
          <Table 
            removeWrapper 
            aria-label="GST transactions"
          >
            <TableHeader>
              <TableColumn>INVOICE</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>HSN</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>CGST</TableColumn>
              <TableColumn>SGST</TableColumn>
              <TableColumn>IGST</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No transactions found">
              {gstReportData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.invoiceNumber}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>{item.hsn}</TableCell>
                  <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                  <TableCell>₹{item.cgst.toFixed(2)}</TableCell>
                  <TableCell>₹{item.sgst.toFixed(2)}</TableCell>
                  <TableCell>₹{item.igst.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-content2">
                <TableCell colSpan={4} className="text-right font-medium">Total</TableCell>
                <TableCell className="font-medium">₹{totalAmount.toFixed(2)}</TableCell>
                <TableCell className="font-medium">₹{totalCGST.toFixed(2)}</TableCell>
                <TableCell className="font-medium">₹{totalSGST.toFixed(2)}</TableCell>
                <TableCell className="font-medium">₹{totalIGST.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      
      <div className="flex justify-end gap-4">
        <Button 
          variant="flat" 
          color="default"
          startContent={<Icon icon="lucide:printer" />}
        >
          Print Report
        </Button>
        
        <Button 
          color="primary"
          startContent={<Icon icon="lucide:file-json" />}
        >
          Generate JSON for Filing
        </Button>
      </div>
    </div>
  );
};