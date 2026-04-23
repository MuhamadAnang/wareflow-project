import { z } from "zod";

export const SupplierReturnItemSchema = z.object({
  bookId: z.number().int().positive(),
  quantity: z.number().int().positive("Quantity harus lebih dari 0"),
});

export const CreateSupplierReturnSchema = z.object({
  supplierId: z.number().int().positive(),
  returnDate: z.coerce.date(),
  reason: z.string().max(500).optional().nullable(),
  items: z.array(SupplierReturnItemSchema).min(1, "Minimal satu item"),
});

export const IndexSupplierReturnQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  sort: z.record(z.enum(["asc", "desc"])).optional(),
  supplierId: z.coerce.number().int().positive().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type TCreateSupplierReturn = z.infer<typeof CreateSupplierReturnSchema>;
export type TIndexSupplierReturnQuery = z.infer<typeof IndexSupplierReturnQuerySchema>;