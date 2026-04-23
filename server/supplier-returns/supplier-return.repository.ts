import { supplierReturnTable, supplierReturnItemTable, supplierTable, bookTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TIndexSupplierReturnQuery } from "@/schemas/supplier-return.schema";
import { TNewSupplierReturn, TNewSupplierReturnItem } from "@/types/database";
import { eq, sql } from "drizzle-orm";

// ==================== CREATE ====================

export const createSupplierReturnRepository = async (
  returnData: TNewSupplierReturn,
  items: TNewSupplierReturnItem[]
) => {
  return await db.transaction(async (tx) => {
    const [supplierReturn] = await tx.insert(supplierReturnTable).values(returnData).returning();
    if (!supplierReturn) throw new Error("Failed to create supplier return");

    const returnItems = items.map((item) => ({
      ...item,
      supplierReturnId: supplierReturn.id,
    }));
    await tx.insert(supplierReturnItemTable).values(returnItems);
    
    return supplierReturn;
  });
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
      items: sql<any>`
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
    .leftJoin(supplierReturnItemTable, eq(supplierReturnItemTable.supplierReturnId, supplierReturnTable.id))
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

  let baseQuery = db
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
    .leftJoin(supplierReturnItemTable, eq(supplierReturnItemTable.supplierReturnId, supplierReturnTable.id))
    .groupBy(supplierReturnTable.id, supplierTable.name);

  if (supplierId) {
    baseQuery = baseQuery.where(eq(supplierReturnTable.supplierId, supplierId));
  }
  if (startDate) {
    baseQuery = baseQuery.where(sql`${supplierReturnTable.returnDate} >= ${startDate}`);
  }
  if (endDate) {
    baseQuery = baseQuery.where(sql`${supplierReturnTable.returnDate} <= ${endDate}`);
  }
  if (search) {
    baseQuery = baseQuery.where(sql`${supplierTable.name} ILIKE ${`%${search}%`}`);
  }

  if (sort && Object.keys(sort).length > 0) {
    const [sortKey, sortDir] = Object.entries(sort)[0];
    if (sortKey === "returnDate") {
      baseQuery = baseQuery.orderBy(sortDir === "asc" ? supplierReturnTable.returnDate : sql`${supplierReturnTable.returnDate} DESC`);
    } else {
      baseQuery = baseQuery.orderBy(sql`${supplierReturnTable.createdAt} DESC`);
    }
  } else {
    baseQuery = baseQuery.orderBy(sql`${supplierReturnTable.createdAt} DESC`);
  }

  const offset = (page - 1) * pageSize;
  const data = await baseQuery.limit(pageSize).offset(offset);
  return data;
};

export const getSupplierReturnCountRepository = async (queryParams: TIndexSupplierReturnQuery) => {
  const { search, supplierId, startDate, endDate } = queryParams;

  let baseQuery = db
    .select({ count: sql<number>`COUNT(DISTINCT ${supplierReturnTable.id})` })
    .from(supplierReturnTable)
    .innerJoin(supplierTable, eq(supplierReturnTable.supplierId, supplierTable.id));

  if (supplierId) {
    baseQuery = baseQuery.where(eq(supplierReturnTable.supplierId, supplierId));
  }
  if (startDate) {
    baseQuery = baseQuery.where(sql`${supplierReturnTable.returnDate} >= ${startDate}`);
  }
  if (endDate) {
    baseQuery = baseQuery.where(sql`${supplierReturnTable.returnDate} <= ${endDate}`);
  }
  if (search) {
    baseQuery = baseQuery.where(sql`${supplierTable.name} ILIKE ${`%${search}%`}`);
  }

  const result = await baseQuery;
  return result[0]?.count ?? 0;
};