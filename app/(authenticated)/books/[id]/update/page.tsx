"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetBook } from "../__hooks/use-get-book.query";
import { useUpdateBookMutation } from "./__hooks/use-update-book.mutation";
import { useGetSubjectsQuery } from "../../__hooks/use-get-subjects.query";
import { useGetPercetakansQuery } from "../../__hooks/use-get-percetakans.query";
import { useBookForm } from "../../__hooks/use-book-form";
import { bookLevelEnum, curriculumEnum, semesterEnum } from "@/drizzle/schema";
import { BookForm } from "../../__components/create-or-update.form";
import type { TBookListItem } from "@/types/database";

interface UpdateBookFormProps {
  book: TBookListItem;
  subjects: { id: number; name: string }[];
  percetakans: { id: number; name: string }[];
  isLoading: boolean;
}

function UpdateBookForm({ book, subjects, percetakans, isLoading }: UpdateBookFormProps) {
  const { mutateAsync: updateBook, isPending: isUpdating } = useUpdateBookMutation(book.id);

  const form = useBookForm({
    defaultValues: {
      code: book.code,
      subjectId: book.subjectId,
      grade: book.grade,
      level: book.level as (typeof bookLevelEnum.enumValues)[number],
      curriculum: book.curriculum as (typeof curriculumEnum.enumValues)[number],
      semester: book.semester as (typeof semesterEnum.enumValues)[number],
      pages: book.pages,
      productionYear: book.productionYear,
      percetakanId: book.percetakanId,
      image: book.image || "",
    },
    onSubmit: async (values) => {
      await updateBook(values);
    },
  });

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Edit Buku"
      description="Perbarui informasi identitas buku."
      isLoading={isLoading || isUpdating}
    >
      <BookForm
        form={form}
        isPending={isUpdating}
        subjects={subjects}
        percetakans={percetakans}
        onSubjectCreated={(newId) => {
          form.setFieldValue("subjectId", newId);
        }}
      />
    </Page>
  );
}

export default function UpdateBookPage() {
  const params = useParams();
  const bookId = Number(params.id);

  const { data: bookData, isLoading: loadingBook } = useGetBook(bookId);
  const { data: subjectsData, isLoading: loadingSubjects } = useGetSubjectsQuery();
  const { data: percetakansData, isLoading: loadingPercetakans } = useGetPercetakansQuery();

  const book = bookData?.data;
  const subjects = subjectsData ?? [];
  const percetakans = percetakansData ?? [];
  const isFormLoading = loadingSubjects || loadingPercetakans;

  if (loadingBook || !book) {
    return (
      <Page title="Edit Buku" isLoading={true}>
        <div className="text-center p-8">Memuat data buku...</div>
      </Page>
    );
  }

  return (
    <UpdateBookForm
      key={book.id}
      book={book}
      subjects={subjects}
      percetakans={percetakans}
      isLoading={isFormLoading}
    />
  );
}
