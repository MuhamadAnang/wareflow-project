"use client";

import Page from "@/app/_components/page";
import { useSupplierForm } from "../__hooks/use-supplier-form";
import { CreateOrUpdateForm } from "../__components/create-or-update.form";
import { useCreateSupplierMutation } from "./__hooks/use-create-supplier.mutation";


export default function CreateSupplierPage() {
  const { mutateAsync, isPending } = useCreateSupplierMutation();

  const form = useSupplierForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Create Supplier"
      description="Fill out the form below to create a new customer. Make sure to provide accurate information to ensure smooth communication and service delivery."
    >
      <CreateOrUpdateForm form={form} isPending={isPending} />
    </Page>
  );
}
