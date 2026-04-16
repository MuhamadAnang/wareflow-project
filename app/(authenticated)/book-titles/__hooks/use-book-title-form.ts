"use client";

import { useForm } from "@tanstack/react-form";
import {
  CreateOrUpdateBookTitleSchema,
  TCreateOrUpdateBookTitle,
} from "@/schemas/book-title.schema";
import { bookLevelEnum, curriculumEnum } from "@/drizzle/schema";

interface Params {
  defaultValues: TCreateOrUpdateBookTitle;
  onSubmit: (data: TCreateOrUpdateBookTitle) => Promise<void>;
}

export const useBookTitleForm = ({ defaultValues, onSubmit }: Params) => {
  return useForm({
    defaultValues,
    validators: {
      onChange: CreateOrUpdateBookTitleSchema,
      onSubmit: CreateOrUpdateBookTitleSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
        level: value.level as (typeof bookLevelEnum.enumValues)[number],
        curriculum: value.curriculum as (typeof curriculumEnum.enumValues)[number],
      });
    },
  });
};
