import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: string;
  iconColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  iconColor
}) => {
  return (
    <Card>
      <CardBody className="flex gap-4">
        <div className={`p-3 rounded-lg bg-${iconColor}-100 text-${iconColor}-500`}>
          <Icon icon={icon} className="text-2xl" />
        </div>
        <div className="flex-grow">
          <p className="text-default-500 text-small">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              <Icon 
                icon={change.isPositive ? "lucide:trending-up" : "lucide:trending-down"} 
                className={`text-${change.isPositive ? "success" : "danger"}-500 text-sm`} 
              />
              <span className={`text-${change.isPositive ? "success" : "danger"}-500 text-tiny`}>
                {change.isPositive ? "+" : ""}{change.value}%
              </span>
              <span className="text-tiny text-default-400">vs last period</span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};