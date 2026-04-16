"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import { Form } from "@tanstack/react-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CreateOrUpdateGoodsReceiptFormProps = {
  form: any;
  isPending: boolean;
  purchaseOrders: any[];
  poDetail?: any;
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
        {/* Purchase Order */}
        <form.Field
          name="purchaseOrderId"
                    // eslint-disable-next-line react/no-children-prop
          children={(field) => (
            <div>
              <Label>Purchase Order <span className="text-red-500">*</span></Label>
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
                  {purchaseOrders.map((po: any) => (
                    <SelectItem key={po.id} value={po.id.toString()}>
                      PO #{po.id} — Supplier: {po.supplierName || "-"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* Received Date */}
        <form.Field
          name="receivedDate"
                    // eslint-disable-next-line react/no-children-prop
          children={(field) => (
            <div>
              <Label>Tanggal Terima <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />

        {/* Note */}
        <form.Field
          name="note"
                    // eslint-disable-next-line react/no-children-prop
          children={(field) => (
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
        />

        {/* Items Preview */}
        <div>
          <Label className="mb-3 block">Items yang akan diterima</Label>
          {poDetail?.items?.length > 0 ? (
            <div className="border rounded-md divide-y bg-gray-50 p-4">
              {poDetail.items.map((item: any, index: number) => (
                <div key={index} className="py-3 flex justify-between items-center">
                  <div>Book ID: <strong>{item.bookId}</strong></div>
                  <div className="font-medium">Qty: {item.quantity}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">
              Pilih Purchase Order terlebih dahulu
            </p>
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