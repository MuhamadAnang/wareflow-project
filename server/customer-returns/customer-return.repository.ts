import {
  customerReturnTable,
  customerReturnItemTable,
  customerTable,
  bookTable,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TIndexCustomerReturnQuery } from "@/schemas/customer-return.schema";
import { and, asc, desc, eq, ilike, sql, type SQL } from "drizzle-orm";

interface ReturnItem {
  id: number;
  quantity: number;
  book: {
    id: number;
    code: string;
    name: string;
  };
}

const toDateOnlyString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const buildCustomerReturnWhereConditions = ({
  search,
  customerId,
  startDate,
  endDate,
}: Pick<TIndexCustomerReturnQuery, "search" | "customerId" | "startDate" | "endDate">) => {
  const conditions: SQL[] = [];

  if (customerId) {
    conditions.push(eq(customerReturnTable.customerId, customerId));
  }

  if (startDate) {
    conditions.push(sql`${customerReturnTable.returnDate} >= ${toDateOnlyString(startDate)}`);
  }

  if (endDate) {
    conditions.push(sql`${customerReturnTable.returnDate} <= ${toDateOnlyString(endDate)}`);
  }

  if (search) {
    conditions.push(ilike(customerTable.name, `%${search}%`));
  }

  return conditions.length ? and(...conditions) : undefined;
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
      items: sql<ReturnItem[]>`
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
    .leftJoin(
      customerReturnItemTable,
      eq(customerReturnItemTable.customerReturnId, customerReturnTable.id),
    )
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
  const whereClause = buildCustomerReturnWhereConditions({
    search,
    customerId,
    startDate,
    endDate,
  });

  const baseQuery = db
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
    .leftJoin(
      customerReturnItemTable,
      eq(customerReturnItemTable.customerReturnId, customerReturnTable.id),
    )
    .where(whereClause)
    .groupBy(customerReturnTable.id, customerTable.name);

  const offset = (page - 1) * pageSize;

  if (sort && Object.keys(sort).length > 0) {
    const [sortKey, sortDir] = Object.entries(sort)[0];

    if (sortKey === "returnDate") {
      return await baseQuery
        .orderBy(
          sortDir === "asc"
            ? asc(customerReturnTable.returnDate)
            : desc(customerReturnTable.returnDate),
        )
        .limit(pageSize)
        .offset(offset);
    }
  }

  return await baseQuery
    .orderBy(desc(customerReturnTable.createdAt))
    .limit(pageSize)
    .offset(offset);
};

export const getCustomerReturnCountRepository = async (queryParams: TIndexCustomerReturnQuery) => {
  const { search, customerId, startDate, endDate } = queryParams;
  const whereClause = buildCustomerReturnWhereConditions({
    search,
    customerId,
    startDate,
    endDate,
  });

  const result = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${customerReturnTable.id})`.mapWith(Number) })
    .from(customerReturnTable)
    .innerJoin(customerTable, eq(customerReturnTable.customerId, customerTable.id))
    .where(whereClause);

  return result[0]?.count ?? 0;
};
