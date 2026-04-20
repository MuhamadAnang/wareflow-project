import { TCreateOrUpdatePercetakan, TIndexPercetakanQuery } from "@/schemas/percetakan.schema";
import {
  createPercetakanRepository,
  deletePercetakanByIdRepository,
  getPercetakanByIdRepository,
  getPercetakansCountRepository,
  getPercetakansWithPaginationRepository,
  updatePercetakanByIdRepository,
} from "./percetakan.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TPercetakan } from "@/types/database";
import { NotFoundException } from "@/common/exception/not-found.exception";

export const createPercetakanService = async (percetakanData: TCreateOrUpdatePercetakan) => {
  const result = await createPercetakanRepository(percetakanData);
  return result; // ini sudah mengembalikan array of percetakan
};

export const getPercetakansWithPaginationService = async (queryParams: TIndexPercetakanQuery) => {
  const [entries, total] = await Promise.all([
    getPercetakansWithPaginationRepository(queryParams),
    getPercetakansCountRepository(queryParams),
  ]);

  return paginationResponseMapper<TPercetakan>(entries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getPercetakanByIdService = async (id: number): Promise<TPercetakan> => {
  const percetakan = await getPercetakanByIdRepository(id);

  if (percetakan.length === 0) {
    throw new NotFoundException(`Percetakan with ID ${id} not found`);
  }

  return percetakan[0];
};

export const deletePercetakanService = async (id: number) => {
  return await deletePercetakanByIdRepository(id);
};

export const updatePercetakanService = async (
  id: number,
  updateData: TCreateOrUpdatePercetakan,
): Promise<TPercetakan> => {
  const percetakan = await getPercetakanByIdService(id);

  if (!percetakan) {
    throw new NotFoundException(`Percetakan with ID ${id} not found`);
  }

  const updatedPercetakan = await updatePercetakanByIdRepository(id, updateData);

  return updatedPercetakan[0];
};
