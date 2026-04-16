"use client";

import Page from "@/app/_components/page";
import { useCreateGoodsReceiptMutation } from "./__hooks/use-create-goods-receipt.mutation";
import { useGoodsReceiptCreateForm } from "../__hooks/use-goods-receipt-create-form";
import { GoodsReceiptCreateForm } from "../__components/create-form";
import { useGetPurchaseOrdersQuery } from "../../purchase-orders/__hooks/use-get-purchase-orders.query";
import { useGetPurchaseOrderDetailQuery } from "./__hooks/use-get-purchase-order-detail.query";
import { useGetBooksQuery } from "../../books/__hooks/use-get-book.query";
import { useState, useEffect } from "react";

export default function CreateGoodsReceiptPage() {
  const { mutateAsync, isPending } = useCreateGoodsReceiptMutation();
  const [selectedPoId, setSelectedPoId] = useState<number>(0);

  const { data: poListData } = useGetPurchaseOrdersQuery({ page: 1, pageSize: 100 });
  const { data: poDetail } = useGetPurchaseOrderDetailQuery(selectedPoId);
  const { data: booksData } = useGetBooksQuery({ page: 1, pageSize: 1000 });
  const books = booksData?.data ?? [];

  const form = useGoodsReceiptCreateForm({
    defaultValues: {
      purchaseOrderId: 0,
      receivedDate: new Date().toISOString().split("T")[0],
      note: "",
      items: [],
    },
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  useEffect(() => {
    if (poDetail && poDetail.items && poDetail.items.length > 0) {
      const items = poDetail.items.map((item: any) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      }));
      form.setFieldValue("items", items);
    } else if (selectedPoId !== 0) {
      form.setFieldValue("items", []);
    }
  }, [poDetail, selectedPoId, form]);

  const handlePoChange = (poId: number) => {
    setSelectedPoId(poId);
    form.setFieldValue("purchaseOrderId", poId);
  };

  return (
    <Page
      title="Create Goods Receipt"
      description="Terima barang dari Purchase Order (quantity dapat disesuaikan)"
      className="max-w-4xl mx-auto mt-3 h-full overflow-y-auto"
      style={{ height: 'calc(100vh - 100px)' }}
    >
      <div className="pb-20">
        <GoodsReceiptCreateForm
          form={form}
          isPending={isPending}
          purchaseOrders={poListData?.data || []}
          books={books}
          onPoChange={handlePoChange}
        />
      </div>
    </Page>
  );
}