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
import { TCreateSupplierReturn } from "@/schemas/supplier-return.schema";
import { useGetReturnableSuppliersQuery } from "../__hooks/use-get-returnable-suppliers.query";
import { useGetReturnableBooksSupplierQuery } from "../__hooks/use-get-returnable-books-supplier.query";
import { useState } from "react";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";

interface Props {
  onSubmit: (data: TCreateSupplierReturn) => Promise<void>;
  isPending: boolean;
}

interface ReturnItem {
  bookId: number;
  bookCode: string;
  bookName: string;
  currentStock: number;
  quantity: number;
}

export const CreateSupplierReturnForm = ({ onSubmit, isPending }: Props) => {
  const { data: suppliersData } = useGetReturnableSuppliersQuery();
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | undefined>(undefined);
  const { data: booksData } = useGetReturnableBooksSupplierQuery();
  
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    setItems([...items, { bookId: 0, bookCode: "", bookName: "", currentStock: 0, quantity: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItemBook = (index: number, bookId: number) => {
    const book = booksData?.data?.find((b) => b.id === bookId);
    if (book) {
      const newItems = [...items];
      newItems[index] = {
        bookId: book.id,
        bookCode: book.code,
        bookName: book.displayTitle || book.name,
        currentStock: book.currentStock,
        quantity: 0,
      };
      setItems(newItems);
    }
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    const newItems = [...items];
    const maxStock = newItems[index].currentStock;
    if (quantity > maxStock) {
      toast.error(`Quantity tidak boleh melebihi stok (${maxStock})`);
      return;
    }
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSupplierId) {
      toast.error("Pilih supplier terlebih dahulu");
      return;
    }

    const validItems = items.filter((item) => item.bookId > 0 && item.quantity > 0);
    if (validItems.length === 0) {
      toast.error("Minimal satu item dengan quantity > 0 harus ditambahkan");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        supplierId: selectedSupplierId,
        returnDate: new Date(returnDate),
        reason: reason || null,
        items: validItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
      });
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Pilih Supplier */}
        <div>
          <Label>Supplier *</Label>
          <Select
            onValueChange={(val) => setSelectedSupplierId(parseInt(val))}
            value={selectedSupplierId?.toString() ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliersData?.data.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tanggal Retur */}
        <div>
          <Label>Tanggal Retur *</Label>
          <Input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>

        {/* Alasan */}
        <div>
          <Label>Alasan Retur</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Rusak, Tidak laku, Salah kirim"
            rows={3}
          />
        </div>

        {/* Items */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <Label className="text-base font-semibold">Items yang Diretur *</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              + Tambah Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label className="text-sm">Buku</Label>
                        <Select
                          onValueChange={(val) => updateItemBook(idx, parseInt(val))}
                          value={item.bookId?.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih buku" />
                          </SelectTrigger>
                          <SelectContent>
                            {booksData?.data.map((book) => (
                              <SelectItem key={book.id} value={book.id.toString()}>
                                {book.code} - {book.displayTitle || book.name} (Stok: {book.currentStock})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm">Quantity Retur</Label>
                        <Input
                          type="number"
                          min={0}
                          max={item.currentStock}
                          value={item.quantity || ""}
                          onChange={(e) => updateItemQuantity(idx, parseInt(e.target.value) || 0)}
                          placeholder="Jumlah yang diretur ke supplier"
                        />
                        {item.currentStock > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Stok tersedia: {item.currentStock}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(idx)}
                      className="text-red-500"
                    >
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {items.length === 0 && (
              <div className="text-center text-muted-foreground py-8 border rounded-md">
                Belum ada item. Klik Tambah Item untuk menambahkan buku yang diretur ke supplier.
              </div>
            )}
          </div>
        </div>

        <Button type="submit" isLoading={submitting || isPending} className="w-full">
          <Undo2 className="h-4 w-4 mr-2" />
          Buat Retur Supplier
        </Button>
      </div>
    </form>
  );
};