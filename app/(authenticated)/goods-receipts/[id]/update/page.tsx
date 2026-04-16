"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetBooksQuery } from "@/app/(authenticated)/books/__hooks/use-get-book.query";
import { GoodsReceiptUpdateForm } from "../../__components/update-form";
import { useGoodsReceiptUpdateForm } from "../__hooks/use-goods-receipt-update-form";
import { useGetGoodsReceipt } from "../__hooks/use-get-good-receipt.query";
import { useUpdateGoodsReceiptMutation } from "../__hooks/use-update-goods-receipt.mutation";

// Komponen form yang hanya dirender setelah data receipt siap
function UpdateFormContent({
  receipt,
  books,
  onUpdate,
  isPending,
}: {
  receipt: any;
  books: any[];
  onUpdate: (values: any) => Promise<void>;
  isPending: boolean;
}) {
  const defaultValues = {
    receivedDate: new Date(receipt.receivedDate).toISOString().split("T")[0],
    note: receipt.note ?? "",
    items: receipt.items.map((item: any) => ({
      bookId: item.bookId,
      quantity: item.quantity,
    })),
  };

  const form = useGoodsReceiptUpdateForm({
    defaultValues,
    onSubmit: onUpdate,
  });

  return <GoodsReceiptUpdateForm form={form} books={books} isPending={isPending} />;
}

export default function UpdateGoodsReceiptPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading } = useGetGoodsReceipt(id);
  const { data: booksData } = useGetBooksQuery({ page: 1, pageSize: 1000 });
  const { mutateAsync, isPending } = useUpdateGoodsReceiptMutation(id);

  const books = booksData?.data ?? [];
  const receipt = data?.data;

  if (isLoading) {
    return <Page title="Loading..." description="">Loading...</Page>;
  }

  if (!receipt) {
    return <Page title="Error" description="">Data tidak ditemukan</Page>;
  }

  return (
    <Page
      className="max-w-4xl mx-auto mt-3"
      title="Update Goods Receipt"
      description="Edit informasi penerimaan barang (termasuk item)"
    >
      <UpdateFormContent
        receipt={receipt}
        books={books}
        onUpdate={mutateAsync}
        isPending={isPending}
      />
    </Page>
  );
}