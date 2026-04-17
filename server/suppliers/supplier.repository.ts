import { supplierTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexSupplierQuery } from "@/schemas/supplier.schema";
import { TNewSupplier, TUpdateSupplier } from "@/types/database";
import { and, eq, isNull } from "drizzle-orm";

export const createSupplierRepository = async (data: TNewSupplier) => {
  return await db.insert(supplierTable).values(data).returning();
};

const SUPPLIER_COLUMNS: TColumnsDefinition<typeof supplierTable> = {
  name: { searchable: true, sortable: true },
  phone: { searchable: true },
  address: { searchable: true },
};

export const getSuppliersWithPaginationRepository = async (queryParams: TIndexSupplierQuery) => {
  return await buildPaginatedQuery({
    table: supplierTable,
    columns: SUPPLIER_COLUMNS,
    queryParams,
    baseConditions: [isNull(supplierTable.deletedAt)],
  });
};

export const getSuppliersCountRepository = async (queryParams: TIndexSupplierQuery) => {
  return await buildCountQuery({
    table: supplierTable,
    columns: SUPPLIER_COLUMNS,
    queryParams,
    baseConditions: [isNull(supplierTable.deletedAt)],
  });
};

export const getSupplierByIdRepository = async (id: number) => {
  return await db.select().from(supplierTable).where(and(eq(supplierTable.id, id), isNull(supplierTable.deletedAt)));
};

export const updateSupplierByIdRepository = async (id: number, data: TUpdateSupplier) => {
  return await db
    .update(supplierTable)
    .set(data)
    .where(and(eq(supplierTable.id, id), isNull(supplierTable.deletedAt)))
    .returning();
};

export const deleteSupplierByIdRepository = async (id: number) => {
  return await db
    .update(supplierTable)
    .set({ deletedAt: new Date() })
    .where(and(eq(supplierTable.id, id), isNull(supplierTable.deletedAt)))
    .returning();
};