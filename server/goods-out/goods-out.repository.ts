// import { goodsOutTable, goodsOutItemTable, customerOrderTable, customerTable, bookTable, bookTitleTable, subjectTable } from "@/drizzle/schema";
// import { db } from "@/lib/db";
// import { TIndexGoodsOutQuery } from "@/schemas/goods-out.schema";
// import { TNewGoodsOut, TNewGoodsOutItem } from "@/types/database";
// import { eq, sql } from "drizzle-orm";

// // ==================== CREATE ====================

// export const createGoodsOutRepository = async (
//   goodsOutData: TNewGoodsOut,
//   items: TNewGoodsOutItem[]
// ) => {
//   return await db.transaction(async (tx) => {
//     const [goodsOut] = await tx.insert(goodsOutTable).values(goodsOutData).returning();
//     if (!goodsOut) throw new Error("Failed to create goods out");

//     const goodsOutItems = items.map((item) => ({
//       ...item,
//       goodsOutId: goodsOut.id,
//     }));
//     await tx.insert(goodsOutItemTable).values(goodsOutItems);
    
//     return goodsOut;
//   });
// };

// // ==================== GET BY ID ====================

// export const getGoodsOutByIdRepository = async (id: number) => {
//   const result = await db
//     .select({
//       goodsOut: goodsOutTable,
//       customerOrder: {
//         id: customerOrderTable.id,
//         orderDate: customerOrderTable.orderDate,
//         status: customerOrderTable.status,
//         customer: {
//           id: customerTable.id,
//           name: customerTable.name,
//           phone: customerTable.phone,
//           address: customerTable.address,
//         },
//       },
//       items: sql<any>`
//         COALESCE(
//           json_agg(
//             json_build_object(
//               'id', ${goodsOutItemTable.id},
//               'quantity', ${goodsOutItemTable.quantity},
//               'book', json_build_object(
//                 'id', ${bookTable.id},
//                 'code', ${bookTable.code},
//                 'bookTitle', json_build_object(
//                   'id', ${bookTitleTable.id},
//                   'grade', ${bookTitleTable.grade},
//                   'level', ${bookTitleTable.level},
//                   'curriculum', ${bookTitleTable.curriculum},
//                   'subject', json_build_object('name', ${subjectTable.name})
//                 )
//               )
//             )
//           ) FILTER (WHERE ${goodsOutItemTable.id} IS NOT NULL),
//           '[]'
//         )
//       `,
//     })
//     .from(goodsOutTable)
//     .innerJoin(customerOrderTable, eq(goodsOutTable.customerOrderId, customerOrderTable.id))
//     .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
//     .leftJoin(goodsOutItemTable, eq(goodsOutItemTable.goodsOutId, goodsOutTable.id))
//     .leftJoin(bookTable, eq(goodsOutItemTable.bookId, bookTable.id))
//     .leftJoin(bookTitleTable, eq(bookTable.bookTitleId, bookTitleTable.id))
//     .leftJoin(subjectTable, eq(bookTitleTable.subjectId, subjectTable.id))
//     .where(eq(goodsOutTable.id, id))
//     .groupBy(goodsOutTable.id, customerOrderTable.id, customerTable.id);

//   if (!result.length) return null;

//   const row = result[0];
//   return {
//     ...row.goodsOut,
//     customerOrder: row.customerOrder,
//     items: row.items,
//   };
// };

// // ==================== GET LIST WITH PAGINATION ====================

// export const getGoodsOutListRepository = async (queryParams: TIndexGoodsOutQuery) => {
//   const { page, pageSize, sort, search, customerOrderId, startDate, endDate } = queryParams;

//   let baseQuery = db
//     .select({
//       id: goodsOutTable.id,
//       customerOrderId: goodsOutTable.customerOrderId,
//       customerName: customerTable.name,
//       shippedDate: goodsOutTable.shippedDate,
//       note: goodsOutTable.note,
//       createdAt: goodsOutTable.createdAt,
//       totalQuantity: sql<number>`COALESCE(SUM(${goodsOutItemTable.quantity}), 0)`,
//       totalItems: sql<number>`COUNT(${goodsOutItemTable.id})`,
//     })
//     .from(goodsOutTable)
//     .innerJoin(customerOrderTable, eq(goodsOutTable.customerOrderId, customerOrderTable.id))
//     .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
//     .leftJoin(goodsOutItemTable, eq(goodsOutItemTable.goodsOutId, goodsOutTable.id))
//     .groupBy(goodsOutTable.id, customerTable.name);

