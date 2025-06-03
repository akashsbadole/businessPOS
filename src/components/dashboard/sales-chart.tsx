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
import { ChartErrorBoundary } from "../common/chart-error-boundary";
import { SimpleBarChart } from "../charts/simple-charts";

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

  // Use simple charts to avoid Recharts warnings
  const useSimpleCharts = true;

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

  // Convert data for simple chart
  const simpleChartData = data.map((item) => ({
    name: item.date,
    value: item.sales,
    color: "#0070f3",
  }));

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
        {data && data.length > 0 ? (
          useSimpleCharts ? (
            <div className="h-[300px]">
              <SimpleBarChart
                data={simpleChartData}
                height={280}
                formatValue={formatValue}
                showValues={true}
              />
            </div>
          ) : (
            <ChartErrorBoundary>
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
                    xAxisId={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "var(--heroui-default-500)" }}
                    tickFormatter={formatValue}
                    type="number"
                    yAxisId={0}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `₹${value.toFixed(2)}`,
                      "Sales",
                    ]}
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
                    xAxisId={0}
                    yAxisId={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartErrorBoundary>
          )
        ) : (
          <div className="flex items-center justify-center h-[300px] text-default-500">
            <div className="text-center">
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm">
                Sales data will appear here when available
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
