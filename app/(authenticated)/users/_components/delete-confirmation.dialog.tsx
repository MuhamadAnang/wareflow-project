"use client";

import { Button } from "@/app/_components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/_components/ui/dialog";
import { TriangleAlert } from "lucide-react";

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    isDeleting?: boolean;
    userLabel?: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
}

export const DeleteConfirmationDialog = ({
    isOpen,
    isDeleting = false,
    userLabel,
    onOpenChange,
    onConfirm,
}: DeleteConfirmationDialogProps) => {
    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <TriangleAlert className="size-5" />
                    </div>
                    <DialogTitle>Hapus pengguna?</DialogTitle>
                    <DialogDescription>
                        {userLabel
                            ? `Pengguna "${userLabel}" akan dihapus permanen dari sistem.`
                            : "Pengguna ini akan dihapus permanen dari sistem."}{" "}
                        Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>
                            Batal
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        isLoading={isDeleting}
                    >
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
