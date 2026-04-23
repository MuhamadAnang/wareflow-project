"use client";

import Page from "@/app/_components/page";
import { useBookForm } from "../__hooks/use-book-form";
import { useGetSubjectsQuery } from "../__hooks/use-get-subjects.query";
import { useGetPercetakansQuery } from "../__hooks/use-get-percetakans.query";
import { semesterEnum } from "@/drizzle/schema";
import { BookForm } from "../__components/create-or-update.form";
import { useCreateBookMutation } from "./__hooks/use-create-book.mutation";

export default function CreateBookPage() {
  const { data: subjectsData, isLoading: loadingSubjects } = useGetSubjectsQuery();
  const { data: percetakansData, isLoading: loadingPercetakans } = useGetPercetakansQuery();

  const { mutateAsync: createBook, isPending: isCreating } = useCreateBookMutation();

  const subjects = subjectsData ?? [];
  const percetakans = percetakansData ?? [];

  const form = useBookForm({
    defaultValues: {
      code: "",
      subjectId: 0,           
      grade: 0,
      level: "" as any,       
      curriculum: "" as any,
      semester: semesterEnum.enumValues[0],
      pages: null,
      productionYear: null,
      percetakanId: 0,
    } as any,
    onSubmit: async (values) => {
      await createBook(values);
    },
  });

  const isFormLoading = loadingSubjects || loadingPercetakans || isCreating;

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Tambah Buku Baru"
      description="Isi detail identitas buku lengkap di bawah ini."
      isLoading={isFormLoading}
    >
      <BookForm
        form={form}
        isPending={isCreating}
        subjects={subjects}
        percetakans={percetakans}
        onSubjectCreated={(newId) => {
    form.setFieldValue("subjectId", newId);   // otomatis pilih subject yang baru dibuat
  }}
      />
    </Page>
  );
}