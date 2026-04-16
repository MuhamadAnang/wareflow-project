"use client";

import Page from "@/app/_components/page";
import { useCreateGoodsOutMutation } from "../__hooks/use-create-goods-out.mutation";
import { CreateGoodsOutForm } from "../__components/create-goods-out.form";

export default function CreateGoodsOutPage() {
  const { mutateAsync, isPending } = useCreateGoodsOutMutation();

  return (
    <Page
      title="Buat Pengiriman Barang"
      description="Pilih customer order yang sudah dikonfirmasi, tentukan item dan jumlah yang akan dikirim."
    >
      <CreateGoodsOutForm onSubmit={mutateAsync} isPending={isPending} />
    </Page>
  );
}