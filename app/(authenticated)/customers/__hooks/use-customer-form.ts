import { customerStatusEnum } from "@/drizzle/schema";
import { CreateOrUpdateCustomerSchema, TCreateOrUpdateCustomer } from "@/schemas/customer.schema";
import { useForm } from "@tanstack/react-form";

interface Params {
  defaultValues: TCreateOrUpdateCustomer;
  onSubmit: (data: TCreateOrUpdateCustomer) => Promise<void>;
}

export const useCustomerForm = ({ defaultValues, onSubmit }: Params) => {
  return useForm({
    defaultValues,
    validators: {
      onChange: CreateOrUpdateCustomerSchema,
      onSubmit: CreateOrUpdateCustomerSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
        status: value.status as (typeof customerStatusEnum.enumValues)[number],
      });
    },
  });
};
