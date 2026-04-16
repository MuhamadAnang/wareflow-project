import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import { z } from "zod";

export const CreateGoodsReceiptSchema = z.object({
  purchaseOrderId: z.number().int().positive("Purchase Order wajib dipilih"),
  receivedDate: z.string().min(1, "Tanggal terima wajib diisi"),
  note: z.string().optional(),
  items: z.array(
    z.object({
      bookId: z.number().int().positive(),
      quantity: z.number().int().positive("Quantity minimal 1"),
    })
  ).min(1, "Minimal harus ada 1 item"),
});

export type TCreateGoodsReceipt = z.infer<typeof CreateGoodsReceiptSchema>;

// Schema untuk update (sama dengan create, tapi purchaseOrderId tidak bisa diubah)
export const UpdateGoodsReceiptSchema = z.object({
  receivedDate: z.string().min(1, "Tanggal terima wajib diisi"),
  note: z.string().optional(),
  items: z.array(
    z.object({
      bookId: z.number().int().positive(),
      quantity: z.number().int().positive("Quantity minimal 1"),
    })
  ).min(1, "Minimal harus ada 1 item"),
});

export type TUpdateGoodsReceipt = z.infer<typeof UpdateGoodsReceiptSchema>;

export const IndexGoodsReceiptQuerySchema = IndexQueryParams.extend({
  sort: createSortSchema(["supplierName", "receivedDate"]),
  search: z.string().optional(),
});

export type TIndexGoodsReceiptQuery = z.infer<typeof IndexGoodsReceiptQuerySchema>;