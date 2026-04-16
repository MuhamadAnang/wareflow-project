import { and, count, eq, ilike, isNull, not, or, sql, SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  getTableColumns,
} from "drizzle-orm";  // pastikan import getTableColumns kalau belum
import { TIndexBookQuery } from "@/schemas/book.schema";
import { TNewBook, TUpdateBook } from "@/types/database";
import { bookTable, bookTitleTable, subjectTable, supplierTable } from "@/drizzle/schema";
import { buildCountQuery, TColumnsDefinition } from "@/lib/query-builder";

const BOOK_COLUMNS: TColumnsDefinition<typeof bookTable> = {
    code: { searchable: true },
    bookTitleId: { filterable: true },
    supplierId: { filterable: true },
    semester: { filterable: true },
};
const displayTitleExpr = sql<string>`CONCAT(
  ${subjectTable.name},
  ' Kelas '::text,
  ${bookTitleTable.grade}::text,
  ' '::text,
  ${bookTitleTable.level}::text,
  ' '::text,
  replace(${bookTitleTable.curriculum}::text, '_'::text, ' '::text)
)`.as("displayTitle");

const bookColumns = getTableColumns(bookTable);  

export async function createBookRepository(data: TNewBook) {
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
  const { page = 1, pageSize = 20, search, bookTitleId, supplierId, semester } = params;
  const offset = (page - 1) * pageSize;

  const baseWhere: SQL[] = [isNull(bookTable.deletedAt)];

  if (bookTitleId) baseWhere.push(eq(bookTable.bookTitleId, bookTitleId));
  if (supplierId) baseWhere.push(eq(bookTable.supplierId, supplierId));
  if (semester) baseWhere.push(eq(bookTable.semester, semester));

  let searchWhere: SQL | undefined;
  if (search?.trim()) {
    const like = `%${search.trim()}%`;
    searchWhere = or(ilike(bookTable.code, like), ilike(displayTitleExpr, like));
  }

  const whereClause = and(...baseWhere, searchWhere);

  // SELECT: gunakan getTableColumns + custom fields (no spread langsung di object)
  const selectFields = {
    ...bookColumns,  // ini aman karena getTableColumns mengembalikan { id: column, code: column, ... }
    displayTitle: displayTitleExpr,
    subjectName: subjectTable.name,
    supplierName: supplierTable.name,
  };

  const dataQuery = db
    .select(selectFields)
    .from(bookTable)
    .leftJoin(bookTitleTable, eq(bookTable.bookTitleId, bookTitleTable.id))
    .leftJoin(subjectTable, eq(bookTitleTable.subjectId, subjectTable.id))
    .leftJoin(supplierTable, eq(bookTable.supplierId, supplierTable.id))
    .where(whereClause)
    .limit(pageSize)
    .offset(offset);

  // Count query (mirip, tanpa limit/offset)
  const countQuery = db
    .select({ count: count() })
    .from(bookTable)
    .leftJoin(bookTitleTable, eq(bookTable.bookTitleId, bookTitleTable.id))
    .leftJoin(subjectTable, eq(bookTitleTable.subjectId, subjectTable.id))
    .where(whereClause);

  const [items, totalResult] = await Promise.all([dataQuery, countQuery]);

  const total = Number(totalResult[0]?.count ?? 0);

  return { items, total };
}
export const getBooksCountRepository = async (queryParams: TIndexBookQuery) => {
  return await buildCountQuery({
    table: bookTable,
    columns: BOOK_COLUMNS,
    queryParams,
    baseConditions: [isNull(bookTable.deletedAt)],
  });
};
export async function getBookByIdRepository(id: number) {
  const selectFields = {
    ...getTableColumns(bookTable),
    displayTitle: displayTitleExpr,
    subjectName: subjectTable.name,
    supplierName: supplierTable.name,
  };

  const [result] = await db
    .select(selectFields)
    .from(bookTable)
    .leftJoin(bookTitleTable, eq(bookTable.bookTitleId, bookTitleTable.id))
    .leftJoin(subjectTable, eq(bookTitleTable.subjectId, subjectTable.id))
    .leftJoin(supplierTable, eq(bookTable.supplierId, supplierTable.id))
    .where(and(eq(bookTable.id, id), isNull(bookTable.deletedAt)));

  return result ?? null;
}

export async function updateBookRepository(id: number, data: TUpdateBook) {
  if (data.code) {
    const [existing] = await db
      .select({ id: bookTable.id })
      .from(bookTable)
      .where(and(eq(bookTable.code, data.code), not(eq(bookTable.id, id))));  // pakai not() dari drizzle-orm

    if (existing) {
      throw new Error(`Kode buku '${data.code}' sudah digunakan`);
    }
  }

  const updated = await db
    .update(bookTable)
    .set(data)
    .where(and(eq(bookTable.id, id), isNull(bookTable.deletedAt)))
    .returning();   // ini pasti return array, meskipun kosong atau 1 item

  if (updated.length === 0) {
    throw new Error("Book tidak ditemukan atau sudah dihapus");
  }return updated;
}
export const updateBookByIdRepository = async (id: number, updateData: TUpdateBook) => {
  return await db.update(bookTable).set(updateData).where(eq(bookTable.id, id)).returning();
};

export async function softDeleteBookRepository(id: number) {
  const [deleted] = await db
    .update(bookTable)
    .set({ deletedAt: sql`NOW()` })
    .where(and(eq(bookTable.id, id), isNull(bookTable.deletedAt)))
    .returning();

  if (!deleted) throw new Error("Book tidak ditemukan atau sudah dihapus");
  return deleted;
}