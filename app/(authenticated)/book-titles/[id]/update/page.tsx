"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useBookTitleForm } from "../../__hooks/use-book-title-form";
import { useUpdateBookTitleMutation } from "./__hooks/use-update-book-title.mutation";
import { TCreateOrUpdateBookTitle } from "@/schemas/book-title.schema";
import { CreateOrUpdateForm } from "../../__components/create-or-update.form";

function UpdateBookTitleForm({
  defaultValues,
  subjects,
  bookTitleId,
}: {
  defaultValues: TCreateOrUpdateBookTitle;
  subjects: { id: number; name: string }[];
  bookTitleId: number;
}) {
  const { mutateAsync, isPending } = useUpdateBookTitleMutation(bookTitleId);

  const form = useBookTitleForm({
    defaultValues,
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  return <CreateOrUpdateForm form={form} isPending={isPending} subjects={subjects} />;
}

export default function UpdateBookTitlePage() {
  const params = useParams();
  const id = Number(params.id);
  const api = useAuthenticatedClient();

  // Fetch detail
  const { data: bookTitleData, isLoading: bookLoading } = useQuery({
    queryKey: ["book-title", id],
    queryFn: async () => {
      const res = await api.get(`/book-titles/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  // Fetch subjects untuk dropdown
  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects-simple"],
    queryFn: async () => {
      const res = await api.get("/subjects", { params: { page: 1, pageSize: 100 } });
      return res.data.data || [];
    },
  });

  const subjects = subjectsData || [];

  // Tunggu semua data siap sebelum render form
  if (bookLoading || subjectsLoading || !bookTitleData) {
    return <Page isLoading={true} title="Update Judul Buku" />;
  }

  const defaultValues = {
    subjectId: bookTitleData.subjectId,
    grade: bookTitleData.grade,
    level: bookTitleData.level,
    curriculum: bookTitleData.curriculum,
  };

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Update Judul Buku"
      description="Perbarui informasi judul buku di bawah ini."
    >
      <UpdateBookTitleForm
        defaultValues={defaultValues}
        subjects={subjects}
        bookTitleId={id}
      />
    </Page>
  );
}