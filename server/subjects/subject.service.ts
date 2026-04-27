import { TCreateOrUpdateSubject, TIndexSubjectQuery } from "@/schemas/subject.schema";
import {
  createSubjectRepository,
  deleteSubjectByIdRepository,
  getSubjectByIdRepository,
  getSubjectByNameRepository,
  getSubjectsCountRepository,
  getSubjectsWithPaginationRepository,
  updateSubjectByIdRepository,
} from "./subject.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TSubject } from "@/types/database";
import { NotFoundException } from "@/common/exception/not-found.exception";
import { ConflictException } from "@/common/exception/conflict.exception";

export const createSubjectService = async (data: TCreateOrUpdateSubject) => {
  const existing = await getSubjectByNameRepository(data.name);
  if (existing) {
    throw new ConflictException(`Mata pelajaran "${data.name}" sudah ada`);
  }
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
  await getSubjectByIdService(id);

  // Cek duplikat nama, tapi exclude subject yang sedang diupdate
  const existing = await getSubjectByNameRepository(data.name, id);
  if (existing) {
    throw new ConflictException(`Mata pelajaran "${data.name}" sudah ada`);
  }

  const [updated] = await updateSubjectByIdRepository(id, data);
  return updated;
};

export const deleteSubjectService = async (id: number) => {
  await getSubjectByIdService(id);
  await deleteSubjectByIdRepository(id);
  // invalidateSubjectCache();  // <-- panggil ini
};