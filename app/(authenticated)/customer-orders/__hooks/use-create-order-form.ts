import {
  CreateCustomerOrderFormSchema,
  TCreateCustomerOrder,
} from "@/schemas/customer-order.schema";
import { useForm } from "@tanstack/react-form";

interface Params {
  handleSubmit: (data: TCreateCustomerOrder) => Promise<void>;
  defaultValues?: Partial<TCreateCustomerOrder>;
}

const defaultFormValues: TCreateCustomerOrder = {
  customerId: 0,
  orderDate: new Date().toISOString().split("T")[0],
  note: "",
  items: [],
};

export const useCreateOrderForm = ({ handleSubmit, defaultValues }: Params) => {
  return useForm({
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
    validators: {
      onChange: CreateCustomerOrderFormSchema,
      onSubmit: CreateCustomerOrderFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with value:", value);

      const payload: TCreateCustomerOrder = {
        ...value,
        customerId: value.customerId,
        orderDate: value.orderDate,
        note: value.note || null,
      };

      await handleSubmit(payload);
    },
    onSubmitInvalid: ({ formApi }) => {
      formApi.setFieldMeta("items", (prev) => ({ ...prev, isTouched: true }));
    },
  });
};
