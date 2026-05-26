"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetBooksQuery } from "@/app/(authenticated)/books/__hooks/use-get-book.query";
import { GoodsReceiptUpdateForm } from "../../__components/update-form";
import { useGoodsReceiptUpdateForm } from "../__hooks/use-goods-receipt-update-form";
import { useGetGoodsReceipt } from "../__hooks/use-get-good-receipt.query";
import { useUpdateGoodsReceiptMutation } from "../__hooks/use-update-goods-receipt.mutation";
import type { TUpdateGoodsReceipt } from "@/schemas/goods-receipt.schema";
import type { TBookListItem, TGoodsReceiptDetail } from "@/types/database";
import { getApiList } from "@/lib/api-list";

// Komponen form yang hanya dirender setelah data receipt siap
function UpdateFormContent({
  receipt,
  books,
  onUpdate,
  isPending,
}: {
  receipt: TGoodsReceiptDetail;
  books: Pick<TBookListItem, "id" | "displayTitle">[];
  onUpdate: (values: TUpdateGoodsReceipt) => Promise<void>;
  isPending: boolean;
}) {
  const defaultValues: TUpdateGoodsReceipt = {
    receivedDate: new Date(receipt.receivedDate).toISOString().split("T")[0],
    note: receipt.note ?? "",
    items: receipt.items.map((item) => ({
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
  const { data: booksData } = useGetBooksQuery({ page: 1, pageSize: 100 });
  const { mutateAsync, isPending } = useUpdateGoodsReceiptMutation(id);

  const books: Pick<TBookListItem, "id" | "displayTitle">[] = getApiList<TBookListItem>(booksData);
  const receipt = data?.data;
  const handleUpdate = async (values: TUpdateGoodsReceipt) => {
    await mutateAsync(values);
  };

  if (isLoading) {
    return (
      <Page title="Loading..." description="">
        Loading...
      </Page>
    );
  }

  if (!receipt) {
    return (
      <Page title="Error" description="">
        Data tidak ditemukan
      </Page>
    );
  }

  return (
    <Page
      className="mt-3 px-10"
      title="Perbarui Informasi Buku Masuk"
      description="Edit informasi penerimaan barang"
    >
      <UpdateFormContent
        receipt={receipt}
        books={books}
        onUpdate={handleUpdate}
        isPending={isPending}
      />
    </Page>
  );
}
