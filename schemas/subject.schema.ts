import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const CreateOrUpdateSubjectSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Nama mata pelajaran wajib diisi")
    .max(100, "Nama maksimal 100 karakter")
    .refine(
      (val) => val === val.toUpperCase() || val === val.toLowerCase() || /^[A-Z][a-z]/.test(val),
      "Format penulisan disarankan: Title Case atau UPPERCASE",
    ),
});

export type TCreateOrUpdateSubject = z.infer<typeof CreateOrUpdateSubjectSchema>;

// Untuk list + filter + pagination
export const IndexSubjectQuerySchema = IndexQueryParams.extend({
    sort: createSortSchema(["name"]),
  // bisa ditambah filter lain nanti jika perlu, misal: active: z.boolean().optional()
});

export type TIndexSubjectQuery = z.infer<typeof IndexSubjectQuerySchema>;