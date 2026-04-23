import { z } from "zod";

export const CustomerReturnItemSchema = z.object({
  bookId: z.number().int().positive(),
  quantity: z.number().int().positive("Quantity harus lebih dari 0"),
});

export const CreateCustomerReturnSchema = z.object({
  customerId: z.number().int().positive(),
  returnDate: z.coerce.date(),
  reason: z.string().max(500).optional().nullable(),
  items: z.array(CustomerReturnItemSchema).min(1, "Minimal satu item"),
});

export const IndexCustomerReturnQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  sort: z.record(z.enum(["asc", "desc"])).optional(),
  customerId: z.coerce.number().int().positive().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type TCreateCustomerReturn = z.infer<typeof CreateCustomerReturnSchema>;
export type TIndexCustomerReturnQuery = z.infer<typeof IndexCustomerReturnQuerySchema>;