"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { semesterEnum } from "@/drizzle/schema";
import { useBookForm } from "../__hooks/use-book-form";

interface Props {
  form: ReturnType<typeof useBookForm>;
  isPending?: boolean;
  bookTitles: { id: number; displayTitle: string }[]; // dari query
  suppliers: { id: number; name: string }[]; // dari query
}

export const BookForm = ({ form, isPending, bookTitles, suppliers }: Props) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
    >
      <FieldGroup>
        {/* Code */}
        <form.Field name="code">
          {(field) => (
            <Field>
              <FieldLabel>Kode Buku *</FieldLabel>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="BKT-001"
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        {/* Book Title Dropdown */}
        <form.Field name="bookTitleId">
          {(field) => (
            <Field>
              <FieldLabel>Judul Buku *</FieldLabel>
              <Select
                value={field.state.value?.toString()}
                onValueChange={(val) => field.handleChange(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih judul buku" />
                </SelectTrigger>
                <SelectContent>
                  {bookTitles.map((bt) => (
                    <SelectItem key={bt.id} value={bt.id.toString()}>
                      {bt.displayTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        {/* Supplier Dropdown */}
        <form.Field name="supplierId">
          {(field) => (
            <Field>
              <FieldLabel>Penerbit *</FieldLabel>
              <Select
                value={field.state.value?.toString()}
                onValueChange={(val) => field.handleChange(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penerbit" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        {/* Semester */}
        <form.Field name="semester">
          {(field) => (
            <Field>
              <FieldLabel>Semester *</FieldLabel>
              <RadioGroup
                value={field.state.value}
                onValueChange={(val) => field.handleChange(val)}
                className="flex gap-4"
              >
                {semesterEnum.enumValues.map((sem) => (
                  <div key={sem} className="flex items-center space-x-2">
                    <RadioGroupItem value={sem} id={sem} />
                    <label htmlFor={sem}>{sem}</label>
                  </div>
                ))}
              </RadioGroup>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        {/* Pages & Production Year */}
        <form.Field name="pages">
          {(field) => (
            <Field>
              <FieldLabel>Jumlah Halaman</FieldLabel>
              <Input
                type="number"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : null)}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="productionYear">
          {(field) => (
            <Field>
              <FieldLabel>Tahun Terbit</FieldLabel>
              <Input
                type="number"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : null)}
              />
            </Field>
          )}
        </form.Field>

        <Button type="submit" disabled={isPending || form.state.isSubmitting}>
          {isPending ? "Menyimpan..." : "Simpan Buku"}
        </Button>
      </FieldGroup>
    </form>
  );
};