"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useUpdateSubjectMutation } from "../../__hooks/use-update-subject.mutation";
import { useSubjectForm } from "../../__hooks/use-subject-form";
import { CreateOrUpdateForm } from "../../__components/create-or-update.form";
import { useGetSubject } from "./__hooks/use-get-subject.query";

function UpdateSubjectForm({
  defaultValues,
  subjectId,
}: {
  defaultValues: { name: string };
  subjectId: number;
}) {
  const { mutateAsync, isPending } = useUpdateSubjectMutation(subjectId);

  const form = useSubjectForm({
    defaultValues,
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  return <CreateOrUpdateForm form={form} isPending={isPending} />;
}
export default function UpdateSubjectPage() {
  const params = useParams();
    const { data, isLoading } = useGetSubject(Number(params.id));
  
    return (
      <Page
        className="max-w-xl w-full mx-auto mt-3"
        isLoading={isLoading}
        title="Update Customer"
        description="Fill out the form below to update the customer's information."
      >
        {data?.data && (
          <UpdateSubjectForm
            key={data.data.id}
            subjectId={Number(params.id)}
            defaultValues={{
              name: data.data.name,
            }}
          />
        )}
      </Page>
    );
  }