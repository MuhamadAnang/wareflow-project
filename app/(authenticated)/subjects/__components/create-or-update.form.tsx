"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { useSubjectForm } from "../__hooks/use-subject-form";

interface Props {
  form: ReturnType<typeof useSubjectForm>;
  isPending?: boolean;
  buttonText?: string;
}

export const CreateOrUpdateForm = ({ form, isPending, buttonText = "Simpan Mata Pelajaran" }: Props) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          // eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>Nama Mata Pelajaran</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Matematika"
                />
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