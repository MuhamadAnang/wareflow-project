import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import { z } from "zod";

export const CreatePurchaseOrderSchema = z.object({
  supplierId: z.number().int().positive("Supplier wajib dipilih"),
  orderDate: z.string().min(1, "Tanggal order wajib diisi"),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        bookId: z.number().int().positive(),
        quantity: z.number().int().positive("Quantity minimal 1"),
      })
    )
    .min(1, "Minimal harus ada 1 item"),
});

export type TCreatePurchaseOrder = z.infer<typeof CreatePurchaseOrderSchema>;

export const IndexPurchaseOrderQuerySchema = IndexQueryParams.extend({
  sort: createSortSchema(["supplierName", "orderDate"]),
  supplierId: z.coerce.number().int().positive().optional(),
});

export type TIndexPurchaseOrderQuery = z.infer<typeof IndexPurchaseOrderQuerySchema>;

export const UpdatePurchaseOrderSchema = CreatePurchaseOrderSchema;
export type TUpdatePurchaseOrder = TCreatePurchaseOrder;