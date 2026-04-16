// server/book-titles/book-title.repository.ts

import { bookTitleTable, subjectTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexBookTitleQuery } from "@/schemas/book-title.schema";
import { TNewBookTitle, TUpdateBookTitle } from "@/types/database";
import { and, eq, isNull, sql } from "drizzle-orm";

// Cache subjects untuk mapping nama 

let subjectCache: { id: number; name: string }[] = [];
async function getSubjectCache() {
  if (subjectCache.length === 0) {
    subjectCache = await db
      .select({ id: subjectTable.id, name: subjectTable.name })
      .from(subjectTable)
      .where(isNull(subjectTable.deletedAt));
  }
  return subjectCache;
}

export const createBookTitleRepository = async (bookTitleData: TNewBookTitle) => {
  return await db.insert(bookTitleTable).values(bookTitleData).returning();
};

const BOOK_TITLE_COLUMNS: TColumnsDefinition<typeof bookTitleTable> = {
  grade: { sortable: true },
  level: { filterable: true },
  curriculum: { filterable: true },
  subjectId: { filterable: true },
};

export const getBookTitlesWithPaginationRepository = async (queryParams: TIndexBookTitleQuery) => {
  const baseConditions = [isNull(bookTitleTable.deletedAt)];

  if (queryParams.subjectId) {
    baseConditions.push(eq(bookTitleTable.subjectId, queryParams.subjectId));
  }
  if (queryParams.level) {
    baseConditions.push(eq(bookTitleTable.level, queryParams.level));
  }
  if (queryParams.curriculum) {
    baseConditions.push(eq(bookTitleTable.curriculum, queryParams.curriculum));
  }

  // Ambil entries dari builder (hanya kolom book_title)
  const entries = await buildPaginatedQuery({
    table: bookTitleTable,
    columns: BOOK_TITLE_COLUMNS,
    queryParams,
    baseConditions,
  });

  // Ambil cache subjects
  const subjects = await getSubjectCache();

  // Map untuk tambah subjectName & displayTitle
  return entries.map((row) => {
    const subject = subjects.find((s) => s.id === row.subjectId);
    const subjectName = subject ? subject.name : "Tidak Diketahui";

    return {
      ...row,
      subjectName,
      displayTitle: `${subjectName} Kelas ${row.grade} ${row.level} ${row.curriculum.replace(/_/g, " ")}`,
    };
  });
};

export const getBookTitlesCountRepository = async (queryParams: TIndexBookTitleQuery) => {
  const baseConditions = [isNull(bookTitleTable.deletedAt)];

  if (queryParams.subjectId) baseConditions.push(eq(bookTitleTable.subjectId, queryParams.subjectId));
  if (queryParams.level) baseConditions.push(eq(bookTitleTable.level, queryParams.level));
  if (queryParams.curriculum) baseConditions.push(eq(bookTitleTable.curriculum, queryParams.curriculum));

  return await buildCountQuery({
    table: bookTitleTable,
    columns: BOOK_TITLE_COLUMNS,
    queryParams,
    baseConditions,
  });
};

export const getBookTitleByIdRepository = async (id: number) => {
  const [result] = await db
    .select({
      id: bookTitleTable.id,
      subjectId: bookTitleTable.subjectId,
      grade: bookTitleTable.grade,
      level: bookTitleTable.level,
      curriculum: bookTitleTable.curriculum,
      subjectName: subjectTable.name,
      displayTitle: sql<string>`CONCAT(
        COALESCE(${subjectTable.name}, 'Tidak Diketahui'), ' Kelas ',
        ${bookTitleTable.grade}, ' ',
        ${bookTitleTable.level}, ' ',
        REPLACE(${bookTitleTable.curriculum}::text, '_', ' ')
      )`.as("displayTitle"),
      createdAt: bookTitleTable.createdAt,
      updatedAt: bookTitleTable.updatedAt,
      deletedAt: bookTitleTable.deletedAt,
    })
    .from(bookTitleTable)
    .leftJoin(subjectTable, eq(bookTitleTable.subjectId, subjectTable.id))
    .where(and(eq(bookTitleTable.id, id), isNull(bookTitleTable.deletedAt)));

  return result || null;
};

export const updateBookTitleByIdRepository = async (id: number, data: TUpdateBookTitle) => {
  return await db
    .update(bookTitleTable)
    .set(data)
    .where(eq(bookTitleTable.id, id))
    .returning();
};

export const deleteBookTitleByIdRepository = async (id: number) => {
  return await db
    .update(bookTitleTable)
    .set({ deletedAt: new Date() })
    .where(eq(bookTitleTable.id, id))
    .returning();
};