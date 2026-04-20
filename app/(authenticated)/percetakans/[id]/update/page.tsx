"use client";

import Page from "@/app/_components/page";
import { CreateOrUpdateForm } from "../../__components/create-or-update.form";
import { useParams } from "next/navigation";
import { useGetPercetakan } from "../__hooks/use-get-percetakan.query";
import { usePercetakanForm } from "../../__hooks/use-percetakan-form";
import { useUpdatePercetakanMutation } from "./__hooks/use-update-percetakan.mutation";
import { TCreateOrUpdatePercetakan } from "@/schemas/percetakan.schema";

function UpdatePercetakanForm({
  defaultValues,
  percetakanId,
}: {
  defaultValues: TCreateOrUpdatePercetakan;
  percetakanId: number;
}) {
  const { mutateAsync, isPending } = useUpdatePercetakanMutation(percetakanId);

  const form = usePercetakanForm({
    defaultValues,
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  return <CreateOrUpdateForm form={form} isPending={isPending} />;
}

export default function UpdatePercetakanPage() {
  const params = useParams();
  const { data, isLoading } = useGetPercetakan(Number(params.id));

  return (
    <Page
      className="max-w-xl w-full mx-auto mt-3"
      isLoading={isLoading}
      title="Perbarui Data percetakan"
      description="Isi formulir di bawah ini untuk memperbarui informasi percetakan."
    >
      {data?.data && (
        <UpdatePercetakanForm
          key={data.data.id}
          percetakanId={Number(params.id)}
          defaultValues={{
            name: data.data.name,
            phone: data.data.phone,
            address: data.data.address,
          }}
        />
      )}
    </Page>
  );
}
