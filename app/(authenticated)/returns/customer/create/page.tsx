"use client";

import Page from "@/app/_components/page";
import { useCreateCustomerReturnMutation } from "../__hooks/use-create-customer-return.mutation";
import { CreateCustomerReturnForm } from "../__components/create-customer-return.form";

export default function CreateCustomerReturnPage() {
  const { mutateAsync, isPending } = useCreateCustomerReturnMutation();

  const handleSubmit = async (data: Parameters<typeof mutateAsync>[0]) => {
    await mutateAsync(data);
  };

  return (
    <Page
      title="Buat Retur Customer"
      description="Buat retur barang dari customer. Stok akan bertambah secara otomatis."
    >
      <CreateCustomerReturnForm onSubmit={handleSubmit} isPending={isPending} />
    </Page>
  );
}