"use client";

import Page from "@/app/_components/page";
import { useCreatePercetakanMutation } from "./__hooks/use-create-percetakan.mutation";
import { usePercetakanForm } from "../__hooks/use-percetakan-form";
import { CreateOrUpdateForm } from "../__components/create-or-update.form";

export default function CreatePercetakanPage() {
  const { mutateAsync, isPending } = useCreatePercetakanMutation();

  const form = usePercetakanForm({
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
      title="Buat percetakan"
      description="Isi formulir di bawah ini untuk membuat pelanggan baru. Pastikan untuk memberikan informasi yang akurat agar komunikasi dan penyampaian layanan berjalan lancar."
    >
      <CreateOrUpdateForm form={form} isPending={isPending} />
    </Page>
  );
}
