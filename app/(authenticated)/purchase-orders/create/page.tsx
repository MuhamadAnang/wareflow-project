"use client";

import Page from "@/app/_components/page";
import { useGetSuppliersQuery } from "@/app/(authenticated)/suppliers/__hooks/use-get-suppliers.query";
import { useGetBooksQuery } from "../../books/__hooks/use-get-book.query";
import { useCreatePurchaseOrderMutation } from "./__hooks/use-create-purchase-order.mutation";
import { usePurchaseOrderForm } from "../__hooks/use-purchase-order-form";
import { CreateOrUpdatePurchaseOrderForm } from "../__components/create-or-update-form";

export default function CreatePurchaseOrderPage() {
  const { data: suppliersData } = useGetSuppliersQuery({ page: 1, pageSize: 100 });
  const { data: booksData } = useGetBooksQuery({ page: 1, pageSize: 100 });

  const suppliers = suppliersData?.data ?? [];
  const books = booksData?.data ?? [];

  const { mutateAsync, isPending } = useCreatePurchaseOrderMutation();

  const form = usePurchaseOrderForm({
    defaultValues: {},
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });
  return (
    <Page
      // className="p-0"
      // title="Buat Purchase Order Baru"
      // description="Buat pesanan pembelian ke supplier"
    >
      <CreateOrUpdatePurchaseOrderForm
        form={form}
        suppliers={suppliers}
        books={books}
        isPending={isPending}
        isEdit={false}
      />
    </Page>
  );
}