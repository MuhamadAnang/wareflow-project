import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import { z } from "zod";

export const CreateOrUpdatePercetakanSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Name harus diisi")
    .max(255, "Nama harus kurang dari 255 karakter"),
  phone: z
    .string()
    .trim()
    .nonempty("No HP harus diisi")
    .max(20, "No HP harus kurang dari 20 karakter")
    .refine((value) => {
      const phoneRegex = /^0\d{9,14}$/;
      return phoneRegex.test(value);
    }, "No HP tidak valid"),
  address: z
    .string()
    .trim()
    .nonempty("Alamat harus diisi")
    .max(500, "Alamat harus kurang dari 500 karakter"),
});

export type TCreateOrUpdatePercetakan = z.infer<typeof CreateOrUpdatePercetakanSchema>;

// For pagination and filtering
export const IndexPercetakanQuerySchema = IndexQueryParams.extend({
  sort: createSortSchema(["name"]),
});

export type TIndexPercetakanQuery = z.infer<typeof IndexPercetakanQuerySchema>;
