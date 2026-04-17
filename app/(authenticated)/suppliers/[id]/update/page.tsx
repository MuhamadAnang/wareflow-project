"use client";
import { TCreateOrUpdateSupplier } from "@/schemas/supplier.schema";
import { useUpdateSupplierMutation } from "./__hooks/use-update-supplier.mutation";
import { useSupplierForm } from "../../__hooks/use-supplier-form";
import { CreateOrUpdateForm } from "../../__components/create-or-update.form";
import { useParams } from "next/navigation";
import { useGetSupplier } from "../__hooks/use-get-supplier.query";
import Page from "@/app/_components/page";
function UpdateSupplierForm({
  defaultValues,
  supplierId,
}: {
  defaultValues: TCreateOrUpdateSupplier;
  supplierId: number;
}) {
  const { mutateAsync, isPending } = useUpdateSupplierMutation(supplierId);

  const form = useSupplierForm({
    defaultValues,
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });
  return <CreateOrUpdateForm form={form} isPending={isPending} />;
}
export default function UpdateCustomerPage() {
  const params = useParams();
  const { data, isLoading } = useGetSupplier(Number(params.id));
  return (
    <Page
      className="max-w-xl w-full mx-auto mt-3"
      isLoading={isLoading}
      title="Perbarui Supplier"
      description="Isi formulir di bawah ini untuk memperbarui informasi pemasok supplier."
    >
      {data?.data && (
        <UpdateSupplierForm
          key={data.data.id}
          supplierId={Number(params.id)}
          defaultValues={{
            name: data.data.name,
            phone: data?.data.phone || "",
            address: data?.data.address || "",
          }}
        />
      )}
    </Page>
  );
}
