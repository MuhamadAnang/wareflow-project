"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import { Progress } from "@/app/_components/ui/progress";
import { PriorityResult } from "../__hooks/use-get-priority.query";
import Link from "next/link";
import { Calendar } from "@/app/_components/ui/calendar";
import { Trophy } from "lucide-react";

interface PriorityTableProps {
  priorities: PriorityResult[];
  isLoading: boolean;
}

export const PriorityTable = ({ priorities, isLoading }: PriorityTableProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Memuat data prioritas...</div>;
  }

  if (priorities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Tidak ada order yang membutuhkan prioritas. 
        Semua order sudah terkirim atau masih dalam status DRAFT.
      </div>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-amber-600";
    return "bg-blue-500";
  };

  const getStatusBadge = (value: number, type: 'benefit' | 'cost') => {
    if (type === 'benefit') {
      if (value >= 80) return <Badge className="bg-green-500">Baik</Badge>;
      if (value >= 50) return <Badge className="bg-yellow-500">Sedang</Badge>;
      return <Badge className="bg-red-500">Kurang</Badge>;
    } else {
      if (value <= 7) return <Badge className="bg-green-500">Rendah</Badge>;
      if (value <= 30) return <Badge className="bg-yellow-500">Sedang</Badge>;
      return <Badge className="bg-red-500">Tinggi</Badge>;
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Stok Tersedia (C1)</TableHead>
          <TableHead>Urgensi (C2)</TableHead>
          <TableHead>Status Kontrak (C3)</TableHead>
          <TableHead>Riwayat Retur (C4)</TableHead>
          <TableHead>Skor</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {priorities.map((item) => (
          <TableRow key={item.id} className={item.rank === 1 ? "bg-yellow-50" : ""}>
            <TableCell>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(item.rank)}`}>
                {item.rank}
              </div>
            </TableCell>
            <TableCell className="font-medium">
              <div>{item.customerName}</div>
              {item.deadline && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  Deadline: {formatDate(item.deadline)}
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="space-y-1 min-w-[120px]">
                <div className="flex justify-between text-xs">
                  <span>{item.criteria.stockFulfillment.toFixed(1)}%</span>
                  {getStatusBadge(item.criteria.stockFulfillment, 'benefit')}
                </div>
                <Progress value={item.criteria.stockFulfillment} className="h-2" />
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.criteria.urgency.toFixed(1)}%</span>
                  {item.criteria.urgency >= 80 ? (
                    <Badge variant="destructive" className="text-xs">Sangat Mendesak</Badge>
                  ) : item.criteria.urgency >= 50 ? (
                    <Badge variant="default" className="text-xs">Mendesak</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Normal</Badge>
                  )}
                </div>
                <Progress value={item.criteria.urgency} className="h-2" />
              </div>
            </TableCell>
            <TableCell>
              {item.criteria.contractStatus === 5 ? (
                <Badge className="bg-green-500">Kontrak (5)</Badge>
              ) : item.criteria.contractStatus === 3 ? (
                <Badge className="bg-blue-500">Langganan (3)</Badge>
              ) : (
                <Badge variant="outline">Reguler (1)</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{item.criteria.returnRate.toFixed(1)}%</span>
                  {getStatusBadge(item.criteria.returnRate, 'cost')}
                </div>
                <Progress value={Math.min(100, item.criteria.returnRate)} className="h-2" />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{(item.score * 100).toFixed(1)}%</span>
                {item.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Link href={`/customer-orders/${item.id}`} className="text-primary hover:underline text-sm">
                Lihat Detail →
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};