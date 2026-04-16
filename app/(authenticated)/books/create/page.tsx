"use client";

import Page from "@/app/_components/page";
import { useBookForm } from "../__hooks/use-book-form";
import { useGetBookTitlesQuery } from "../__hooks/use-get-book-titles.query";
import { useGetSuppliersQuery } from "../__hooks/use-get-suppliers.query";
import { semesterEnum } from "@/drizzle/schema";
import { BookForm } from "../__components/create-or-update.form";
import { useCreateBookMutation } from "./__hooks/use-create-book.mutation";

export default function CreateBookPage() {
  const { data: bookTitlesData, isLoading: loadingTitles } = useGetBookTitlesQuery();
  const { data: suppliersData, isLoading: loadingSuppliers } = useGetSuppliersQuery();

  const { mutateAsync: createBook, isPending: isCreating } = useCreateBookMutation();

  const bookTitles = bookTitlesData ?? [];
  const suppliers = suppliersData ?? [];

  const form = useBookForm({
    defaultValues: {
      code: "",
      bookTitleId: 0,
      supplierId: 0,
      semester: semesterEnum.enumValues[0], 
      pages: undefined,
      productionYear: undefined,
    },
    onSubmit: async (values) => {
      await createBook(values);
    },
  });

  const isFormLoading = loadingTitles || loadingSuppliers || isCreating;

  return (
    <Page
      className="max-w-3xl mx-auto mt-3"
      title="Tambah Buku Baru"
      description="Isi detail varian buku fisik di bawah ini. Pastikan kode unik dan pilih judul serta penerbit yang benar."
      isLoading={isFormLoading}
    >
      <BookForm
        form={form}
        isPending={isCreating}
        bookTitles={bookTitles}
        suppliers={suppliers}
      />
    </Page>
  );
}