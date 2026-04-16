"use client";

import { useForm } from "@tanstack/react-form";
// import { zodValidator } from "@tanstack/zod-form-adapter";
import { TCreateGoodsReceipt } from "@/schemas/goods-receipt.schema";

export const useGoodsReceiptForm = ({
  defaultValues = {},
  onSubmit,
}: {
  defaultValues?: Partial<TCreateGoodsReceipt>;
  onSubmit: (values: TCreateGoodsReceipt) => Promise<void>;
}) => {
  return useForm({
    defaultValues: {
      purchaseOrderId: 0,
      receivedDate: new Date().toISOString().split("T")[0],
      note: "",
      items: [],
      ...defaultValues,
    },
    // validators: {
    //   onSubmit: zodValidator(CreateGoodsReceiptSchema),
    // },
    onSubmit: async ({ value }) => await onSubmit(value),
  });
};