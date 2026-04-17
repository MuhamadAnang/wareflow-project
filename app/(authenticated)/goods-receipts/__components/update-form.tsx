"use client";

import { Button } from "@/app/_components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Plus, Trash } from "lucide-react";

interface UpdateFormProps {
  form: any;
  books: { id: number; displayTitle: string }[];
  isPending?: boolean;
}

export function GoodsReceiptUpdateForm({ form, books, isPending }: UpdateFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <FieldGroup>
        <form.Field name="receivedDate">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>Tanggal Terima *</FieldLabel>
                <Input
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Items */}
        <form.Field name="items">
          {(itemsField) => {
            const isInvalid = itemsField.state.meta.isTouched && !itemsField.state.meta.isValid;
            const items = itemsField.state.value;

            // Handler sebagai fungsi biasa (bukan hook)
            const handleBookChange = (index: number, value: string) => {
              const newItems = [...items];
              newItems[index] = { ...newItems[index], bookId: Number(value) };
              itemsField.setValue(newItems);
            };

            const handleQuantityChange = (index: number, value: string) => {
              const newItems = [...items];
              newItems[index] = { ...newItems[index], quantity: Number(value) };
              itemsField.setValue(newItems);
            };

            const addItem = () => {
              itemsField.pushValue({ bookId: 0, quantity: 1 });
            };

            const removeItem = (index: number) => {
              const newItems = items.filter((_: any, i: number) => i !== index);
              itemsField.setValue(newItems);
            };

            return (
              <Field>
                <div className="flex justify-between items-center mb-3">
                  <FieldLabel>Daftar Barang *</FieldLabel>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Item
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  {items.map((item: any, index: number) => (
                    <div
                      key={`${item.bookId}-${index}`}
                      className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-end"
                    >
                      <div className="col-span-7">
                        <FieldLabel>Buku *</FieldLabel>
                        <Select
                          value={item.bookId?.toString() ?? "0"}
                          onValueChange={(value) => handleBookChange(index, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Buku" />
                          </SelectTrigger>
                          <SelectContent>
                            {books.map((book) => (
                              <SelectItem key={book.id} value={book.id.toString()}>
                                {book.displayTitle}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-3">
                        <FieldLabel>Jumlah *</FieldLabel>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity ?? 1}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                      </div>

                      <div className="col-span-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {isInvalid && <FieldError errors={itemsField.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="note">
          {(field) => (
            <Field>
              <FieldLabel>Catatan</FieldLabel>
              <Textarea
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Catatan tambahan (opsional)"
                rows={3}
              />
            </Field>
          )}
        </form.Field>
        <Button type="submit" isLoading={isPending}>
          {isPending ? "Menyimpan..." : "Perbarui"}
        </Button>
      </FieldGroup>
    </form>
  );
}
