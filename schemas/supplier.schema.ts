// import { createSortSchema } from "@/lib/validation";
// import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const CreateOrUpdateSupplierSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Name is required")
    .max(255, "Name must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .nonempty("Phone is required")
    .max(20, "Phone must be less than 20 characters")
    .refine((value) => {
      const phoneRegex = /^0\d{9,14}$/;
      return phoneRegex.test(value);
    }, "Phone number is not valid"),
  address: z
    .string()
    .trim()
    .nonempty("Address is required")
    .max(500, "Address must be less than 500 characters"),
});

export type TCreateOrUpdateSupplier = z.infer<typeof CreateOrUpdateSupplierSchema>;

// Untuk list + pagination + search
export const IndexSupplierQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  limit: z.coerce.number().int().min(1).max(500).default(20).optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type TIndexSupplierQuery = z.infer<typeof IndexSupplierQuerySchema>;
