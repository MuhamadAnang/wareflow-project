import { useForm } from "@tanstack/react-form";
import { CreatePurchaseOrderSchema, TCreatePurchaseOrder } from "@/schemas/purchase-order.schema";
import { toast } from "sonner";

interface UsePurchaseOrderFormParams {
  defaultValues: Partial<TCreatePurchaseOrder>;
  onSubmit: (data: TCreatePurchaseOrder) => Promise<void>;
  isEdit?: boolean; // tambahkan ini
}

export const usePurchaseOrderForm = ({
  defaultValues,
  onSubmit,
  isEdit: _isEdit,
}: UsePurchaseOrderFormParams) => {
  const formDefaultValues: TCreatePurchaseOrder = {
    supplierId: defaultValues.supplierId ?? 0,
    orderDate: defaultValues.orderDate ?? new Date().toISOString().split("T")[0],
    note: defaultValues.note ?? "",
    items: defaultValues.items ?? [{ bookId: 0, quantity: 1 }],
  };

  return useForm({
    defaultValues: formDefaultValues,
    validators: {
      onChange: CreatePurchaseOrderSchema,
      onSubmit: CreatePurchaseOrderSchema,
    },
    onSubmit: async ({ value }) => {
      const validItems = value.items.filter((item) => item.bookId > 0);
      if (validItems.length === 0) {
        toast.error("Minimal harus memilih satu buku");
        return;
      }
      const payload = { ...value, items: validItems };
      await onSubmit(payload);
    },
    onSubmitInvalid: () => {
      toast.error("Mohon lengkapi data dengan benar.");
    },
  });
};
