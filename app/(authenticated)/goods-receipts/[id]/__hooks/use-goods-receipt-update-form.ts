import { useForm } from "@tanstack/react-form";
import { UpdateGoodsReceiptSchema, TUpdateGoodsReceipt } from "@/schemas/goods-receipt.schema";

export const useGoodsReceiptUpdateForm = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues: TUpdateGoodsReceipt;
  onSubmit: (values: TUpdateGoodsReceipt) => Promise<void>;
}) => {
  return useForm({
    defaultValues,
    validators: {
      onChange: UpdateGoodsReceiptSchema,
      onSubmit: UpdateGoodsReceiptSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
};