//   // Filters
//   if (customerOrderId) {
//     baseQuery = baseQuery.where(eq(goodsOutTable.customerOrderId, customerOrderId));
//   }
//   if (startDate) {
//     baseQuery = baseQuery.where(sql`${goodsOutTable.shippedDate} >= ${startDate}`);
//   }
//   if (endDate) {
//     baseQuery = baseQuery.where(sql`${goodsOutTable.shippedDate} <= ${endDate}`);
//   }
//   if (search) {
//     baseQuery = baseQuery.where(sql`${customerTable.name} ILIKE ${`%${search}%`}`);
//   }

//   // Sorting
//   if (sort && Object.keys(sort).length > 0) {
//     const [sortKey, sortDir] = Object.entries(sort)[0];
//     const columnMap: Record<string, any> = {
//       shippedDate: goodsOutTable.shippedDate,
//     };
//     const column = columnMap[sortKey];
//     if (column) {
//       baseQuery = baseQuery.orderBy(sortDir === "asc" ? column : sql`${column} DESC`);
//     } else {
//       baseQuery = baseQuery.orderBy(sql`${goodsOutTable.createdAt} DESC`);
//     }
//   } else {
//     baseQuery = baseQuery.orderBy(sql`${goodsOutTable.createdAt} DESC`);
//   }

//   const offset = (page - 1) * pageSize;
//   const data = await baseQuery.limit(pageSize).offset(offset);
//   return data;
// };

// export const getGoodsOutCountRepository = async (queryParams: TIndexGoodsOutQuery) => {
//   const { search, customerOrderId, startDate, endDate } = queryParams;

//   let baseQuery = db
//     .select({ count: sql<number>`COUNT(DISTINCT ${goodsOutTable.id})` })
//     .from(goodsOutTable)
//     .innerJoin(customerOrderTable, eq(goodsOutTable.customerOrderId, customerOrderTable.id))
//     .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id));

//   if (customerOrderId) {
//     baseQuery = baseQuery.where(eq(goodsOutTable.customerOrderId, customerOrderId));
//   }
//   if (startDate) {
//     baseQuery = baseQuery.where(sql`${goodsOutTable.shippedDate} >= ${startDate}`);
//   }
//   if (endDate) {
//     baseQuery = baseQuery.where(sql`${goodsOutTable.shippedDate} <= ${endDate}`);
//   }
//   if (search) {
//     baseQuery = baseQuery.where(sql`${customerTable.name} ILIKE ${`%${search}%`}`);
//   }

//   const result = await baseQuery;
//   return result[0]?.count ?? 0;
// };

// export const getGoodsOutByOrderIdRepository = async (customerOrderId: number) => {
//   const result = await db
//     .select({
//       id: goodsOutTable.id,
//       customerOrderId: goodsOutTable.customerOrderId,
//       shippedDate: goodsOutTable.shippedDate,
//       note: goodsOutTable.note,
//       createdAt: goodsOutTable.createdAt,
//       items: sql<any>`
//         COALESCE(
//           json_agg(
//             json_build_object(
//               'id', ${goodsOutItemTable.id},
//               'bookId', ${goodsOutItemTable.bookId},
//               'quantity', ${goodsOutItemTable.quantity}
//             )
//           ) FILTER (WHERE ${goodsOutItemTable.id} IS NOT NULL),
//           '[]'
//         )
//       `,
//     })
//     .from(goodsOutTable)
//     .leftJoin(goodsOutItemTable, eq(goodsOutItemTable.goodsOutId, goodsOutTable.id))
//     .where(eq(goodsOutTable.customerOrderId, customerOrderId))
//     .groupBy(goodsOutTable.id);
  
//   return result;
// };

import { goodsOutTable, goodsOutItemTable, customerOrderTable, customerTable, bookTable, bookTitleTable, subjectTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TIndexGoodsOutQuery } from "@/schemas/goods-out.schema";
import { TNewGoodsOut, TNewGoodsOutItem } from "@/types/database";
import { eq, sql } from "drizzle-orm";

// ==================== CREATE ====================

