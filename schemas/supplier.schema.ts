import { createSortSchema } from "@/lib/validation";
import z from "zod";

export const CreateOrUpdateSupplierSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Nama harus diisi")
    .max(255, "Nama harus kurang dari 255 karakter"),
  phone: z
    .string()
    .trim()
    .nonempty("No Handphone harus diisi")
    .max(20, "No Handphone harus kurang dari 20 karakter")
    .refine((value) => {
      const phoneRegex = /^0\d{9,14}$/;
      return phoneRegex.test(value);
    }, "No Handphone tidak valid"),
  address: z
    .string()
    .trim()
    .nonempty("Alamat harus diisi")
    .max(500, "Alamat harus kurang dari 500 karakter"),
});

export type TCreateOrUpdateSupplier = z.infer<typeof CreateOrUpdateSupplierSchema>;

// Untuk list + pagination + search
export const IndexSupplierQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  limit: z.coerce.number().int().min(1).max(500).default(20).optional(),
  search: z.string().optional(),
  sort: createSortSchema(["name"]),
});

export type TIndexSupplierQuery = z.infer<typeof IndexSupplierQuerySchema>;
