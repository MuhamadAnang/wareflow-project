"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Textarea } from "@/app/_components/ui/textarea";
import { customerStatusEnum } from "@/drizzle/schema";
import { toTitleCase } from "@/lib/utils";
import { useCustomerForm } from "../__hooks/use-customer-form";

interface Props {
  form: ReturnType<typeof useCustomerForm>;
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
                <FieldLabel>Name</FieldLabel>
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
                <FieldLabel>Phone</FieldLabel>
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
          name="school"
          // eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel>School</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="SMA Negeri 1 XYZ"
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
                <FieldLabel>Address</FieldLabel>
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
        <form.Field
          name="status"
          //   eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel>Status</FieldLabel>
                <RadioGroup
                  className="grid grid-cols-3"
                  onValueChange={(value) =>
                    field.handleChange(value as (typeof customerStatusEnum.enumValues)[number])
                  }
                  defaultValue={field.state.value}
                >
                  {customerStatusEnum.enumValues.map((status) => (
                    <FieldLabel key={status} htmlFor={`form-tanstack-radiogroup-${status}`}>
                      <Field orientation="horizontal" data-invalid={isInvalid}>
                        <FieldContent>
                          <FieldTitle>{toTitleCase(status)}</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem
                          value={status}
                          id={`form-tanstack-radiogroup-${status}`}
                          aria-invalid={isInvalid}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        ></form.Field>
        <Button isLoading={isPending || form.state.isSubmitting}>Create Customer</Button>
      </FieldGroup>
    </form>
  );
};
