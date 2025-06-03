import React from "react";
import {
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
} from "recharts";

// Enhanced XAxis with explicit props to avoid defaultProps warnings
export const XAxis: React.FC<any> = ({
  axisLine = true,
  tickLine = true,
  type = "category",
  xAxisId = 0,
  ...props
}) => (
  <RechartsXAxis
    axisLine={axisLine}
    tickLine={tickLine}
    type={type}
    xAxisId={xAxisId}
    {...props}
  />
);

// Enhanced YAxis with explicit props to avoid defaultProps warnings
export const YAxis: React.FC<any> = ({
  axisLine = true,
  tickLine = true,
  type = "number",
  yAxisId = 0,
  ...props
}) => (
  <RechartsYAxis
    axisLine={axisLine}
    tickLine={tickLine}
    type={type}
    yAxisId={yAxisId}
    {...props}
  />
);

// Enhanced CartesianGrid with explicit props
export const CartesianGrid: React.FC<any> = ({
  horizontal = true,
  vertical = true,
  ...props
}) => (
  <RechartsCartesianGrid
    horizontal={horizontal}
    vertical={vertical}
    {...props}
  />
);

// Enhanced Tooltip with explicit props
export const Tooltip: React.FC<any> = ({
  active = false,
  allowEscapeViewBox = { x: false, y: false },
  animationDuration = 400,
  animationEasing = "ease",
  cursor = true,
  filterNull = true,
  isAnimationActive = true,
  offset = 10,
  separator = ": ",
  trigger = "hover",
  useTranslate3d = false,
  viewBox = { x: 0, y: 0, width: 0, height: 0 },
  wrapperStyle = {},
  ...props
}) => (
  <RechartsTooltip
    active={active}
    allowEscapeViewBox={allowEscapeViewBox}
    animationDuration={animationDuration}
    animationEasing={animationEasing}
    cursor={cursor}
    filterNull={filterNull}
    isAnimationActive={isAnimationActive}
    offset={offset}
    separator={separator}
    trigger={trigger}
    useTranslate3d={useTranslate3d}
    viewBox={viewBox}
    wrapperStyle={wrapperStyle}
    {...props}
  />
);

// Enhanced ResponsiveContainer with explicit props
export const ResponsiveContainer: React.FC<any> = (props) => (
  <RechartsResponsiveContainer
    aspect={undefined}
    debounce={0}
    minHeight={0}
    minWidth={0}
    {...props}
  />
);

// Enhanced LineChart with explicit props
export const LineChart: React.FC<any> = (props) => {
  // Ensure we have data before rendering
  if (!props.data || props.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No data available
      </div>
    );
  }

  return (
    <RechartsLineChart
      margin={{ top: 5, right: 30, bottom: 5, left: 20 }}
      {...props}
    />
  );
};

// Enhanced Line with explicit props
export const Line: React.FC<any> = ({
  activeDot = true,
  connectNulls = false,
  dot = true,
  hide = false,
  isAnimationActive = true,
  legendType = "line",
  strokeDasharray = "none",
  strokeLinecap = "butt",
  strokeLinejoin = "miter",
  strokeWidth = 1,
  type = "linear",
  xAxisId = 0,
  yAxisId = 0,
  ...props
}) => (
  <RechartsLine
    activeDot={activeDot}
    connectNulls={connectNulls}
    dot={dot}
    hide={hide}
    isAnimationActive={isAnimationActive}
    legendType={legendType}
    strokeDasharray={strokeDasharray}
    strokeLinecap={strokeLinecap}
    strokeLinejoin={strokeLinejoin}
    strokeWidth={strokeWidth}
    type={type}
    xAxisId={xAxisId}
    yAxisId={yAxisId}
    {...props}
  />
);

// Enhanced AreaChart with explicit props
export const AreaChart: React.FC<any> = (props) => {
  // Ensure we have data before rendering
  if (!props.data || props.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No data available
      </div>
    );
  }

  return (
    <RechartsAreaChart
      margin={{ top: 5, right: 30, bottom: 5, left: 20 }}
      {...props}
    />
  );
};

// Enhanced Area with explicit props
export const Area: React.FC<any> = ({
  activeDot = true,
  connectNulls = false,
  dot = false,
  hide = false,
  isAnimationActive = true,
  legendType = "rect",
  stackId = undefined,
  strokeWidth = 1,
  type = "linear",
  xAxisId = 0,
  yAxisId = 0,
  ...props
}) => (
  <RechartsArea
    activeDot={activeDot}
    connectNulls={connectNulls}
    dot={dot}
    hide={hide}
    isAnimationActive={isAnimationActive}
    legendType={legendType}
    stackId={stackId}
    strokeWidth={strokeWidth}
    type={type}
    xAxisId={xAxisId}
    yAxisId={yAxisId}
    {...props}
  />
);

// Enhanced BarChart with explicit props
export const BarChart: React.FC<any> = (props) => (
  <RechartsBarChart
    barCategoryGap="10%"
    barGap={4}
    layout="horizontal"
    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
    maxBarSize={undefined}
    reverseStackOrder={false}
    stackOffset="none"
    syncId={undefined}
    syncMethod="index"
    {...props}
  />
);

// Enhanced Bar with explicit props
export const Bar: React.FC<any> = (props) => (
  <RechartsBar
    background={false}
    hide={false}
    isAnimationActive={true}
    legendType="rect"
    maxBarSize={undefined}
    minPointSize={0}
    radius={0}
    stackId={undefined}
    {...props}
  />
);

// Enhanced PieChart with explicit props
export const PieChart: React.FC<any> = (props) => {
  // Check if we have valid data
  const hasValidData =
    props.children && React.Children.count(props.children) > 0;

  if (!hasValidData) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No data available
      </div>
    );
  }

  return (
    <RechartsPieChart
      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      {...props}
    />
  );
};

// Enhanced Pie with explicit props
export const Pie: React.FC<any> = (props) => (
  <RechartsPie
    animationBegin={0}
    animationDuration={1500}
    animationEasing="ease"
    blendStroke={false}
    cornerRadius={0}
    cx="50%"
    cy="50%"
    endAngle={90}
    fill="#8884d8"
    hide={false}
    innerRadius={0}
    isAnimationActive={true}
    labelLine={true}
    legendType="rect"
    minAngle={0}
    outerRadius="80%"
    paddingAngle={0}
    startAngle={0}
    stroke="#fff"
    strokeWidth={1}
    {...props}
  />
);

// Enhanced Cell with explicit props
export const Cell: React.FC<any> = (props) => <RechartsCell {...props} />;

// Export all components
export {
  RechartsResponsiveContainer,
  RechartsLineChart,
  RechartsLine,
  RechartsAreaChart,
  RechartsArea,
  RechartsBarChart,
  RechartsBar,
  RechartsPieChart,
  RechartsPie,
  RechartsCell,
  RechartsXAxis,
  RechartsYAxis,
  RechartsCartesianGrid,
  RechartsTooltip,
};
