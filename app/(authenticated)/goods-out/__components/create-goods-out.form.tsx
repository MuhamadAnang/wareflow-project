"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Label } from "@/app/_components/ui/label";
import { Card, CardContent } from "@/app/_components/ui/card";
import { TCreateGoodsOut } from "@/schemas/goods-out.schema";
import { useGetAvailableOrdersQuery } from "../__hooks/use-get-available-orders.query";
import { useGetOrderItemsForShipment } from "../__hooks/use-get-order-items-for-shipment.query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Truck } from "lucide-react";

interface Props {
  onSubmit: (data: TCreateGoodsOut) => Promise<void>;
  isPending: boolean;
}

interface ShipmentItem {
  bookId: number;
  bookCode: string;
  bookName: string;
  orderedQuantity: number;
  shippedQuantity: number;
  toShip: number;
}

export const CreateGoodsOutForm = ({ onSubmit, isPending }: Props) => {
  const { data: ordersData } = useGetAvailableOrdersQuery();

  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(undefined);
  const { data: orderDetail, isLoading: loadingOrder } = useGetOrderItemsForShipment(
    selectedOrderId ?? 0,
  );

  const [shippedDate, setShippedDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [items, setItems] = useState<ShipmentItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (orderDetail?.data) {
      const order = orderDetail.data;
      
      // Validasi: pastikan order.items ada dan merupakan array
      if (!order.items || !Array.isArray(order.items)) {
        console.warn("Order items is not an array:", order.items);
        setItems([]);
        return;
      }
      
      // Struktur baru: bookCode dan bookName sudah langsung di item
      const mappedItems: ShipmentItem[] = order.items.map((item) => ({
        bookId: item.bookId,
        bookCode: item.bookCode || "Unknown Code",
        bookName: item.bookName || "Unknown Title",
        orderedQuantity: item.quantity,
        shippedQuantity: (item as any).shippedQuantity || 0,
        toShip: (item as any).remainingQuantity || item.quantity,
      }));
      
      setItems(mappedItems);
    }
  }, [orderDetail]);

  const handleOrderChange = (orderId: string) => {
    setSelectedOrderId(parseInt(orderId));
    setItems([]);
  };

  const updateToShip = (bookId: number, value: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.bookId === bookId ? { ...item, toShip: value } : item,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrderId) {
      toast.error("Pilih customer order terlebih dahulu");
      return;
    }

    const itemsToShip = items.filter((item) => item.toShip > 0);
    if (itemsToShip.length === 0) {
      toast.error("Minimal satu item harus dikirim");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        customerOrderId: selectedOrderId,
        shippedDate: new Date(shippedDate),
        note: note || null,
        items: itemsToShip.map((item) => ({
          bookId: item.bookId,
          quantity: item.toShip,
        })),
      });
      // Reset form
      setSelectedOrderId(undefined);
      setItems([]);
      setNote("");
      setShippedDate(new Date().toISOString().split("T")[0]);
      toast.success("Pengiriman berhasil dibuat");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Gagal membuat pengiriman");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Pilih Order */}
        <div>
          <Label>Customer Order *</Label>
          <Select
            onValueChange={handleOrderChange}
            value={selectedOrderId?.toString() ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih order yang akan dikirim" />
            </SelectTrigger>
            <SelectContent>
              {ordersData?.data?.map((order) => (
                <SelectItem key={order.id} value={order.id.toString()}>
                  Order #{order.id} - {order.customerName} (
                  {new Date(order.orderDate).toLocaleDateString("id-ID")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tanggal Kirim */}
        <div>
          <Label>Tanggal Kirim *</Label>
          <Input
            type="date"
            value={shippedDate}
            onChange={(e) => setShippedDate(e.target.value)}
          />
        </div>

        {/* Catatan */}
        <div>
          <Label>Catatan</Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan pengiriman (contoh: di terima oleh Mas Abid dengan lengkap)"
          />
        </div>

        {/* Items */}
        {selectedOrderId && (
          <div>
            <Label className="mb-3 block">Items yang Dikirim *</Label>
            {loadingOrder ? (
              <div className="text-center py-8">Loading items...</div>
            ) : (
              <div className="space-y-3">
                {items.length > 0 ? (
                  items.map((item) => (
                    <Card key={item.bookId}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{item.bookCode}</p>
                            <p className="text-sm text-muted-foreground">{item.bookName}</p>
                            <p className="text-sm mt-1">
                              Pesanan: {item.orderedQuantity} | Sudah dikirim:{" "}
                              {item.shippedQuantity} | Sisa:{" "}
                              {item.orderedQuantity - item.shippedQuantity}
                            </p>
                          </div>
                          <div className="w-32">
                            <Label className="text-sm">Jumlah Kirim</Label>
                            <Input
                              type="number"
                              min={0}
                              max={item.orderedQuantity - item.shippedQuantity}
                              value={item.toShip}
                              onChange={(e) =>
                                updateToShip(item.bookId, parseInt(e.target.value) || 0)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8 border rounded-md">
                    Tidak ada item dalam order ini
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <Button type="submit" isLoading={submitting || isPending} className="w-full">
          <Truck className="h-4 w-4 mr-2" />
          Proses Pengiriman
        </Button>
      </div>
    </form>
  );
};