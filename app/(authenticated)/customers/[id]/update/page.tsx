"use client";

import Page from "@/app/_components/page";
import { CreateOrUpdateForm } from "../../__components/create-or-update.form";
import { useParams } from "next/navigation";
import { useGetCustomer } from "../__hooks/use-get-customer.query";
import { useCustomerForm } from "../../__hooks/use-customer-form";
import { customerStatusEnum } from "@/drizzle/schema";
import { useUpdateCustomerMutation } from "./__hooks/use-update-customer.mutation";
import { TCreateOrUpdateCustomer } from "@/schemas/customer.schema";

function UpdateCustomerForm({
  defaultValues,
  customerId,
}: {
  defaultValues: TCreateOrUpdateCustomer;
  customerId: number;
}) {
  const { mutateAsync, isPending } = useUpdateCustomerMutation(customerId);

  const form = useCustomerForm({
    defaultValues,
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  return <CreateOrUpdateForm form={form} isPending={isPending} />;
}

export default function UpdateCustomerPage() {
  const params = useParams();
  const { data, isLoading } = useGetCustomer(Number(params.id));

  return (
    <Page
      className="max-w-xl w-full mx-auto mt-3"
      isLoading={isLoading}
      title="Perbarui Data Customer"
      description="Isi formulir di bawah ini untuk memperbarui informasi pelanggan."
    >
      {data?.data && (
        <UpdateCustomerForm
          key={data.data.id}
          customerId={Number(params.id)}
          defaultValues={{
            name: data.data.name,
            phone: data.data.phone,
            address: data.data.address,
            institution: data.data.institution,
            status: data.data.status as (typeof customerStatusEnum.enumValues)[number],
          }}
        />
      )}
    </Page>
  );
}
