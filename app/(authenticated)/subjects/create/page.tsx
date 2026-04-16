"use client";

import Page from "@/app/_components/page";
import { useCreateSubjectMutation } from "../__hooks/use-create-subject.mutation";
import { useSubjectForm } from "../__hooks/use-subject-form";
import { CreateOrUpdateForm } from "../__components/create-or-update.form";

export default function CreateSubjectPage() {
  const { mutateAsync, isPending } = useCreateSubjectMutation();

  const form = useSubjectForm({
    defaultValues: { name: "" },
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Tambah Mata Pelajaran Baru"
      description="Masukkan nama mata pelajaran yang akan digunakan untuk mengelompokkan buku."
    >
      <CreateOrUpdateForm form={form} isPending={isPending} buttonText="Simpan Mata Pelajaran" />
    </Page>
  );
}