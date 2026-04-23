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

export const createBookService = async (rawData: any) => {
  console.log("📥 Masuk createBookService");

  let imageUrl: string | null = null;

  if (rawData.image instanceof File) {
    console.log("🖼️  File diterima, nama:", rawData.image.name);
    imageUrl = await saveBookImage(rawData.image);
    console.log("✅ Gambar berhasil disimpan:", imageUrl);
  } else {
    console.log("⚠️  Tidak ada file gambar atau bukan tipe File");
  }

  const name = await generateBookName(rawData);

  const bookData = {
    ...rawData,
    name,
    image: imageUrl,
    currentStock: 0,
  };

  // Hapus object File sebelum masuk ke database
  if (bookData.image instanceof File) delete bookData.image;

  console.log("📤 Data yang akan disimpan ke DB:", {
    code: bookData.code,
    name: bookData.name,
    imageUrl: bookData.image,
  });

  return await createBookRepository(bookData);
};

export const updateBookService = async (id: number, rawData: any) => {
  console.log("📥 Masuk updateBookService");

  let imageUrl: string | null = rawData.image;

  if (rawData.image instanceof File) {
    console.log("🖼️ Mengganti gambar...");
    imageUrl = await saveBookImage(rawData.image);
    console.log("✅ Gambar baru tersimpan:", imageUrl);
  }

  const name = await generateBookName(rawData);

  const bookData = {
    ...rawData,
    name,
    image: imageUrl,
  };

  // Hapus File object sebelum masuk ke database
  if (bookData.image instanceof File) delete bookData.image;
console.log("imageUrl yang akan disimpan:", imageUrl, typeof imageUrl);
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


// export const createBookService = async (data: any) => {   // sementara pakai any karena ada File
//   let imageUrl: string | null = null;

//   if (data.image instanceof File) {
//     imageUrl = await saveBookImage(data.image);
//   } else if (typeof data.image === "string" && data.image.startsWith("data:")) {
//     // handle base64 jika diperlukan nanti
//   }

//   const name = await generateBookName(data);

//   const bookData = {
//     ...data,
//     image: imageUrl,
//     name,
//     currentStock: 0,
//   };

//   // Hapus file object sebelum dikirim ke database
//   delete bookData.image; // karena sudah diubah jadi URL

//   return await createBookRepository(bookData);
// };

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
