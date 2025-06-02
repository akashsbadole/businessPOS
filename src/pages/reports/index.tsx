import React from "react";
import { Card, CardBody, CardHeader, Tabs, Tab } from "@heroui/react";
import { SalesChart } from "../../components/dashboard/sales-chart";
import { StatsCard } from "../../components/dashboard/stats-card";
import { RecentTransactions } from "../../components/dashboard/recent-transactions";
import { InventoryStatus } from "../../components/dashboard/inventory-status";
import { sampleProducts, sampleTransactions } from "../../data/sample-data";
import { sampleSalesData } from "../../data/chart-data";
import { GSTReports } from "./gst-reports";

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
      </div>

      <Tabs 
        selectedKey={activeTab} 
        onSelectionChange={setActiveTab as any}
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-2 h-12",
          tabContent: "group-data-[selected=true]:text-primary font-medium"
        }}
      >
        <Tab 
          key="overview" 
          title={
            <div className="flex items-center gap-2">
              <span>Overview</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard 
              title="Today's Sales" 
              value="₹24,500" 
              change={{ value: 12, isPositive: true }}
              icon="lucide:shopping-bag"
              iconColor="primary"
            />
            <StatsCard 
              title="Total Orders" 
              value="156" 
              change={{ value: 8, isPositive: true }}
              icon="lucide:shopping-cart"
              iconColor="success"
            />
            <StatsCard 
              title="Average Order Value" 
              value="₹1,250" 
              change={{ value: 3, isPositive: true }}
              icon="lucide:indian-rupee"
              iconColor="warning"
            />
            <StatsCard 
              title="Low Stock Items" 
              value="12" 
              change={{ value: 2, isPositive: false }}
              icon="lucide:alert-triangle"
              iconColor="danger"
            />
          </div>

          <div className="mb-6">
            <SalesChart 
              dailyData={sampleSalesData.daily}
              weeklyData={sampleSalesData.weekly}
              monthlyData={sampleSalesData.monthly}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactions transactions={sampleTransactions.slice(0, 5)} />
            <InventoryStatus products={sampleProducts} />
          </div>
        </Tab>
        <Tab 
          key="sales" 
          title={
            <div className="flex items-center gap-2">
              <span>Sales Reports</span>
            </div>
          }
        >
          <div className="h-64 flex items-center justify-center">
            <p className="text-default-500">Sales reports content will be displayed here</p>
          </div>
        </Tab>
        <Tab 
          key="inventory" 
          title={
            <div className="flex items-center gap-2">
              <span>Inventory Reports</span>
            </div>
          }
        >
          <div className="h-64 flex items-center justify-center">
            <p className="text-default-500">Inventory reports content will be displayed here</p>
          </div>
        </Tab>
        <Tab 
          key="gst" 
          title={
            <div className="flex items-center gap-2">
              <span>GST Reports</span>
            </div>
          }
        >
          <GSTReports />
        </Tab>
      </Tabs>
    </div>
  );
};