export const createGoodsOutRepository = async (
  goodsOutData: TNewGoodsOut,
  items: TNewGoodsOutItem[]
) => {
  return await db.transaction(async (tx) => {
    const [goodsOut] = await tx.insert(goodsOutTable).values(goodsOutData).returning();
    if (!goodsOut) throw new Error("Failed to create goods out");

    const goodsOutItems = items.map((item) => ({
      ...item,
      goodsOutId: goodsOut.id,
    }));
    await tx.insert(goodsOutItemTable).values(goodsOutItems);
    
    return goodsOut;
  });
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
      customerOrder: {
        id: customerOrderTable.id,
        orderDate: customerOrderTable.orderDate,
        status: customerOrderTable.status,
        customer: {
          id: customerTable.id,
          name: customerTable.name,
          phone: customerTable.phone,
          address: customerTable.address,
        },
      },
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

  const itemsRaw = await db
    .select({
      id: goodsOutItemTable.id,
      goodsOutId: goodsOutItemTable.goodsOutId,
      bookId: bookTable.id,
      quantity: goodsOutItemTable.quantity,
      bookCode: bookTable.code,
      bookTitleId: bookTitleTable.id,
      grade: bookTitleTable.grade,
      level: bookTitleTable.level,
      curriculum: bookTitleTable.curriculum,
      subjectName: subjectTable.name,
    })
    .from(goodsOutItemTable)
    .innerJoin(bookTable, eq(goodsOutItemTable.bookId, bookTable.id))
    .innerJoin(bookTitleTable, eq(bookTable.bookTitleId, bookTitleTable.id))
    .leftJoin(subjectTable, eq(bookTitleTable.subjectId, subjectTable.id))
    .where(eq(goodsOutItemTable.goodsOutId, id));

  const items = itemsRaw.map((item) => ({
    id: item.id,
    goodsOutId: item.goodsOutId,
    bookId: item.bookId,
    quantity: item.quantity,
    book: {
      id: item.bookId,
      code: item.bookCode,
      bookTitle: {
        id: item.bookTitleId,
        grade: item.grade,
        level: item.level,
        curriculum: item.curriculum,
        subject: item.subjectName ? { name: item.subjectName } : null,
      },
    },
  }));

  return {
    ...goodsOut,
    items,
  };
};

// ==================== GET LIST WITH PAGINATION ====================

export const getGoodsOutListRepository = async (queryParams: TIndexGoodsOutQuery) => {
  const { page, pageSize, sort, search, startDate, endDate } = queryParams;

  let baseQuery = db
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
    .groupBy(goodsOutTable.id, customerTable.name, customerTable.address, customerTable.institution);

  // Filters
  if (startDate) {
    baseQuery = baseQuery.where(sql`${goodsOutTable.shippedDate} >= ${startDate}`);
  }
  if (endDate) {
    baseQuery = baseQuery.where(sql`${goodsOutTable.shippedDate} <= ${endDate}`);
  }
  if (search) {
    baseQuery = baseQuery.where(sql`${customerTable.name} ILIKE ${`%${search}%`}`);
  }

  // Sorting
  if (sort && Object.keys(sort).length > 0) {
    const [sortKey, sortDir] = Object.entries(sort)[0];
    if (sortKey === "shippedDate") {
      baseQuery = baseQuery.orderBy(sortDir === "asc" ? goodsOutTable.shippedDate : sql`${goodsOutTable.shippedDate} DESC`);
    } else {
      baseQuery = baseQuery.orderBy(sql`${goodsOutTable.createdAt} DESC`);
    }
  } else {
    baseQuery = baseQuery.orderBy(sql`${goodsOutTable.createdAt} DESC`);
  }

  const offset = (page - 1) * pageSize;
  const data = await baseQuery.limit(pageSize).offset(offset);
  return data;
};

export const getGoodsOutCountRepository = async (queryParams: TIndexGoodsOutQuery) => {
  const { search, startDate, endDate } = queryParams;

  let baseQuery = db
    .select({ count: sql<number>`COUNT(DISTINCT ${goodsOutTable.id})` })
    .from(goodsOutTable)
    .innerJoin(customerOrderTable, eq(goodsOutTable.customerOrderId, customerOrderTable.id))
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id));

  if (startDate) {
    baseQuery = baseQuery.where(sql`${goodsOutTable.shippedDate} >= ${startDate}`);
  }
  if (endDate) {
    baseQuery = baseQuery.where(sql`${goodsOutTable.shippedDate} <= ${endDate}`);
  }
  if (search) {
    baseQuery = baseQuery.where(sql`${customerTable.name} ILIKE ${`%${search}%`}`);
  }

  const result = await baseQuery;
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
      items: sql<any>`
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