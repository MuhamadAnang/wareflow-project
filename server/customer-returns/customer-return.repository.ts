import { customerReturnTable, customerReturnItemTable, customerTable, bookTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TIndexCustomerReturnQuery } from "@/schemas/customer-return.schema";
import { TNewCustomerReturn, TNewCustomerReturnItem } from "@/types/database";
import { eq, sql } from "drizzle-orm";

// ==================== CREATE ====================

export const createCustomerReturnRepository = async (
  returnData: TNewCustomerReturn,
  items: TNewCustomerReturnItem[]
) => {
  return await db.transaction(async (tx) => {
    const [customerReturn] = await tx.insert(customerReturnTable).values(returnData).returning();
    if (!customerReturn) throw new Error("Failed to create customer return");

    const returnItems = items.map((item) => ({
      ...item,
      customerReturnId: customerReturn.id,
    }));
    await tx.insert(customerReturnItemTable).values(returnItems);
    
    return customerReturn;
  });
};

// ==================== GET BY ID ====================

export const getCustomerReturnByIdRepository = async (id: number) => {
  const result = await db
    .select({
      customerReturn: customerReturnTable,
      customer: {
        id: customerTable.id,
        name: customerTable.name,
        phone: customerTable.phone,
        address: customerTable.address,
        institution: customerTable.institution,
      },
      items: sql<any>`
        COALESCE(
          json_agg(
            json_build_object(
              'id', ${customerReturnItemTable.id},
              'quantity', ${customerReturnItemTable.quantity},
              'book', json_build_object(
                'id', ${bookTable.id},
                'code', ${bookTable.code},
                'name', ${bookTable.name}
              )
            )
          ) FILTER (WHERE ${customerReturnItemTable.id} IS NOT NULL),
          '[]'
        )
      `,
    })
    .from(customerReturnTable)
    .innerJoin(customerTable, eq(customerReturnTable.customerId, customerTable.id))
    .leftJoin(customerReturnItemTable, eq(customerReturnItemTable.customerReturnId, customerReturnTable.id))
    .leftJoin(bookTable, eq(customerReturnItemTable.bookId, bookTable.id))
    .where(eq(customerReturnTable.id, id))
    .groupBy(customerReturnTable.id, customerTable.id);

  if (!result.length) return null;

  return {
    ...result[0].customerReturn,
    customer: result[0].customer,
    items: result[0].items,
  };
};

// ==================== GET LIST ====================

export const getCustomerReturnListRepository = async (queryParams: TIndexCustomerReturnQuery) => {
  const { page, pageSize, sort, search, customerId, startDate, endDate } = queryParams;

  let baseQuery = db
    .select({
      id: customerReturnTable.id,
      customerId: customerReturnTable.customerId,
      customerName: customerTable.name,
      returnDate: customerReturnTable.returnDate,
      reason: customerReturnTable.reason,
      createdAt: customerReturnTable.createdAt,
      totalQuantity: sql<number>`COALESCE(SUM(${customerReturnItemTable.quantity}), 0)`,
      totalItems: sql<number>`COUNT(${customerReturnItemTable.id})`,
    })
    .from(customerReturnTable)
    .innerJoin(customerTable, eq(customerReturnTable.customerId, customerTable.id))
    .leftJoin(customerReturnItemTable, eq(customerReturnItemTable.customerReturnId, customerReturnTable.id))
    .groupBy(customerReturnTable.id, customerTable.name);

  if (customerId) {
    baseQuery = baseQuery.where(eq(customerReturnTable.customerId, customerId));
  }
  if (startDate) {
    baseQuery = baseQuery.where(sql`${customerReturnTable.returnDate} >= ${startDate}`);
  }
  if (endDate) {
    baseQuery = baseQuery.where(sql`${customerReturnTable.returnDate} <= ${endDate}`);
  }
  if (search) {
    baseQuery = baseQuery.where(sql`${customerTable.name} ILIKE ${`%${search}%`}`);
  }

  if (sort && Object.keys(sort).length > 0) {
    const [sortKey, sortDir] = Object.entries(sort)[0];
    if (sortKey === "returnDate") {
      baseQuery = baseQuery.orderBy(sortDir === "asc" ? customerReturnTable.returnDate : sql`${customerReturnTable.returnDate} DESC`);
    } else {
      baseQuery = baseQuery.orderBy(sql`${customerReturnTable.createdAt} DESC`);
    }
  } else {
    baseQuery = baseQuery.orderBy(sql`${customerReturnTable.createdAt} DESC`);
  }

  const offset = (page - 1) * pageSize;
  const data = await baseQuery.limit(pageSize).offset(offset);
  return data;
};

export const getCustomerReturnCountRepository = async (queryParams: TIndexCustomerReturnQuery) => {
  const { search, customerId, startDate, endDate } = queryParams;

  let baseQuery = db
    .select({ count: sql<number>`COUNT(DISTINCT ${customerReturnTable.id})` })
    .from(customerReturnTable)
    .innerJoin(customerTable, eq(customerReturnTable.customerId, customerTable.id));

  if (customerId) {
    baseQuery = baseQuery.where(eq(customerReturnTable.customerId, customerId));
  }
  if (startDate) {
    baseQuery = baseQuery.where(sql`${customerReturnTable.returnDate} >= ${startDate}`);
  }
  if (endDate) {
    baseQuery = baseQuery.where(sql`${customerReturnTable.returnDate} <= ${endDate}`);
  }
  if (search) {
    baseQuery = baseQuery.where(sql`${customerTable.name} ILIKE ${`%${search}%`}`);
  }

  const result = await baseQuery;
  return result[0]?.count ?? 0;
};