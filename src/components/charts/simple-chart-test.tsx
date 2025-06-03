import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const testData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

export const SimpleChartTest: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <h3>Simple Chart Test</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={testData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" xAxisId={0} />
          <YAxis yAxisId={0} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            xAxisId={0}
            yAxisId={0}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
