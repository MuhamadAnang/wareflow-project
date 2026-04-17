import { customerStatusEnum } from "@/drizzle/schema";
import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const CreateOrUpdateCustomerSchema = z.object({
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
  institution: z
    .string()
    .trim()
    .nonempty("Institusi/Sekolah harus diisi")
    .max(255, "Institusi/Sekolah harus kurang dari 255 karakter"),
  status: z.enum(customerStatusEnum.enumValues),
});

export type TCreateOrUpdateCustomer = z.infer<typeof CreateOrUpdateCustomerSchema>;

// For pagination and filtering
export const IndexCustomerQuerySchema = IndexQueryParams.extend({
  sort: createSortSchema(["name"]),
  status: z.enum(customerStatusEnum.enumValues).optional(),
});

export type TIndexCustomerQuery = z.infer<typeof IndexCustomerQuerySchema>;
