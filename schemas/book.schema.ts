import { z } from "zod";
import {
  bookLevelEnum,
  curriculumEnum,
  semesterEnum,
} from "@/drizzle/schema";

export const CreateOrUpdateBookSchema = z.object({
  code: z.string()
    .min(3, "Kode buku minimal 3 karakter")
    .max(50, "Kode buku maksimal 50 karakter")
    .trim()
    .regex(/^[A-Z0-9-]+$/, "Kode hanya boleh huruf besar, angka, dan strip (-)"),
  name: z.string().optional(), 
  subjectId: z.number().int().positive("Mata pelajaran wajib dipilih"),
  grade: z.number().int().min(1, "Kelas minimal 1").max(12, "Kelas maksimal 12"),
  level: z.enum(bookLevelEnum.enumValues, { message: "Level tidak valid" }),
  curriculum: z.enum(curriculumEnum.enumValues, { message: "Kurikulum tidak valid" }),
  semester: z.enum(semesterEnum.enumValues, { message: "Semester tidak valid" }),
  image: z.string().url("URL gambar tidak valid").optional().nullable()
    .or(z.literal("")),
  pages: z.number().int().positive().min(1).max(2000).optional().nullable(),
  productionYear: z.number().int()
    .min(1900, "Tahun terbit minimal 1900")
    .max(new Date().getFullYear() + 5, "Tahun terbit maksimal 5 tahun ke depan")
    .optional().nullable(),
  percetakanId: z.number().int().positive("Percetakan wajib dipilih"),
});

export type TCreateOrUpdateBook = z.infer<typeof CreateOrUpdateBookSchema>;

// ====================== QUERY SCHEMA ======================

export const IndexBookQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sort: z.string().optional(), 
  subjectId: z.coerce.number().int().positive().optional(),
  grade: z.coerce.number().int().min(1).max(12).optional(),
  level: z.enum(bookLevelEnum.enumValues).optional(),
  curriculum: z.enum(curriculumEnum.enumValues).optional(),
  semester: z.enum(semesterEnum.enumValues).optional(),
  percetakanId: z.coerce.number().int().positive().optional(),
});

export type TIndexBookQuery = z.infer<typeof IndexBookQuerySchema>;