import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
  showValues?: boolean;
  formatValue?: (value: number) => string;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  title,
  height = 300,
  showValues = true,
  formatValue = (value) => value.toString(),
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <Card className="w-full">
      {title && (
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
      )}
      <CardBody>
        <div className="space-y-4" style={{ height }}>
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const color = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
            
            return (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.name}</span>
                  {showValues && (
                    <span className="text-sm text-default-600">
                      {formatValue(item.value)}
                    </span>
                  )}
                </div>
                <div className="w-full bg-default-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

interface SimpleLineChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
  color?: string;
  formatValue?: (value: number) => string;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  title,
  height = 300,
  color = '#0070f3',
  formatValue = (value) => value.toString(),
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;
  
  return (
    <Card className="w-full">
      {title && (
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
      )}
      <CardBody>
        <div className="relative" style={{ height }}>
          {/* Chart area */}
          <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
            {data.map((item, index) => {
              const heightPercentage = range > 0 ? ((item.value - minValue) / range) * 80 : 50;
              
              return (
                <div
                  key={item.name}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / data.length}%` }}
                >
                  {/* Data point */}
                  <div
                    className="w-3 h-3 rounded-full border-2 border-white shadow-md transition-all duration-300 hover:scale-125"
                    style={{
                      backgroundColor: color,
                      marginBottom: `${heightPercentage}%`,
                    }}
                    title={`${item.name}: ${formatValue(item.value)}`}
                  />
                  
                  {/* Label */}
                  <div className="text-xs text-center mt-2">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-default-500">{formatValue(item.value)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="border-t border-default-200 opacity-50"
              />
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

interface SimplePieChartProps {
  data: ChartData[];
  title?: string;
  size?: number;
  showLabels?: boolean;
  formatValue?: (value: number) => string;
}

export const SimplePieChart: React.FC<SimplePieChartProps> = ({
  data,
  title,
  size = 200,
  showLabels = true,
  formatValue = (value) => value.toString(),
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    const color = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
    
    return {
      ...item,
      percentage,
      angle,
      startAngle,
      color,
    };
  });
  
  return (
    <Card className="w-full">
      {title && (
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
      )}
      <CardBody>
        <div className="flex items-center justify-center space-x-8">
          {/* Pie chart */}
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
              {segments.map((segment, index) => {
                const radius = size / 2 - 10;
                const centerX = size / 2;
                const centerY = size / 2;
                
                const startAngleRad = (segment.startAngle * Math.PI) / 180;
                const endAngleRad = ((segment.startAngle + segment.angle) * Math.PI) / 180;
                
                const x1 = centerX + radius * Math.cos(startAngleRad);
                const y1 = centerY + radius * Math.sin(startAngleRad);
                const x2 = centerX + radius * Math.cos(endAngleRad);
                const y2 = centerY + radius * Math.sin(endAngleRad);
                
                const largeArcFlag = segment.angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M ${centerX} ${centerY}`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-opacity duration-300 hover:opacity-80"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Legend */}
          {showLabels && (
            <div className="space-y-2">
              {segments.map((segment, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm">
                    {segment.name}: {formatValue(segment.value)} ({segment.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

// Export all simple chart components
export const SimpleCharts = {
  BarChart: SimpleBarChart,
  LineChart: SimpleLineChart,
  PieChart: SimplePieChart,
};
