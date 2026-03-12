import { customerStatusEnum } from "@/drizzle/schema";
import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const CreateOrUpdateCustomerSchema = z.object({
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
  school: z
    .string()
    .trim()
    .nonempty("School is required")
    .max(255, "School must be less than 255 characters"),
  status: z.enum(customerStatusEnum.enumValues),
});

export type TCreateOrUpdateCustomer = z.infer<typeof CreateOrUpdateCustomerSchema>;

// For pagination and filtering
export const IndexCustomerQuerySchema = IndexQueryParams.extend({
  sort: createSortSchema(["name"]),
  status: z.enum(customerStatusEnum.enumValues).optional(),
});

export type TIndexCustomerQuery = z.infer<typeof IndexCustomerQuerySchema>;
