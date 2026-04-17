"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { useSupplierForm } from "../__hooks/use-supplier-form";

interface Props {
  form: ReturnType<typeof useSupplierForm>;
  isPending?: boolean;
}

export const CreateOrUpdateForm = ({ form, isPending }: Props) => {
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
                <FieldLabel>Nama</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="John Doe"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="phone"
          // eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel>No Handphone</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    field.handleChange(rawValue);
                  }}
                  aria-invalid={isInvalid}
                  placeholder="08xxx"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="address"
          // eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel>Alamat</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Jl. Merdeka No. 123, Jakarta"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <Button isLoading={isPending || form.state.isSubmitting}>Buat Supplier</Button>
      </FieldGroup>
    </form>
  );
};
