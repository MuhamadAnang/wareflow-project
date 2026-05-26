"use client";

import { Button } from "@/app/_components/ui/button";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import {
  CreateOrUpdateClerkUserSchema,
  TCreateOrUpdateClerkUserSchema,
} from "@/schemas/clerk.schema";
import { useForm } from "@tanstack/react-form";

interface IProps {
  defaultValues?: TCreateOrUpdateClerkUserSchema;
  onSubmit: (values: TCreateOrUpdateClerkUserSchema) => Promise<void>;
  isLoading?: boolean;
}

export const CreateOrUpdateClerkUserForm = ({ defaultValues, onSubmit, isLoading }: IProps) => {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
    validators: {
      onSubmit: CreateOrUpdateClerkUserSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <Field orientation={"horizontal"}>
        <form.Field name="firstName">
          {(field) => (
            <Field>
              <FieldLabel>Nama Depan *</FieldLabel>
              <Input
                type="text"
                value={field.state.value?.toString() || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Masukkan nama depan"
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
        <form.Field name="lastName">
          {(field) => (
            <Field>
              <FieldLabel>Nama Belakang *</FieldLabel>
              <Input
                type="text"
                value={field.state.value?.toString() || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Masukkan nama belakang"
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
      </Field>
      <Field>
        <form.Field name="emailAddress">
          {(field) => (
            <Field>
              <FieldLabel>Email *</FieldLabel>
              <Input
                type="email"
                value={field.state.value?.toString() || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Masukkan email"
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
      </Field>
      <Field>
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </Field>
    </form>
  );
};
