import { useState } from "react";
import { Button } from "@/app/_components/ui/button"
import { useDeleteClerkUser } from "../_hooks/use-mutations"
import { Trash } from "lucide-react";
import { DeleteConfirmationDialog } from "./delete-confirmation.dialog";

interface IProps {
    id: string
    userLabel?: string
}

export const DeleteUserButton = ({ id, userLabel }: IProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { mutateAsync, isPending } = useDeleteClerkUser();

    const handleDelete = async () => {
        await mutateAsync({ id });
        setIsDialogOpen(false);
    };

    return (
        <>
            <Button
                variant={"outline"}
                onClick={() => setIsDialogOpen(true)}
                disabled={isPending}
                aria-label="Hapus pengguna"
            >
                <Trash className="text-destructive" />
            </Button>
            <DeleteConfirmationDialog
                isOpen={isDialogOpen}
                isDeleting={isPending}
                userLabel={userLabel}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
            />
        </>
    )
}
