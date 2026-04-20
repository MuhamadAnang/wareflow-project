// app/(authenticated)/books/__hooks/use-book-form.ts
import { CreateOrUpdateBookSchema, TCreateOrUpdateBook } from "@/schemas/book.schema";
import { useForm } from "@tanstack/react-form";

interface Params {
  defaultValues: Partial<TCreateOrUpdateBook>;
  onSubmit: (data: TCreateOrUpdateBook) => Promise<void>;
}

export const useBookForm = ({ defaultValues, onSubmit }: Params) => {
  return useForm({
    defaultValues: {
      code: "",
      subjectId: 0,
      grade: 0,
      level: "",
      curriculum: "",
      semester: "GANJIL",
      pages: null,
      productionYear: null,
      percetakanId: 0,
      ...defaultValues,        // override jika ada
    } as TCreateOrUpdateBook,

    validators: {
      onChange: CreateOrUpdateBookSchema,
      onSubmit: CreateOrUpdateBookSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
};