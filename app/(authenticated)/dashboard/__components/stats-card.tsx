"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  iconColor = "text-muted-foreground" 
}: StatsCardProps) => {
  // Format currency if value is number and title contains "Nilai"
  const formattedValue = typeof value === "number" && title.toLowerCase().includes("nilai")
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value)
    : value;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{formattedValue}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <p className={`text-xs mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% dari bulan lalu
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
};