"use client";

import { useParams } from "next/navigation";
import { useActionApprovalUser } from "../_hooks/use-mutations";
import { Button } from "@/app/_components/ui/button";

export const RejectButton = () => {
    const { id } = useParams<{ id: string }>();

    const { mutateAsync, isPending } = useActionApprovalUser();

    return (
        <Button variant={"destructive"} onClick={() => mutateAsync({ id, payload: { action: "reject" } })} disabled={isPending} isLoading={isPending}>
            Reject
        </Button>
    )
}