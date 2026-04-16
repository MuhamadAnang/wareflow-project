import { z } from "zod";

// Schema untuk item goods out
export const GoodsOutItemSchema = z.object({
  bookId: z.number().int().positive(),
  quantity: z.number().int().positive("Quantity harus lebih dari 0"),
});

// Schema untuk create goods out
export const CreateGoodsOutSchema = z.object({
  customerOrderId: z.number().int().positive(),
  shippedDate: z.coerce.date(),
  note: z.string().max(500).optional().nullable(),
  items: z.array(GoodsOutItemSchema).min(1, "Minimal satu item"),
});

// Schema untuk query params (pagination, filter)
export const IndexGoodsOutQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  sort: z.record(z.enum(["asc", "desc"])).optional(),
  customerOrderId: z.coerce.number().int().positive().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type TCreateGoodsOut = z.infer<typeof CreateGoodsOutSchema>;
export type TGoodsOutItemInput = z.infer<typeof GoodsOutItemSchema>;
export type TIndexGoodsOutQuery = z.infer<typeof IndexGoodsOutQuerySchema>;