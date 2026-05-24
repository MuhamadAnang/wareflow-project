"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetSuppliersQuery } from "@/app/(authenticated)/suppliers/__hooks/use-get-suppliers.query";
import { useGetBooksQuery } from "@/app/(authenticated)/books/__hooks/use-get-book.query";
import { usePurchaseOrderForm } from "../../__hooks/use-purchase-order-form";
import { CreateOrUpdatePurchaseOrderForm } from "../../__components/create-or-update-form";
import { useGetPurchaseOrder } from "../__hooks/use-get-purchase-order.query";
import { useUpdatePurchaseOrderMutation } from "./__hooks/use-update-purchase-order.mutation";
import { TPurchaseOrderDetail, TSupplier, TBookListItem } from "@/types/database";
import { TCreatePurchaseOrder } from "@/schemas/purchase-order.schema";
import { getApiList } from "@/lib/api-list";

export default function UpdatePurchaseOrderPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: poData, isLoading: poLoading } = useGetPurchaseOrder(id);
  const { data: suppliersData, isLoading: suppliersLoading } = useGetSuppliersQuery({
    page: 1,
    pageSize: 100,
  });
  const { data: booksData, isLoading: booksLoading } = useGetBooksQuery({
    page: 1,
    pageSize: 100,
  });

  const suppliers: TSupplier[] = getApiList<TSupplier>(suppliersData);
  const books: TBookListItem[] = getApiList<TBookListItem>(booksData);
  const po = poData?.data;

  const { mutateAsync, isPending } = useUpdatePurchaseOrderMutation(id);

  // FIX: Tampilkan loading sampai SEMUA data siap.
  // Dengan begitu form hanya dibuat sekali dengan defaultValues yang sudah lengkap.
  const isLoading = poLoading || suppliersLoading || booksLoading;

  if (isLoading) {
    return (
      <Page title="Loading..." description="">
        Memuat data...
      </Page>
    );
  }

  if (!po) {
    return (
      <Page title="Error" description="">
        Data tidak ditemukan
      </Page>
    );
  }

  return (
    <UpdateForm
      po={po}
      suppliers={suppliers}
      books={books}
      isPending={isPending}
      onSubmit={async (data: TCreatePurchaseOrder) => await mutateAsync(data)}
    />
  );
}

// FIX: Pisahkan ke komponen tersendiri agar usePurchaseOrderForm
// baru dipanggil setelah data lengkap tersedia (komponen ini
// hanya di-mount ketika isReady = true di atas).
function UpdateForm({
  po,
  suppliers,
  books,
  isPending,
  onSubmit,
}: {
  po: TPurchaseOrderDetail;
  suppliers: TSupplier[];
  books: TBookListItem[];
  isPending: boolean;
  onSubmit: (values: TCreatePurchaseOrder) => Promise<unknown>;
}) {
  const form = usePurchaseOrderForm({
    defaultValues: {
      supplierId: po.supplierId,
      orderDate: po.orderDate ? new Date(po.orderDate).toISOString().split("T")[0] : "",
      note: po.note ?? "",
      items: po.items.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      })),
    },
    onSubmit: async (values) => {
      await onSubmit(values);
    },
    isEdit: true,
  });

  return (
    <Page
    // className=" mx-auto"
    // title="Perbarui Informasi Belanja"
    // description="Edit informasi Belanja Buku ke supplier, termasuk supplier, tanggal pesanan, catatan, dan item yang dipesan."
    >
      <CreateOrUpdatePurchaseOrderForm
        form={form}
        suppliers={suppliers}
        books={books}
        isPending={isPending}
        isEdit={true}
      />
    </Page>
  );
}
