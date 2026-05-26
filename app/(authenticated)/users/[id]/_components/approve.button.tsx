"use client";

import { useParams } from "next/navigation";
import { useActionApprovalUser } from "../_hooks/use-mutations";
import { Button } from "@/app/_components/ui/button";

export const ApproveButton = () => {
    const { id } = useParams<{ id: string }>();

    const { mutateAsync, isPending } = useActionApprovalUser();

    return (
        <Button onClick={() => mutateAsync({ id, payload: { action: "approve" } })} disabled={isPending} isLoading={isPending}>
            Approve
        </Button>
    )
}