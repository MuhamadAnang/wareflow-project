import {
  supplierReturnTable,
  supplierReturnItemTable,
  supplierTable,
  bookTable,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TIndexSupplierReturnQuery } from "@/schemas/supplier-return.schema";
import { and, asc, desc, eq, ilike, sql, type SQL } from "drizzle-orm";

interface SupplierReturnItem {
  id: number;
  quantity: number;
  book: {
    id: number;
    code: string;
    name: string;
    currentStock: number;
  };
}

const toDateOnlyString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const buildSupplierReturnWhereConditions = ({
  search,
  supplierId,
  startDate,
  endDate,
}: Pick<TIndexSupplierReturnQuery, "search" | "supplierId" | "startDate" | "endDate">) => {
  const conditions: SQL[] = [];

  if (supplierId) {
    conditions.push(eq(supplierReturnTable.supplierId, supplierId));
  }

  if (startDate) {
    conditions.push(sql`${supplierReturnTable.returnDate} >= ${toDateOnlyString(startDate)}`);
  }

  if (endDate) {
    conditions.push(sql`${supplierReturnTable.returnDate} <= ${toDateOnlyString(endDate)}`);
  }

  if (search) {
    conditions.push(ilike(supplierTable.name, `%${search}%`));
  }

  return conditions.length ? and(...conditions) : undefined;
};

// ==================== GET BY ID ====================

export const getSupplierReturnByIdRepository = async (id: number) => {
  const result = await db
    .select({
      supplierReturn: supplierReturnTable,
      supplier: {
        id: supplierTable.id,
        name: supplierTable.name,
        phone: supplierTable.phone,
        address: supplierTable.address,
      },
      items: sql<SupplierReturnItem[]>`
        COALESCE(
          json_agg(
            json_build_object(
              'id', ${supplierReturnItemTable.id},
              'quantity', ${supplierReturnItemTable.quantity},
              'book', json_build_object(
                'id', ${bookTable.id},
                'code', ${bookTable.code},
                'name', ${bookTable.name},
                'currentStock', ${bookTable.currentStock}
              )
            )
          ) FILTER (WHERE ${supplierReturnItemTable.id} IS NOT NULL),
          '[]'
        )
      `,
    })
    .from(supplierReturnTable)
    .innerJoin(supplierTable, eq(supplierReturnTable.supplierId, supplierTable.id))
    .leftJoin(
      supplierReturnItemTable,
      eq(supplierReturnItemTable.supplierReturnId, supplierReturnTable.id),
    )
    .leftJoin(bookTable, eq(supplierReturnItemTable.bookId, bookTable.id))
    .where(eq(supplierReturnTable.id, id))
    .groupBy(supplierReturnTable.id, supplierTable.id);

  if (!result.length) return null;

  return {
    ...result[0].supplierReturn,
    supplier: result[0].supplier,
    items: result[0].items,
  };
};

// ==================== GET LIST ====================

export const getSupplierReturnListRepository = async (queryParams: TIndexSupplierReturnQuery) => {
  const { page, pageSize, sort, search, supplierId, startDate, endDate } = queryParams;
  const whereClause = buildSupplierReturnWhereConditions({
    search,
    supplierId,
    startDate,
    endDate,
  });

  const baseQuery = db
    .select({
      id: supplierReturnTable.id,
      supplierId: supplierReturnTable.supplierId,
      supplierName: supplierTable.name,
      returnDate: supplierReturnTable.returnDate,
      reason: supplierReturnTable.reason,
      createdAt: supplierReturnTable.createdAt,
      totalQuantity: sql<number>`COALESCE(SUM(${supplierReturnItemTable.quantity}), 0)`,
      totalItems: sql<number>`COUNT(${supplierReturnItemTable.id})`,
    })
    .from(supplierReturnTable)
    .innerJoin(supplierTable, eq(supplierReturnTable.supplierId, supplierTable.id))
    .leftJoin(
      supplierReturnItemTable,
      eq(supplierReturnItemTable.supplierReturnId, supplierReturnTable.id),
    )
    .where(whereClause)
    .groupBy(supplierReturnTable.id, supplierTable.name);

  const offset = (page - 1) * pageSize;

  if (sort && Object.keys(sort).length > 0) {
    const [sortKey, sortDir] = Object.entries(sort)[0];

    if (sortKey === "returnDate") {
      return await baseQuery
        .orderBy(
          sortDir === "asc"
            ? asc(supplierReturnTable.returnDate)
            : desc(supplierReturnTable.returnDate),
        )
        .limit(pageSize)
        .offset(offset);
    }
  }

  return await baseQuery
    .orderBy(desc(supplierReturnTable.createdAt))
    .limit(pageSize)
    .offset(offset);
};

export const getSupplierReturnCountRepository = async (queryParams: TIndexSupplierReturnQuery) => {
  const { search, supplierId, startDate, endDate } = queryParams;
  const whereClause = buildSupplierReturnWhereConditions({
    search,
    supplierId,
    startDate,
    endDate,
  });

  const result = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${supplierReturnTable.id})`.mapWith(Number) })
    .from(supplierReturnTable)
    .innerJoin(supplierTable, eq(supplierReturnTable.supplierId, supplierTable.id))
    .where(whereClause);

  return result[0]?.count ?? 0;
};
