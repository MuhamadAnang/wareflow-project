import { useForm } from "@tanstack/react-form";
import { CreateGoodsReceiptSchema, TCreateGoodsReceipt } from "@/schemas/goods-receipt.schema";

interface UseGoodsReceiptCreateFormParams {
  defaultValues: Partial<TCreateGoodsReceipt>;
  onSubmit: (values: TCreateGoodsReceipt) => Promise<void>;
}

export const useGoodsReceiptCreateForm = ({ defaultValues, onSubmit }: UseGoodsReceiptCreateFormParams) => {
  return useForm({
    defaultValues: {
      purchaseOrderId: defaultValues.purchaseOrderId ?? 0,
      receivedDate: defaultValues.receivedDate ?? new Date().toISOString().split("T")[0],
      note: defaultValues.note ?? "",
      items: defaultValues.items ?? [],
    },
    validators: {
      onChange: CreateGoodsReceiptSchema,
      onSubmit: CreateGoodsReceiptSchema,
    },
    onSubmit: async ({ value }) => {
      // Filter items dengan quantity > 0 (atau >= 1 sesuai validasi)
      const validItems = value.items.filter(item => item.quantity > 0);
      if (validItems.length === 0) {
        throw new Error("Minimal satu item dengan quantity > 0");
      }
      await onSubmit({ ...value, items: validItems });
    },
  });
};