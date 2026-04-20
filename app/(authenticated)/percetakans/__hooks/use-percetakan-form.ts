
import { CreateOrUpdatePercetakanSchema, TCreateOrUpdatePercetakan } from "@/schemas/percetakan.schema";
import { useForm } from "@tanstack/react-form";

interface Params {
  defaultValues: TCreateOrUpdatePercetakan;
  onSubmit: (data: TCreateOrUpdatePercetakan) => Promise<void>;
}

export const usePercetakanForm = ({ defaultValues, onSubmit }: Params) => {
  return useForm({
    defaultValues,
    validators: {
      onChange: CreateOrUpdatePercetakanSchema,
      onSubmit: CreateOrUpdatePercetakanSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
      });
    },
  });
};
