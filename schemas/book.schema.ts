import { z } from "zod";
import { semesterEnum } from "@/drizzle/schema";

export const CreateOrUpdateBookSchema = z.object({
  code: z.string().min(3).max(50).trim(),
  bookTitleId: z.number().int().positive(),
  supplierId: z.number().int().positive(),
  semester: z.enum(semesterEnum.enumValues),
  pages: z.number().int().positive().min(1).max(2000).optional(),
  productionYear: z.number().int().min(1900).max(new Date().getFullYear() + 10).optional(),
});

export type TCreateOrUpdateBook = z.infer<typeof CreateOrUpdateBookSchema>;

export const IndexBookQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sort: z.string().optional(), // e.g. "code:asc", "productionYear:desc"
  bookTitleId: z.coerce.number().int().positive().optional(),
  supplierId: z.coerce.number().int().positive().optional(),
  semester: z.enum(semesterEnum.enumValues).optional(),
});

export type TIndexBookQuery = z.infer<typeof IndexBookQuerySchema>;