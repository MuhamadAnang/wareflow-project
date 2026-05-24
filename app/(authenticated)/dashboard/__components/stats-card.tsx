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
  iconColor = "text-muted-foreground",
}: StatsCardProps) => {
  // Format currency if value is number and title contains "Nilai"
  const formattedValue =
    typeof value === "number" && title.toLowerCase().includes("nilai")
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value)
      : value;

  return (
    <Card className="h-32">
      <CardContent className="p-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{formattedValue}</p>

            {description && <p className="text-xs text-muted-foreground">{description}</p>}

            {trend && (
              <p className={`text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% dari bulan lalu
              </p>
            )}
          </div>

          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
};
