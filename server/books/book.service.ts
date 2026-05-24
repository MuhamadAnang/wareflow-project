import { NotFoundException } from "@/common/exception/not-found.exception";
import { TIndexBookQuery, TCreateOrUpdateBook } from "@/schemas/book.schema";
import {
  createBookRepository,
  getBookByIdRepository,
  getBooksWithPaginationRepository,
  softDeleteBookRepository,
  updateBookRepository,
} from "./book.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TBookListItem } from "@/types/database";
import { db } from "@/lib/db";
import { percetakanTable, subjectTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { saveBookImage } from "./book-upload.helper";

export const createBookService = async (rawData: TCreateOrUpdateBook) => {
  let imageUrl: string | null = null;

  if (rawData.image instanceof File) {
    imageUrl = await saveBookImage(rawData.image);
  }

  const name = await generateBookName(rawData);

  const bookData = {
    ...rawData,
    name,
    image: imageUrl,
    currentStock: 0,
  };

  return await createBookRepository(bookData);
};

export const updateBookService = async (id: number, rawData: TCreateOrUpdateBook) => {
  let imageUrl: string | null = rawData.image;

  if (rawData.image instanceof File) {
    imageUrl = await saveBookImage(rawData.image);
  }

  const name = await generateBookName(rawData);

  const bookData = {
    ...rawData,
    name,
    image: imageUrl,
  };

  await updateBookRepository(id, bookData);
  return await getBookByIdRepository(id);
};

const generateBookName = async (data: TCreateOrUpdateBook): Promise<string> => {
  const [subject] = await db
    .select({ name: subjectTable.name })
    .from(subjectTable)
    .where(eq(subjectTable.id, data.subjectId));

  const [percetakan] = await db
    .select({ name: percetakanTable.name })
    .from(percetakanTable)
    .where(eq(percetakanTable.id, data.percetakanId));

  return `${subject?.name || "Unknown"} Kelas ${data.grade} ${data.level} ${data.curriculum.replace(/_/g, " ")} ${data.semester} - ${percetakan?.name || "Unknown"}`;
};

export const getBooksWithPaginationService = async (queryParams: TIndexBookQuery) => {
  const result = await getBooksWithPaginationRepository(queryParams);

  return paginationResponseMapper<TBookListItem>(result.items, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: result.total,
  });
};

export const getBookByIdService = async (id: number): Promise<TBookListItem> => {
  const book = await getBookByIdRepository(id);
  if (!book) {
    throw new NotFoundException(`Buku dengan ID ${id} tidak ditemukan`);
  }
  return book;
};

// export const updateBookService = async (id: number, updateData: TCreateOrUpdateBook) => {
//   await getBookByIdService(id);

//   const name = await generateBookName(updateData);

//   const bookData = {
//     ...updateData,
//     name,
//   };

//   await updateBookRepository(id, bookData);

//   return await getBookByIdRepository(id); // return data lengkap
// };

export const deleteBookService = async (id: number) => {
  await getBookByIdService(id);
  return await softDeleteBookRepository(id);
};
