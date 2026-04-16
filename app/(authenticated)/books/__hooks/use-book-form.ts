import { CreateOrUpdateBookSchema, TCreateOrUpdateBook } from "@/schemas/book.schema";
import { useForm } from "@tanstack/react-form";

interface Params {
  defaultValues: TCreateOrUpdateBook;
  onSubmit: (data: TCreateOrUpdateBook) => Promise<void>;
}

export const useBookForm = ({ defaultValues, onSubmit }: Params) => {
  return useForm({
    defaultValues,
    validators: {
      onChange: CreateOrUpdateBookSchema,
      onSubmit: CreateOrUpdateBookSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
};