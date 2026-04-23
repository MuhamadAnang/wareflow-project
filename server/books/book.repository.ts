import { and, count, eq, getTableColumns, ilike, isNull, not, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { TIndexBookQuery } from "@/schemas/book.schema";
import { TNewBook, TUpdateBook } from "@/types/database";
import { bookTable, subjectTable, percetakanTable } from "@/drizzle/schema";

const displayTitleExpr = sql<string>`CONCAT(
  ${subjectTable.name},
  ' Kelas ',
  ${bookTable.grade}::text,
  ' ',
  ${bookTable.level},
  ' ',
  REPLACE(${bookTable.curriculum}::text, '_', ' '),
  ' - ',
  ${bookTable.semester}
)`.as("displayTitle");

export async function createBookRepository(data: TNewBook) {
  // Cek duplikat code
  const [existing] = await db
    .select({ id: bookTable.id })
    .from(bookTable)
    .where(eq(bookTable.code, data.code));

  if (existing) {
    throw new Error(`Kode buku '${data.code}' sudah digunakan`);
  }

  const [inserted] = await db.insert(bookTable).values(data).returning();
  return inserted;
}

export async function getBooksWithPaginationRepository(params: TIndexBookQuery) {
  const { page = 1, pageSize = 20, search, subjectId, grade, level, curriculum, semester, percetakanId } = params;
  const offset = (page - 1) * pageSize;

  const baseWhere = [isNull(bookTable.deletedAt)];

  if (subjectId) baseWhere.push(eq(bookTable.subjectId, subjectId));
  if (grade) baseWhere.push(eq(bookTable.grade, grade));
  if (level) baseWhere.push(eq(bookTable.level, level));
  if (curriculum) baseWhere.push(eq(bookTable.curriculum, curriculum));
  if (semester) baseWhere.push(eq(bookTable.semester, semester));
  if (percetakanId) baseWhere.push(eq(bookTable.percetakanId, percetakanId));

  let searchWhere;
  if (search?.trim()) {
    const like = `%${search.trim()}%`;
    searchWhere = or(
      ilike(bookTable.code, like),
      ilike(bookTable.name, like),
      ilike(displayTitleExpr, like)
    );
  }

  const whereClause = and(...baseWhere, searchWhere);

  const bookColumns = getTableColumns(bookTable);

  const dataQuery = db
    .select({
      ...bookColumns,
      subjectName: subjectTable.name,
      percetakanName: percetakanTable.name,
      displayTitle: displayTitleExpr,
    })
    .from(bookTable)
    .leftJoin(subjectTable, eq(bookTable.subjectId, subjectTable.id))
    .leftJoin(percetakanTable, eq(bookTable.percetakanId, percetakanTable.id))
    .where(whereClause)
    .limit(pageSize)
    .offset(offset);

  const countQuery = db
    .select({ count: count() })
    .from(bookTable)
    .where(and(...baseWhere, searchWhere));

  const [items, totalResult] = await Promise.all([dataQuery, countQuery]);

  return {
    items,
    total: Number(totalResult[0]?.count ?? 0),
  };
}

export async function getBookByIdRepository(id: number) {
  const bookColumns = getTableColumns(bookTable);

  const [result] = await db
    .select({
      ...bookColumns,
      subjectName: subjectTable.name,
 
      percetakanName: percetakanTable.name,
      displayTitle: displayTitleExpr,
    })
    .from(bookTable)
    .leftJoin(subjectTable, eq(bookTable.subjectId, subjectTable.id))
    .leftJoin(percetakanTable, eq(bookTable.percetakanId, percetakanTable.id))
    .where(and(eq(bookTable.id, id), isNull(bookTable.deletedAt)));
  return result ?? null;
}

export async function updateBookRepository(id: number, data: TUpdateBook) {
  if (data.code) {
    const [existing] = await db
      .select({ id: bookTable.id })
      .from(bookTable)
      .where(and(eq(bookTable.code, data.code), not(eq(bookTable.id, id))));

    if (existing) {
      throw new Error(`Kode buku '${data.code}' sudah digunakan`);
    }
  }

  const [updated] = await db
    .update(bookTable)
    .set(data)
    .where(and(eq(bookTable.id, id), isNull(bookTable.deletedAt)))
    .returning();

  if (!updated) {
    throw new Error("Buku tidak ditemukan atau sudah dihapus");
  }

  return updated;
}

export async function softDeleteBookRepository(id: number) {
  const [deleted] = await db
    .update(bookTable)
    .set({ deletedAt: new Date() })
    .where(and(eq(bookTable.id, id), isNull(bookTable.deletedAt)))
    .returning();

  if (!deleted) throw new Error("Buku tidak ditemukan atau sudah dihapus");
  return deleted;
}