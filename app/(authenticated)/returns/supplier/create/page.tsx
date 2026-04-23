"use client";

import Page from "@/app/_components/page";
import { useCreateSupplierReturnMutation } from "../__hooks/use-create-supplier-return.mutation";
import { CreateSupplierReturnForm } from "../__components/create-supplier-return.form";

export default function CreateSupplierReturnPage() {
  const { mutateAsync, isPending } = useCreateSupplierReturnMutation();

  return (
    <Page
      title="Buat Retur Supplier"
      description="Buat retur barang ke supplier. Stok akan berkurang secara otomatis."
    >
      <CreateSupplierReturnForm onSubmit={mutateAsync} isPending={isPending} />
    </Page>
  );
}