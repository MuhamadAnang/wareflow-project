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
import { bookLevelEnum, curriculumEnum } from "@/drizzle/schema";
import { toTitleCase } from "@/lib/utils";
import { useBookTitleForm } from "../__hooks/use-book-title-form";

interface Props {
  form: ReturnType<typeof useBookTitleForm>;
  isPending?: boolean;
  subjects: { id: number; name: string }[]; 
  buttonText?: string;
}

export const CreateOrUpdateForm = ({ form, isPending, subjects, buttonText = "Simpan Judul Buku" }: Props) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
    >
      <FieldGroup>
        <form.Field
          name="subjectId"
          
          //   eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>Mata Pelajaran</FieldLabel>
                <Select
                  value={field.state.value?.toString()}
                  onValueChange={(value) => field.handleChange(Number(value))}
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="grade"
          //   eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>Kelas</FieldLabel>
                <Input
                  type="number"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  onBlur={field.handleBlur}
                  min={1}
                  max={12}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="level" 
          //   eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>Level</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as (typeof bookLevelEnum.enumValues)[number])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookLevelEnum.enumValues.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="curriculum"
          
          //   eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>Kurikulum</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as (typeof curriculumEnum.enumValues)[number])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kurikulum" />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculumEnum.enumValues.map((cur) => (
                      <SelectItem key={cur} value={cur}>
                        {toTitleCase(cur.replace(/_/g, " "))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <Button type="submit" isLoading={isPending || form.state.isSubmitting}>
          {buttonText}
        </Button>
      </FieldGroup>
    </form>
  );
};