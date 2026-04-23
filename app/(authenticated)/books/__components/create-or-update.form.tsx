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
import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateSubjectModal } from "./create-subject-modal";

interface Props {
  form: ReturnType<typeof useBookForm>;
  isPending?: boolean;
  subjects: { id: number; name: string }[];
  percetakans: { id: number; name: string }[];
  onSubjectCreated?: (newSubjectId: number) => void;
}

export const BookForm = ({ form, isPending, subjects, percetakans, onSubjectCreated }: Props) => {
  const [showSubjectModal, setShowSubjectModal] = useState(false);
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
              <div className="flex gap-2">
                <Select
                  value={field.state.value?.toString() || ""}
                  onValueChange={(val) => field.handleChange(Number(val))}
                >
                  <SelectTrigger className="flex-1">
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

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSubjectModal(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
        {/* Upload Gambar */}
        <form.Field name="image">
          {(field) => {
            // Preview state harus di luar Field callback
            // Tapi karena ini di dalam Field, kita pakai cara alternatif yang aman
            const currentValue = field.state.value;

            return (
              <Field>
                <FieldLabel>Gambar Cover Buku</FieldLabel>

                {/* Preview */}
                {currentValue && !(currentValue instanceof File && !currentValue.size) && (
                  <div className="mb-4">
                    <img
                      src={
                        currentValue instanceof File
                          ? URL.createObjectURL(currentValue)
                          : typeof currentValue === "string" && currentValue !== ""
                            ? currentValue
                            : undefined
                      }
                      alt="Preview Cover"
                      className="w-40 h-52 object-cover rounded-lg border shadow-sm"
                    />
                  </div>
                )}

                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    field.handleChange(file);   // Kirim File object ke form
                  }}
                />

                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WebP • Maksimal 2MB
                </p>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            );
          }}
        </form.Field>
        <Button type="submit" disabled={isPending || form.state.isSubmitting}>
          {isPending ? "Menyimpan..." : "Simpan Buku"}
        </Button>
      </FieldGroup>
      <CreateSubjectModal
        open={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        onSuccess={(newId) => {
          onSubjectCreated?.(newId);
          setShowSubjectModal(false);
        }}
      />
    </form>
  );
};