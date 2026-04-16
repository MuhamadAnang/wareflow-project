import { TCreateOrUpdateSupplier, TIndexSupplierQuery } from "@/schemas/supplier.schema";
import {
  createSupplierRepository,
  deleteSupplierByIdRepository,
  getSupplierByIdRepository,
  getSuppliersCountRepository,
  getSuppliersWithPaginationRepository,
  updateSupplierByIdRepository,
} from "./supplier.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TSupplier } from "@/types/database";
import { NotFoundException } from "@/common/exception/not-found.exception";

export const createSupplierService = async (data: TCreateOrUpdateSupplier) => {
  return await createSupplierRepository(data);
};

export const getSuppliersWithPaginationService = async (queryParams: TIndexSupplierQuery) => {
  const [entries, total] = await Promise.all([
    getSuppliersWithPaginationRepository(queryParams),
    getSuppliersCountRepository(queryParams),
  ]);

  return paginationResponseMapper<TSupplier>(entries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getSupplierByIdService = async (id: number): Promise<TSupplier> => {
  const [supplier] = await getSupplierByIdRepository(id);
  if (!supplier) {
    throw new NotFoundException(`Supplier dengan ID ${id} tidak ditemukan`);
  }
  return supplier;
};

export const updateSupplierService = async (
  id: number,
  data: TCreateOrUpdateSupplier,
): Promise<TSupplier> => {
  await getSupplierByIdService(id);
  const [updated] = await updateSupplierByIdRepository(id, data);
  return updated;
};

export const deleteSupplierService = async (id: number) => {
  await getSupplierByIdService(id);
  await deleteSupplierByIdRepository(id);
};