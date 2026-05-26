"use client";

import Page from "@/app/_components/page";
import { useCreateClerkUser } from "./_hooks/use-mutations";
import { CreateOrUpdateClerkUserForm } from "../_components/create-or-update.form";

export default function CreateUserPage() {
  const { mutateAsync, isPending } = useCreateClerkUser();

  return (
    <Page
      title="Tambah Pengguna"
      description="Halaman untuk menambahkan pengguna baru ke dalam sistem."
      className="max-w-3xl mx-auto mt-3"
    >
      <CreateOrUpdateClerkUserForm
        onSubmit={async (values) => {
          await mutateAsync({ payload: values });
        }}
        isLoading={isPending}
      />
    </Page>
  );
}
