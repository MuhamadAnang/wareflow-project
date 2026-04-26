"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ListChecks } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { PriorityPreviewItem } from "../__hooks/use-get-dashboard-stats.query";
import Link from "next/link";

interface PriorityPreviewProps {
  priorities: PriorityPreviewItem[];
  isLoading: boolean;
}

export const PriorityPreview = ({ priorities, isLoading }: PriorityPreviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prioritas Distribusi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
        </CardContent>
      </Card>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    return "bg-amber-600";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          Prioritas Distribusi
        </CardTitle>
      </CardHeader>
      <CardContent>
        {priorities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Tidak ada order yang membutuhkan prioritas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {priorities.map((priority) => (
              <div key={priority.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getRankColor(priority.rank)}`}>
                    {priority.rank}
                  </div>
                  <div>
                    <Link href={`/customer-orders/${priority.id}`} className="font-medium hover:underline">
                      {priority.customerName}
                    </Link>
                    <p className="text-xs text-muted-foreground">Order #{priority.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500">Skor {(priority.score * 100).toFixed(1)}%</Badge>
                </div>
              </div>
            ))}
            {priorities.length > 0 && (
              <div className="pt-2 text-right">
                <Link href="/priority-distribution" className="text-xs text-primary hover:underline">
                  Lihat semua prioritas →
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};  