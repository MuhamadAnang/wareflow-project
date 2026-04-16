import { TCreateOrUpdateBookTitle, TIndexBookTitleQuery } from "@/schemas/book-title.schema";
import {
  createBookTitleRepository,
  deleteBookTitleByIdRepository,
  getBookTitleByIdRepository,
  getBookTitlesCountRepository,
  getBookTitlesWithPaginationRepository,
  updateBookTitleByIdRepository,
} from "./book-title.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TBookTitle, TBookTitleDetail, TBookTitleEnhanced } from "@/types/database";
import { NotFoundException } from "@/common/exception/not-found.exception";
import { db } from "@/lib/db";
import { subjectTable } from "@/drizzle/schema";
import { isNull } from "drizzle-orm";

const subjectCache: Record<number, string> = {};

// Fungsi load tetap sama
export async function loadSubjectCache() {
  if (Object.keys(subjectCache).length === 0) {
    const subjects = await db
      .select({ id: subjectTable.id, name: subjectTable.name })
      .from(subjectTable)
      .where(isNull(subjectTable.deletedAt));

    subjects.forEach((s) => {
      subjectCache[s.id] = s.name;
    });
  }
}
export function invalidateSubjectCache() {
  Object.keys(subjectCache).forEach(key => delete subjectCache[Number(key)]);
  // atau lebih sederhana: subjectCache = {}; tapi karena const, gunakan loop delete
}

export const createBookTitleService = async (bookTitleData: TCreateOrUpdateBookTitle) => {
  return await createBookTitleRepository(bookTitleData);
};

export const getBookTitlesWithPaginationService = async (queryParams: TIndexBookTitleQuery) => {
  await loadSubjectCache();

  const [entries, total] = await Promise.all([
    getBookTitlesWithPaginationRepository(queryParams),
    getBookTitlesCountRepository(queryParams),
  ]);

  const enhancedEntries = entries.map((entry) => {
    const subjectName = subjectCache[entry.subjectId] || "Tidak Diketahui";

    return {
      ...entry,
      subjectName,
      displayTitle: `${subjectName} Kelas ${entry.grade} ${entry.level} ${entry.curriculum.replace(/_/g, " ")}`,
    } as TBookTitleEnhanced;
  });

  return paginationResponseMapper<TBookTitleEnhanced>(enhancedEntries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getBookTitleByIdService = async (id: number): Promise<TBookTitleDetail> => {
  const bookTitle = await getBookTitleByIdRepository(id);
  if (!bookTitle) {
    throw new NotFoundException(`Judul buku dengan ID ${id} tidak ditemukan`);
  }
  return bookTitle as TBookTitleDetail;
};

export const updateBookTitleService = async (
  id: number,
  data: TCreateOrUpdateBookTitle,
): Promise<TBookTitle> => {
  await getBookTitleByIdService(id);
  const [updated] = await updateBookTitleByIdRepository(id, data);
  return updated;
};

export const deleteBookTitleService = async (id: number) => {
  await getBookTitleByIdService(id);
  await deleteBookTitleByIdRepository(id);
};
