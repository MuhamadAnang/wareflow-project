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
      institution: "",
      status: customerStatusEnum.enumValues[0],
    },
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Buat Customer"
      description="Isi formulir di bawah ini untuk membuat pelanggan baru. Pastikan untuk memberikan informasi yang akurat agar komunikasi dan penyampaian layanan berjalan lancar."
    >
      <CreateOrUpdateForm form={form} isPending={isPending} />
    </Page>
  );
}
