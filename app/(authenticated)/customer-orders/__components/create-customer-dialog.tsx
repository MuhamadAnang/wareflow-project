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
import { customerStatusEnum } from "@/drizzle/schema";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useCreateCustomerQuickMutation } from "../__hooks/use-create-customer-quick.mutation";
import { useCustomerForm } from "../../customers/__hooks/use-customer-form";
import { CreateOrUpdateForm } from "../../customers/__components/create-or-update.form";
import { toast } from "sonner";

interface Props {
  onCustomerCreated: (customerId: number) => void;
}

export const CreateCustomerDialog = ({ onCustomerCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateCustomerQuickMutation();
  const hasCalledCallback = useRef(false);

  const form = useCustomerForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      institution: "",
      status: customerStatusEnum.enumValues[0],
    },
    onSubmit: async (values) => {
      const response = await mutateAsync(values);
      const newCustomerId = response?.data?.data?.id ?? null;
  
      if (!newCustomerId) {
        toast.error("Gagal mendapatkan ID customer dari server");
        return;
      }
  
      // Guard: pastikan hanya dipanggil sekali
      if (hasCalledCallback.current) return;
      hasCalledCallback.current = true;
  
      setOpen(false);
      onCustomerCreated(newCustomerId);
      toast.success("Customer berhasil ibuat");
      
      // Reset flag setelah dialog tutup
      setTimeout(() => { hasCalledCallback.current = false; }, 500);
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
          <Plus className="h-4 w-4 mr-1" /> New Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Customer Baru</DialogTitle>
          <DialogDescription>
            Isi data customer di bawah. Setelah berhasil, customer akan otomatis terpilih di order.
          </DialogDescription>
        </DialogHeader>
        <CreateOrUpdateForm form={form} isPending={isPending} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
