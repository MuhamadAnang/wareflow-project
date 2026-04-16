import { subjectTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexSubjectQuery } from "@/schemas/subject.schema";
import { TNewSubject, TUpdateSubject } from "@/types/database";
import { eq, isNull } from "drizzle-orm";

export const createSubjectRepository = async (data: TNewSubject) => {
  return await db.insert(subjectTable).values(data).returning();
};

const SUBJECT_COLUMNS: TColumnsDefinition<typeof subjectTable> = {
  name: { searchable: true, sortable: true },
  // tambah kolom lain jika nanti ada createdAt / updatedAt yang mau difilter
};

export const getSubjectsWithPaginationRepository = async (queryParams: TIndexSubjectQuery) => {
  return await buildPaginatedQuery({
    table: subjectTable,
    columns: SUBJECT_COLUMNS,
    queryParams,
    baseConditions: [isNull(subjectTable.deletedAt)],
  });
};

export const getSubjectsCountRepository = async (queryParams: TIndexSubjectQuery) => {
  return await buildCountQuery({
    table: subjectTable,
    columns: SUBJECT_COLUMNS,
    queryParams,
    baseConditions: [isNull(subjectTable.deletedAt)],
  });
};

export const getSubjectByIdRepository = async (id: number) => {
  return await db.select().from(subjectTable).where(eq(subjectTable.id, id));
};

export const updateSubjectByIdRepository = async (id: number, data: TUpdateSubject) => {
  return await db
    .update(subjectTable)
    .set(data)
    .where(eq(subjectTable.id, id))
    .returning();
};

export const deleteSubjectByIdRepository = async (id: number) => {
  return await db
    .update(subjectTable)
    .set({ deletedAt: new Date() })
    .where(eq(subjectTable.id, id))
    .returning();
};