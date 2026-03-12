import { and, asc, Column, desc, eq, ilike, InferSelectModel, or, sql, SQL } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { db } from "./db";
import { calculateOffset } from "./pagination";
import { TIndexQueryParams } from "@/types/query-params";

/**
 * Metadata untuk single column (regular atau computed)
 */
export type TColumnDefinition<TTable extends PgTable> = {
  /** Bisa di-search (text search dengan ILIKE) */
  searchable?: boolean;
  /** Bisa di-filter (exact match) */
  filterable?: boolean;
  /** Bisa di-sort */
  sortable?: boolean;
  /** SQL expression untuk computed column (jika ada) */
  compute?: (table: TTable) => SQL;
};

/**
 * Definisi semua columns (regular dan computed)
 */
export type TColumnsDefinition<TTable extends PgTable> = Record<string, TColumnDefinition<TTable>>;

type TPaginationParams<TTable extends PgTable> = {
  table: TTable;
  columns: TColumnsDefinition<TTable>;
  queryParams: TIndexQueryParams;
};

type TBuildWhereParams<TTable extends PgTable> = {
  table: TTable;
  columns: TColumnsDefinition<TTable>;
  queryParams: {
    search?: string;
  } & Record<string, unknown>;
};

const buildGenericWhereClause = <TTable extends PgTable>({
  table,
  queryParams,
  columns,
}: TBuildWhereParams<TTable>) => {
  const { search } = queryParams;

  const searchConditions: SQL[] = [];
  const filterConditions: SQL[] = [];

  // Search in searchable columns
  if (search) {
    Object.entries(columns).forEach(([columnKey, config]) => {
      if (!config.searchable) return;

      // Handle computed columns
      if (config.compute) {
        searchConditions.push(ilike(config.compute(table), `%${search}%`));
      } else {
        // Handle regular columns
        const column = table[columnKey as keyof typeof table] as Column;
        if (column) {
          searchConditions.push(ilike(column, `%${search}%`));
        }
      }
    });
  }

  // Filter by filterable columns
  Object.entries(columns).forEach(([columnKey, config]) => {
    if (!config.filterable) return;

    const value = queryParams[columnKey];
    if (value === undefined || value === null) return;

    // Handle computed columns
    if (config.compute) {
      filterConditions.push(eq(config.compute(table), value));
    } else {
      // Handle regular columns
      const column = table[columnKey as keyof typeof table] as Column;
      if (column) {
        filterConditions.push(eq(column, value));
      }
    }
  });

  if (!searchConditions.length && !filterConditions.length) {
    return undefined;
  }

  return and(
    filterConditions.length ? and(...filterConditions) : undefined,
    searchConditions.length ? or(...searchConditions) : undefined,
  );
};

export const buildCountQuery = async <TTable extends PgTable>({
  table,
  columns,
  queryParams,
}: Omit<TPaginationParams<TTable>, "queryParams"> & {
  queryParams: Pick<TIndexQueryParams, "search"> & Record<string, unknown>;
}) => {
  const whereClause = buildGenericWhereClause({
    table,
    queryParams,
    columns,
  });

  const result = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(table as PgTable)
    .where(whereClause);

  return result[0]?.count ?? 0;
};

export const buildPaginatedQuery = async <TTable extends PgTable>({
  table,
  columns,
  queryParams,
}: TPaginationParams<TTable>) => {
  const { page, pageSize, sort } = queryParams;
  const offset = calculateOffset(page, pageSize);

  const whereClause = buildGenericWhereClause({
    table,
    queryParams,
    columns,
  });

  const query = db
    .select()
    .from(table as PgTable)
    .where(whereClause)
    .limit(pageSize)
    .offset(offset);

  if (sort && sort.length > 0) {
    for (const { key: columnKey, direction } of sort) {
      const config = columns[columnKey];
      if (!config?.sortable) continue;

      // Handle computed columns
      if (config.compute) {
        const computedExpr = config.compute(table);
        query.orderBy(direction === "asc" ? asc(computedExpr) : desc(computedExpr));
      } else {
        // Handle regular columns
        const column = table[columnKey as keyof typeof table] as Column;
        if (column) {
          query.orderBy(direction === "asc" ? asc(column) : desc(column));
        }
      }
    }
  }

  const rows = await query;

  return rows as InferSelectModel<TTable>[];
};
