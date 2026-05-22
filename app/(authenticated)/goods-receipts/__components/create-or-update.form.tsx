"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import type { TPurchaseOrderDetail, TPurchaseOrderWithSupplier } from "@/types/database";
import type { useGoodsReceiptCreateForm } from "../__hooks/use-goods-receipt-create-form";

type CreateOrUpdateGoodsReceiptFormProps = {
  form: ReturnType<typeof useGoodsReceiptCreateForm>;
  isPending: boolean;
  purchaseOrders: Pick<TPurchaseOrderWithSupplier, "id" | "supplierName">[];
  poDetail?: Pick<TPurchaseOrderDetail, "items"> | null;
  onPoChange?: (poId: number) => void;
};

export function CreateOrUpdateGoodsReceiptForm({
  form,
  isPending,
  purchaseOrders,
  poDetail,
  onPoChange,
}: CreateOrUpdateGoodsReceiptFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="space-y-6">
        <form.Field name="purchaseOrderId">
          {(field) => (
            <div>
              <Label>
                Purchase Order <span className="text-red-500">*</span>
              </Label>
              <Select
                value={field.state.value?.toString() || ""}
                onValueChange={(value) => {
                  const poId = Number(value);
                  field.handleChange(poId);
                  onPoChange?.(poId);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Purchase Order" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders.map((po) => (
                    <SelectItem key={po.id} value={po.id.toString()}>
                      PO #{po.id} - Supplier: {po.supplierName || "-"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <form.Field name="receivedDate">
          {(field) => (
            <div>
              <Label>
                Tanggal Terima <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="note">
          {(field) => (
            <div>
              <Label>Catatan</Label>
              <Textarea
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Catatan tambahan (opsional)"
                rows={3}
              />
            </div>
          )}
        </form.Field>

        <div>
          <Label className="mb-3 block">Items yang akan diterima</Label>
          {poDetail?.items?.length ? (
            <div className="border rounded-md divide-y bg-gray-50 p-4">
              {poDetail.items.map((item, index) => (
                <div key={`${item.bookId}-${index}`} className="py-3 flex justify-between items-center">
                  <div>
                    Book ID: <strong>{item.bookId}</strong>
                  </div>
                  <div className="font-medium">Qty: {item.quantity}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">Pilih Purchase Order terlebih dahulu</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending || !form.getFieldValue("purchaseOrderId")}
          className="w-full py-6"
        >
          {isPending ? "Menyimpan Goods Receipt..." : "Simpan Goods Receipt"}
        </Button>
      </div>
    </form>
  );
}
