"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetBook } from "../__hooks/use-get-book.query";
import { useUpdateBookMutation } from "./__hooks/use-update-book.mutation";
import { useGetSubjectsQuery } from "../../__hooks/use-get-subjects.query";
import { useGetPercetakansQuery } from "../../__hooks/use-get-percetakans.query";
import { useBookForm } from "../../__hooks/use-book-form";
import { BookForm } from "../../__components/create-or-update.form";

export default function UpdateBookPage() {
  const params = useParams();
  const bookId = Number(params.id);

  const { data: bookData, isLoading: loadingBook } = useGetBook(bookId);
  const { data: subjectsData, isLoading: loadingSubjects } = useGetSubjectsQuery();
  const { data: percetakansData, isLoading: loadingPercetakans } = useGetPercetakansQuery();

  const { mutateAsync: updateBook, isPending: isUpdating } = useUpdateBookMutation(bookId);

  const book = bookData?.data;
  const subjects = subjectsData ?? [];
  const percetakans = percetakansData ?? [];

  const form = useBookForm({
    defaultValues: {
      code: book?.code || "",
      subjectId: book?.subjectId || 0,
      grade: book?.grade || 0,
      level: book?.level || "",
      curriculum: book?.curriculum || "",
      semester: book?.semester || "GANJIL",
      pages: book?.pages ?? null,
      productionYear: book?.productionYear ?? null,
      percetakanId: book?.percetakanId || 0,
    },
    onSubmit: async (values) => {
      await updateBook(values);
    },
  });

  const isFormLoading = loadingBook || loadingSubjects || loadingPercetakans || isUpdating;

  if (loadingBook || !book) {
    return (
      <Page title="Edit Buku" isLoading={true}>
        <div className="text-center p-8">Memuat data buku...</div>
      </Page>
    );
  }

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Edit Buku"
      description="Perbarui informasi identitas buku."
      isLoading={isFormLoading}
    >
      <BookForm
        form={form}
        isPending={isUpdating}
        subjects={subjects}
        percetakans={percetakans}
      />
    </Page>
  );
}