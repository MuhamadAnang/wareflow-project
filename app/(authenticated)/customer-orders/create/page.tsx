"use client";

import Page from "@/app/_components/page";
import { useCreateCustomerOrderMutation } from "../__hooks/use-create-customer-order.mutation";
import { CreateOrderForm } from "../__components/create-order.form";
import { useCreateOrderForm } from "../__hooks/use-create-order-form";

export default function CreateCustomerOrderPage() {
  const { mutateAsync, isPending } = useCreateCustomerOrderMutation();

  const form = useCreateOrderForm({
    handleSubmit: async (data) => {
      await mutateAsync(data);
    }

  });

  return (
    <Page
      title="Create Customer Order"
      description="Create a new customer order. Fill in customer details, add items with quantity and price."
    >
      <CreateOrderForm form={form} isPending={isPending} />
    </Page>
  );
}