"use client";

import Page from "@/app/_components/page";
import { useBookTitleForm } from "../__hooks/use-book-title-form";
import { useQuery } from "@tanstack/react-query";
import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useCreateBookTitleMutation } from "../__hooks/use-create-book-title.mutation";
import { CreateOrUpdateForm } from "../__components/create-or-update.form";

export default function CreateBookTitlePage() {
  const { mutateAsync, isPending } = useCreateBookTitleMutation();
  const api = useAuthenticatedClient();

  // Fetch list subjects untuk dropdown (mirip kalau Customer butuh dropdown)
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects-for-dropdown"],
    queryFn: async () => {
      // Asumsi endpoint /subjects mengembalikan { data: [{id, name}] }
      // const res = await api.get("/subjects?pageSize=100"); // atau endpoint khusus simple list
      const res = await api.get("/subjects", {
        params: {
          page: 1,          // tambahkan ini
          pageSize: 100,    // sudah ada, tapi sekarang eksplisit
        },
      });
      return res.data.data || [];
    },
  });

  const form = useBookTitleForm({
    defaultValues: {
      subjectId: 0,
      grade: 1,
      level: "SD",
      curriculum: "KURIKULUM_MERDEKA",
    },
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  if (subjectsLoading) {
    return <Page title="Memuat...">Memuat data mata pelajaran...</Page>;
  }

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Tambah Judul Buku"
      description="Isi formulir di bawah ini untuk menambahkan judul buku baru. Pastikan informasi akurat untuk klasifikasi yang tepat."
    >
      <CreateOrUpdateForm 
        form={form} 
        isPending={isPending} 
        subjects={subjects} 
      />
    </Page>
  );
}