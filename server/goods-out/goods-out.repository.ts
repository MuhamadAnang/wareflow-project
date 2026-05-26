import {
  goodsOutTable,
  goodsOutItemTable,
  customerOrderTable,
  customerTable,
  bookTable,
  subjectTable,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TIndexGoodsOutQuery } from "@/schemas/goods-out.schema";
import { and, asc, desc, eq, ilike, sql, type SQL } from "drizzle-orm";

const toDateOnlyString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const buildGoodsOutWhereConditions = ({
  search,
  customerOrderId,
  startDate,
  endDate,
}: Pick<TIndexGoodsOutQuery, "search" | "customerOrderId" | "startDate" | "endDate">) => {
  const conditions: SQL[] = [];

  if (customerOrderId) {
    conditions.push(eq(goodsOutTable.customerOrderId, customerOrderId));
  }

  if (startDate) {
    conditions.push(sql`${goodsOutTable.shippedDate} >= ${toDateOnlyString(startDate)}`);
  }

  if (endDate) {
    conditions.push(sql`${goodsOutTable.shippedDate} <= ${toDateOnlyString(endDate)}`);
  }

  if (search) {
    conditions.push(ilike(customerTable.name, `%${search}%`));
  }

  return conditions.length ? and(...conditions) : undefined;
};

// ==================== GET BY ID ====================

export const getGoodsOutByIdRepository = async (id: number) => {
  const goodsOutResult = await db
    .select({
      id: goodsOutTable.id,
      customerOrderId: goodsOutTable.customerOrderId,
      shippedDate: goodsOutTable.shippedDate,
      note: goodsOutTable.note,
      createdAt: goodsOutTable.createdAt,
      orderId: customerOrderTable.id,
      orderDate: customerOrderTable.orderDate,
      orderStatus: customerOrderTable.status,
      customerId: customerTable.id,
      customerName: customerTable.name,
      customerPhone: customerTable.phone,
      customerAddress: customerTable.address,
    })
    .from(goodsOutTable)
    .innerJoin(customerOrderTable, eq(goodsOutTable.customerOrderId, customerOrderTable.id))
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .where(eq(goodsOutTable.id, id))
    .limit(1);

  if (!goodsOutResult.length) {
    return null;
  }

  const goodsOut = goodsOutResult[0];

  // ✅ Fix query items
  const itemsRaw = await db
    .select({
      id: goodsOutItemTable.id,
      goodsOutId: goodsOutItemTable.goodsOutId,
      bookId: bookTable.id,
      quantity: goodsOutItemTable.quantity,
      bookCode: bookTable.code,
      grade: bookTable.grade,
      level: bookTable.level,
      curriculum: bookTable.curriculum,
      semester: bookTable.semester,
      subjectName: subjectTable.name,
    })
    .from(goodsOutItemTable)
    .innerJoin(bookTable, eq(goodsOutItemTable.bookId, bookTable.id))
    .innerJoin(subjectTable, eq(bookTable.subjectId, subjectTable.id)) // ✅ langsung dari bookTable
    .where(eq(goodsOutItemTable.goodsOutId, id));

  const items = itemsRaw.map((item) => ({
    id: item.id,
    goodsOutId: item.goodsOutId,
    bookId: item.bookId,
    quantity: item.quantity,
    bookCode: item.bookCode,
    bookName: `${item.subjectName} Kelas ${item.grade} ${item.level} ${item.curriculum.replace(/_/g, " ")} ${item.semester}`,
  }));

  return {
    id: goodsOut.id,
    customerOrderId: goodsOut.customerOrderId,
    shippedDate: goodsOut.shippedDate,
    note: goodsOut.note,
    createdAt: goodsOut.createdAt,
    customerOrder: {
      id: goodsOut.orderId,
      orderDate: goodsOut.orderDate,
      status: goodsOut.orderStatus,
      customer: {
        id: goodsOut.customerId,
        name: goodsOut.customerName,
        phone: goodsOut.customerPhone,
        address: goodsOut.customerAddress,
      },
    },
    items,
  };
};

