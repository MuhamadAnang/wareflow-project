import { CreateOrUpdateSupplierSchema, TCreateOrUpdateSupplier } from "@/schemas/supplier.schema";
import { useForm } from "@tanstack/react-form";

interface Params {
  defaultValues: TCreateOrUpdateSupplier;
  onSubmit: (data: TCreateOrUpdateSupplier) => Promise<void>;
}

export const useSupplierForm = ({ defaultValues, onSubmit }: Params) => {
  return useForm({
    defaultValues,
    validators: {
      onChange: CreateOrUpdateSupplierSchema,
      onSubmit: CreateOrUpdateSupplierSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
      });
    },
  });
};
