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

export const createBookService = async (data: TCreateOrUpdateBook) => {
  return createBookRepository(data);
};

export const getBooksWithPaginationService = async (queryParams: TIndexBookQuery) => {
    const result = await getBooksWithPaginationRepository(queryParams);
  
    // result sudah punya { items, total } → langsung pakai
    return paginationResponseMapper<TBookListItem>(result.items, {
      currentPage: queryParams.page,
      pageSize: queryParams.pageSize,
      totalItems: result.total,
    });
  };

  export const getBookByIdService = async (id: number): Promise<TBookListItem> => {
    const book = await getBookByIdRepository(id);
  
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  
    return book;  // book dari repository sudah TBookListItem (dengan displayTitle dll)
  };

  export const updateBookService = async (
    id: number,
    updateData: TCreateOrUpdateBook,
  ): Promise<TBookListItem> => {
    // Validasi exist dulu
    await getBookByIdService(id);  // ini akan throw kalau tidak ada
  
    // Lakukan update
    const [updatedPlain] = await updateBookRepository(id, updateData);
  
    if (!updatedPlain) {
      throw new NotFoundException(`Book with ID ${id} not found after update`);
    }
  
    // Refetch full enhanced data setelah update (penting!)
    // karena updateRepository hanya return plain fields, bukan join
    const updatedEnhanced = await getBookByIdRepository(id);
  
    if (!updatedEnhanced) {
      throw new Error("Failed to fetch updated book data");
    }
  
    return updatedEnhanced;
  };

export const deleteBookService = async (id: number) => {
  await getBookByIdService(id); 
  return softDeleteBookRepository(id);
};