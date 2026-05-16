"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { bookLevelEnum, curriculumEnum, semesterEnum } from "@/drizzle/schema";
import { TCreateOrUpdateBook } from "@/schemas/book.schema";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { BookForm } from "../../books/__components/create-or-update.form";
import { useBookForm } from "../../books/__hooks/use-book-form";
import { useGetPercetakansQuery } from "../../books/__hooks/use-get-percetakans.query";
import { useGetSubjectsQuery } from "../../books/__hooks/use-get-subjects.query";
import { useCreateBookQuickMutation } from "../__hooks/use-create-book-quick.mutation";

interface Props {
  onBookCreated: (bookId: number) => void | Promise<void>;
}

export const CreateBookDialog = ({ onBookCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const hasCalledCallback = useRef(false);
  const { data: subjectsData, refetch: refetchSubjects } = useGetSubjectsQuery();
  const { data: percetakansData } = useGetPercetakansQuery();
  const { mutateAsync, isPending } = useCreateBookQuickMutation();

  const form = useBookForm({
    defaultValues: {
      code: "",
      subjectId: 0,
      grade: 0,
      level: bookLevelEnum.enumValues[0],
      curriculum: curriculumEnum.enumValues[0],
      semester: semesterEnum.enumValues[0],
      pages: null,
      productionYear: null,
      percetakanId: 0,
    } satisfies Partial<TCreateOrUpdateBook>,
    onSubmit: async (values) => {
      const response = await mutateAsync(values);
      const newBookId = response?.data?.data?.id ?? null;

      if (!newBookId) {
        toast.error("Gagal mendapatkan ID buku dari server");
        return;
      }

      if (hasCalledCallback.current) return;
      hasCalledCallback.current = true;

      setOpen(false);
      await onBookCreated(newBookId);
      toast.success("Buku berhasil dibuat");

      setTimeout(() => {
        hasCalledCallback.current = false;
      }, 500);
    },
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <Plus className="h-4 w-4 mr-1" /> New Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Buku Baru</DialogTitle>
          <DialogDescription>
            Isi detail buku di bawah. Setelah berhasil, buku akan otomatis terpilih di item order.
          </DialogDescription>
        </DialogHeader>
        <BookForm
          form={form}
          isPending={isPending}
          subjects={subjectsData ?? []}
          percetakans={percetakansData ?? []}
          onSubjectCreated={async (newSubjectId) => {
            await refetchSubjects();
            form.setFieldValue("subjectId", newSubjectId);
          }}
        />
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
