"use client";

import { CreateOrUpdateSubjectSchema, TCreateOrUpdateSubject } from "@/schemas/subject.schema";
import { useForm } from "@tanstack/react-form";


interface Params {
  defaultValues?: TCreateOrUpdateSubject;
  onSubmit: (data: TCreateOrUpdateSubject) => Promise<void>;
}

export const useSubjectForm = ({ defaultValues, onSubmit }: Params) => {
  return useForm({
    defaultValues,
    validators: {
      onChange: CreateOrUpdateSubjectSchema,
      onSubmit: CreateOrUpdateSubjectSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
};
