"use client";

import Page from "@/app/_components/page";
import { customerStatusEnum } from "@/drizzle/schema";
import { useCreateCustomerMutation } from "./__hooks/use-create-customer.mutation";
import { useCustomerForm } from "../__hooks/use-customer-form";
import { CreateOrUpdateForm } from "../__components/create-or-update.form";

export default function CreateCustomerPage() {
  const { mutateAsync, isPending } = useCreateCustomerMutation();

  const form = useCustomerForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      school: "",
      status: customerStatusEnum.enumValues[0],
    },
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Create Customer"
      description="Fill out the form below to create a new customer. Make sure to provide accurate information to ensure smooth communication and service delivery."
    >
      <CreateOrUpdateForm form={form} isPending={isPending} />
    </Page>
  );
}
