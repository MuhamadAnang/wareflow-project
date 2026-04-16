"use client";

import Page from "@/app/_components/page";
import { useParams, useRouter } from "next/navigation";
import { useGetBook } from "../__hooks/use-get-book.query";
import { useUpdateBookMutation } from "./__hooks/use-update-book.mutation"; 
import { semesterEnum } from "@/drizzle/schema";
import { useGetBookTitlesQuery } from "../../__hooks/use-get-book-titles.query";
import { useGetSuppliersQuery } from "../../__hooks/use-get-suppliers.query";
import { useBookForm } from "../../__hooks/use-book-form";
import { BookForm } from "../../__components/create-or-update.form";

export default function UpdateBookPage() {
  const params = useParams();
  const bookId = Number(params.id);
  const router = useRouter();

  const { data: bookData, isLoading: loadingBook } = useGetBook(bookId);
  const { data: bookTitlesData, isLoading: loadingTitles } = useGetBookTitlesQuery();
  const { data: suppliersData, isLoading: loadingSuppliers } = useGetSuppliersQuery();

  const { mutateAsync: updateBook, isPending: isUpdating } = useUpdateBookMutation(bookId);

  const book = bookData?.data;
  const bookTitles = bookTitlesData ?? [];
  const suppliers = suppliersData ?? [];

  const form = useBookForm({
    defaultValues: {
      code: book?.code || "",
      bookTitleId: book?.bookTitleId || 0,
      supplierId: book?.supplierId || 0,
      semester: book?.semester || semesterEnum.enumValues[0],
      pages: book?.pages ?? undefined,
      productionYear: book?.productionYear ?? undefined,
    },
    onSubmit: async (values) => {
      await updateBook(values);
      router.push(`/books/${bookId}`);
    },
  });

  const isFormLoading = loadingBook || loadingTitles || loadingSuppliers || isUpdating;

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
      description="Perbarui informasi varian buku fisik ini. Pastikan data tetap akurat."
      isLoading={isFormLoading}
    >
      <BookForm
        form={form}
        isPending={isUpdating}
        bookTitles={bookTitles}
        suppliers={suppliers}
      />
    </Page>
  );
}