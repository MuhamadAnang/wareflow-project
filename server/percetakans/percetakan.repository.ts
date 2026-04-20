import { percetakanTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexPercetakanQuery } from "@/schemas/percetakan.schema";
import { TNewPercetakan, TUpdatePercetakan } from "@/types/database";
import { eq, isNull } from "drizzle-orm";

export const createPercetakanRepository = async (percetakanData: TNewPercetakan) => {
  return await db.insert(percetakanTable).values(percetakanData).returning();
};

const PERCETAKAN_COLUMNS: TColumnsDefinition<typeof percetakanTable> = {
  name: { searchable: true, sortable: true },
  institution: { searchable: true },
  status: { filterable: true },
};

export const getPercetakansWithPaginationRepository = async (queryParams: TIndexPercetakanQuery) => {
  return await buildPaginatedQuery({
    table: percetakanTable,
    columns: PERCETAKAN_COLUMNS,
    queryParams,
    baseConditions: [isNull(percetakanTable.deletedAt)],
  });
};

export const getPercetakansCountRepository = async (queryParams: TIndexPercetakanQuery) => {
  return await buildCountQuery({
    table: percetakanTable,
    columns: PERCETAKAN_COLUMNS,
    queryParams,
    baseConditions: [isNull(percetakanTable.deletedAt)],
  });
};

export const getPercetakanByIdRepository = async (id: number) => {
  return await db.select().from(percetakanTable).where(eq(percetakanTable.id, id));
};

export const deletePercetakanByIdRepository = async (id: number) => {
  return await db
    .update(percetakanTable)
    .set({ deletedAt: new Date() })
    .where(eq(percetakanTable.id, id))
    .returning();
};

export const updatePercetakanByIdRepository = async (id: number, updateData: TUpdatePercetakan) => {
  return await db.update(percetakanTable).set(updateData).where(eq(percetakanTable.id, id)).returning();
};
