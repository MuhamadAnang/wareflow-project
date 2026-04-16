import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

import { bookLevelEnum, curriculumEnum } from "@/drizzle/schema";

export const CreateOrUpdateBookTitleSchema = z.object({
  subjectId: z.number().int().positive("Mata pelajaran wajib dipilih"),
  grade: z.number().int().min(1, "Kelas minimal 1").max(12, "Kelas maksimal 12"),
  level: z.enum(bookLevelEnum.enumValues),
  curriculum: z.enum(curriculumEnum.enumValues),
});

export type TCreateOrUpdateBookTitle = z.infer<typeof CreateOrUpdateBookTitleSchema>;

export const IndexBookTitleQuerySchema = IndexQueryParams.extend({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  limit: z.coerce.number().int().min(1).max(500).default(20).optional(),
  search: z.string().optional(),
  sort: createSortSchema(["grade"]),
  subjectId: z.number().int().positive().optional(),
  level: z.enum(bookLevelEnum.enumValues).optional(),
  curriculum: z.enum(curriculumEnum.enumValues).optional(),
});

export type TIndexBookTitleQuery = z.infer<typeof IndexBookTitleQuerySchema>;
