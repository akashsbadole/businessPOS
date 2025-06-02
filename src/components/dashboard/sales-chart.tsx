import React from "react";
import { Card, CardBody, CardHeader, Tabs, Tab } from "@heroui/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "../charts/chart-components";

interface SalesData {
  date: string;
  sales: number;
}

interface SalesChartProps {
  dailyData: SalesData[];
  weeklyData: SalesData[];
  monthlyData: SalesData[];
}

export const SalesChart: React.FC<SalesChartProps> = ({
  dailyData,
  weeklyData,
  monthlyData,
}) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState("daily");

  const data = React.useMemo(() => {
    switch (selectedPeriod) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  }, [selectedPeriod, dailyData, weeklyData, monthlyData]);

  const formatValue = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Sales Overview</h3>
        <Tabs
          selectedKey={selectedPeriod}
          onSelectionChange={setSelectedPeriod as any}
          size="sm"
          color="primary"
          variant="light"
          radius="full"
        >
          <Tab key="daily" title="Daily" />
          <Tab key="weekly" title="Weekly" />
          <Tab key="monthly" title="Monthly" />
        </Tabs>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--heroui-default-200)"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--heroui-default-500)" }}
              type="category"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--heroui-default-500)" }}
              tickFormatter={formatValue}
              type="number"
            />
            <Tooltip
              formatter={(value: number) => [`₹${value.toFixed(2)}`, "Sales"]}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: "var(--heroui-content1)",
                borderColor: "var(--heroui-default-200)",
                borderRadius: "8px",
                boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
              }}
            />
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--heroui-primary-500)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--heroui-primary-500)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="sales"
              stroke="var(--heroui-primary-500)"
              strokeWidth={2}
              fill="url(#colorSales)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};