// ==================== GET LIST WITH PAGINATION ====================

export const getGoodsOutListRepository = async (queryParams: TIndexGoodsOutQuery) => {
  const { page, pageSize, sort, search, customerOrderId, startDate, endDate } = queryParams;
  const whereClause = buildGoodsOutWhereConditions({
    search,
    customerOrderId,
    startDate,
    endDate,
  });

  const baseQuery = db
    .select({
      id: goodsOutTable.id,
      customerOrderId: goodsOutTable.customerOrderId,
      customerName: customerTable.name,
      customerAddress: customerTable.address,
      customerInstitution: customerTable.institution,
      shippedDate: goodsOutTable.shippedDate,
      note: goodsOutTable.note,
      createdAt: goodsOutTable.createdAt,
      totalQuantity: sql<number>`COALESCE(SUM(${goodsOutItemTable.quantity}), 0)`,
      totalItems: sql<number>`COUNT(${goodsOutItemTable.id})`,
    })
    .from(goodsOutTable)
    .innerJoin(customerOrderTable, eq(goodsOutTable.customerOrderId, customerOrderTable.id))
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .leftJoin(goodsOutItemTable, eq(goodsOutItemTable.goodsOutId, goodsOutTable.id))
    .where(whereClause)
    .groupBy(
      goodsOutTable.id,
      customerTable.name,
      customerTable.address,
      customerTable.institution,
    );

  const offset = (page - 1) * pageSize;

  // Sorting
  if (sort && Object.keys(sort).length > 0) {
    const [sortKey, sortDir] = Object.entries(sort)[0];

    if (sortKey === "shippedDate") {
      return await baseQuery
        .orderBy(
          sortDir === "asc" ? asc(goodsOutTable.shippedDate) : desc(goodsOutTable.shippedDate),
        )
        .limit(pageSize)
        .offset(offset);
    }
  }

  return await baseQuery.orderBy(desc(goodsOutTable.createdAt)).limit(pageSize).offset(offset);
};

export const getGoodsOutCountRepository = async (queryParams: TIndexGoodsOutQuery) => {
  const { search, customerOrderId, startDate, endDate } = queryParams;
  const whereClause = buildGoodsOutWhereConditions({
    search,
    customerOrderId,
    startDate,
    endDate,
  });

  const result = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${goodsOutTable.id})`.mapWith(Number) })
    .from(goodsOutTable)
    .innerJoin(customerOrderTable, eq(goodsOutTable.customerOrderId, customerOrderTable.id))
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .where(whereClause);

  return result[0]?.count ?? 0;
};

// ==================== GET GOODS OUT BY ORDER ID ====================

export const getGoodsOutByOrderIdRepository = async (customerOrderId: number) => {
  const result = await db
    .select({
      id: goodsOutTable.id,
      customerOrderId: goodsOutTable.customerOrderId,
      shippedDate: goodsOutTable.shippedDate,
      note: goodsOutTable.note,
      createdAt: goodsOutTable.createdAt,
      items: sql<Array<{ id: number; bookId: number; quantity: number }>>`
        COALESCE(
          json_agg(
            json_build_object(
              'id', ${goodsOutItemTable.id},
              'bookId', ${goodsOutItemTable.bookId},
              'quantity', ${goodsOutItemTable.quantity}
            )
          ) FILTER (WHERE ${goodsOutItemTable.id} IS NOT NULL),
          '[]'
        )
      `,
    })
    .from(goodsOutTable)
    .leftJoin(goodsOutItemTable, eq(goodsOutItemTable.goodsOutId, goodsOutTable.id))
    .where(eq(goodsOutTable.customerOrderId, customerOrderId))
    .groupBy(goodsOutTable.id);

  return result;
};
