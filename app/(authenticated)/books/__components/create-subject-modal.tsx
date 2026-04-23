"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import { useState } from "react";
import { useCreateSubjectMutation } from "../__hooks/use-create-subject.mutation";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (newSubjectId: number) => void;
}

export function CreateSubjectModal({ open, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useCreateSubjectMutation();

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const result = await mutateAsync({ name: name.trim() });
    onSuccess(result.data.id);   // asumsi backend return { data: { id, name } }
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Mata Pelajaran Baru</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            placeholder="Nama Mata Pelajaran (contoh: Matematika)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isPending || !name.trim()}
              className="flex-1"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}