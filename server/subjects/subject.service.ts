import { TCreateOrUpdateSubject, TIndexSubjectQuery } from "@/schemas/subject.schema";
import {
  createSubjectRepository,
  deleteSubjectByIdRepository,
  getSubjectByIdRepository,
  getSubjectsCountRepository,
  getSubjectsWithPaginationRepository,
  updateSubjectByIdRepository,
} from "./subject.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TSubject } from "@/types/database";
import { NotFoundException } from "@/common/exception/not-found.exception";
import { invalidateSubjectCache } from "../book-titles/book-title.service";

export const createSubjectService = async (data: TCreateOrUpdateSubject) => {
  // bisa tambah normalisasi kalau mau, misal: name.toUpperCase()
  invalidateSubjectCache();  // <-- panggil ini
  return await createSubjectRepository(data);
};

export const getSubjectsWithPaginationService = async (queryParams: TIndexSubjectQuery) => {
  const [entries, total] = await Promise.all([
    getSubjectsWithPaginationRepository(queryParams),
    getSubjectsCountRepository(queryParams),
  ]);

  return paginationResponseMapper<TSubject>(entries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getSubjectByIdService = async (id: number): Promise<TSubject> => {
  const [subject] = await getSubjectByIdRepository(id);
  if (!subject) {
    throw new NotFoundException(`Mata pelajaran dengan ID ${id} tidak ditemukan`);
  }
  return subject;
};

export const updateSubjectService = async (
  id: number,
  data: TCreateOrUpdateSubject,
): Promise<TSubject> => {
  await getSubjectByIdService(id); // validasi exist
  const [updated] = await updateSubjectByIdRepository(id, data);
  invalidateSubjectCache(); 
  
  return updated;
};

export const deleteSubjectService = async (id: number) => {
  await getSubjectByIdService(id);
  await deleteSubjectByIdRepository(id);
  invalidateSubjectCache();  // <-- panggil ini
};