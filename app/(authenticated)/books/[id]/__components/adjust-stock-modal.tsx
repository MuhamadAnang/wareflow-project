"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import { useState } from "react";
import { useAdjustStockMutation } from "../__hooks/use-adjust-stock.mutation";

interface Props {
  bookId: number;
  open: boolean;
  onClose: () => void;
}

export function AdjustStockModal({ bookId, open, onClose }: Props) {
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState("");
  const { mutateAsync, isPending } = useAdjustStockMutation();

  const handleSubmit = async () => {
    if (quantity === 0) return;

    await mutateAsync({ bookId, quantity, note });
    onClose();
    setQuantity(0);
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjustment Stok Manual</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Jumlah Penyesuaian</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="+10 atau -5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Positif = tambah stok, Negatif = kurangi stok
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Catatan</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Barang rusak, koreksi inventory, dll"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || quantity === 0} className="flex-1">
              {isPending ? "Menyimpan..." : "Simpan Adjustment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}