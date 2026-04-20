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
import { semesterEnum, bookLevelEnum, curriculumEnum } from "@/drizzle/schema";
import { useBookForm } from "../__hooks/use-book-form";

interface Props {
  form: ReturnType<typeof useBookForm>;
  isPending?: boolean;
  subjects: { id: number; name: string }[];
  percetakans: { id: number; name: string }[];
}

export const BookForm = ({ form, isPending, subjects, percetakans }: Props) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(e); }}>
      <FieldGroup>
        {/* Kode Buku */}
        <form.Field name="code">
          {(field) => (
            <Field>
              <FieldLabel>Kode Buku *</FieldLabel>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="MTK-7-KM-2025-001"
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        {/* Subject */}
        <form.Field name="subjectId">
          {(field) => (
            <Field>
              <FieldLabel>Mata Pelajaran *</FieldLabel>
              <Select
                value={field.state.value?.toString()}
                onValueChange={(val) => field.handleChange(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mata pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
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

        {/* Grade */}
        <form.Field name="grade">
          {(field) => (
            <Field>
              <FieldLabel>Kelas *</FieldLabel>
              <Input
                type="number"
                value={field.state.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") return; // Tidak update jika kosong
                  field.handleChange(Number(val));
                }}
                placeholder="7"
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        {/* Level */}
        <form.Field name="level">
          {(field) => (
            <Field>
              <FieldLabel>Level *</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(val) =>
                  field.handleChange(val as typeof bookLevelEnum.enumValues[number])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih level" />
                </SelectTrigger>
                <SelectContent>
                  {bookLevelEnum.enumValues.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        {/* Curriculum */}
        <form.Field name="curriculum">
          {(field) => (
            <Field>
              <FieldLabel>Kurikulum *</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(val) =>
                  field.handleChange(val as typeof curriculumEnum.enumValues[number])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kurikulum" />
                </SelectTrigger>
                <SelectContent>
                  {curriculumEnum.enumValues.map((cur) => (
                    <SelectItem key={cur} value={cur}>
                      {cur.replace(/_/g, " ")}
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
                onValueChange={(val) =>
                  field.handleChange(val as typeof semesterEnum.enumValues[number])
                }
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

        {/* Percetakan */}
        <form.Field name="percetakanId">
          {(field) => (
            <Field>
              <FieldLabel>Percetakan / Penerbit *</FieldLabel>
              <Select
                value={field.state.value?.toString()}
                onValueChange={(val) => field.handleChange(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih percetakan" />
                </SelectTrigger>
                <SelectContent>
                  {percetakans.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <FieldError errors={field.state.meta.errors} />
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
              <FieldError errors={field.state.meta.errors} />
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