"use client";

import Page from "@/app/_components/page";
import { useUpdateClerkUser } from "./_hooks/use-mutations";
import { CreateOrUpdateClerkUserForm } from "../../_components/create-or-update.form";
import { useParams } from "next/navigation";
import { useGetClerkUserByIdQuery } from "../_hooks/use-queries";

export default function UpdateUserPage() {
    const { id } = useParams<{ id: string }>();
    const { mutateAsync, isPending } = useUpdateClerkUser();
    const { data, isLoading } = useGetClerkUserByIdQuery(id);
    const user = data?.data;

    return (
        <Page
            isLoading={isLoading}
            title="Ubah Pengguna"
            description="Halaman untuk mengubah informasi pengguna dalam sistem."
            className="max-w-3xl mx-auto mt-3"
        >
            <CreateOrUpdateClerkUserForm onSubmit={async (values) => {
                await mutateAsync({ payload: values, id });
            }} isLoading={isPending} defaultValues={{
                emailAddress: user?.emailAddresses[0].emailAddress || "",
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
            }} />
        </Page>
    )
}