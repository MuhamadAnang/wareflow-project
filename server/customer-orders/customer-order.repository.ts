import { customerOrderTable, customerOrderItemTable, customerTable, bookTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {  TColumnsDefinition } from "@/lib/query-builder";
import { TIndexCustomerOrderQuery } from "@/schemas/customer-order.schema";
import { TNewCustomerOrder, TNewCustomerOrderItem } from "@/types/database";
import {  eq, sql } from "drizzle-orm";

// ==================== HEADER ====================

export const createCustomerOrderRepository = async (
  orderData: TNewCustomerOrder,
  items: TNewCustomerOrderItem[]
) => {
  return await db.transaction(async (tx) => {
    const [order] = await tx.insert(customerOrderTable).values(orderData).returning();
    if (!order) throw new Error("Failed to create order");
    const orderItems = items.map((item) => ({
      ...item,
      customerOrderId: order.id,
    }));
    await tx.insert(customerOrderItemTable).values(orderItems);
    return order;
  });
};

export const getCustomerOrderByIdRepository = async (id: number) => {
  const orderWithCustomer = await db
    .select({
      order: customerOrderTable,
      customer: {
        id: customerTable.id,
        name: customerTable.name,
        phone: customerTable.phone,
        address: customerTable.address,
        institution: customerTable.institution,
      },
    })
    .from(customerOrderTable)
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .where(eq(customerOrderTable.id, id))
    .limit(1);

  if (!orderWithCustomer.length) return null;

  const { order, customer } = orderWithCustomer[0];

  const items = await db
    .select({
      id: customerOrderItemTable.id,
      customerOrderId: customerOrderItemTable.customerOrderId,
      bookId: customerOrderItemTable.bookId,
      quantity: customerOrderItemTable.quantity,
      price: customerOrderItemTable.price,
      bookCode: bookTable.code,
      bookName: bookTable.name,
    })
    .from(customerOrderItemTable)
    .innerJoin(bookTable, eq(customerOrderItemTable.bookId, bookTable.id))
    .where(eq(customerOrderItemTable.customerOrderId, order.id));

  return {
    ...order,
    customer,
    items,
  };
};

const CUSTOMER_ORDER_COLUMNS: TColumnsDefinition<typeof customerOrderTable> = {
  orderDate: { sortable: true },
  status: { filterable: true },
};

export const getCustomerOrdersWithPaginationRepository = async (
  queryParams: TIndexCustomerOrderQuery
) => {
  const { page, pageSize, sort, search, customerId, status, startDate, endDate } = queryParams;

  let baseQuery = db
    .select({
      id: customerOrderTable.id,
      customerId: customerOrderTable.customerId,
      customerName: customerTable.name,
      orderDate: customerOrderTable.orderDate,
      status: customerOrderTable.status,
      note: customerOrderTable.note,
      createdAt: customerOrderTable.createdAt,
      updatedAt: customerOrderTable.updatedAt,
    })
    .from(customerOrderTable)
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id));

  if (customerId) {
    baseQuery = baseQuery.where(eq(customerOrderTable.customerId, customerId));
  }

  // Handle status yang bisa berupa string CSV
  if (status) {
    if (typeof status === 'string' && status.includes(',')) {
      const statuses = status.split(',');
      baseQuery = baseQuery.where(sql`${customerOrderTable.status} IN (${statuses.join(',')})`);
    } else {
      baseQuery = baseQuery.where(eq(customerOrderTable.status, status as any));
    }
  }

  if (startDate) {
    baseQuery = baseQuery.where(sql`${customerOrderTable.orderDate} >= ${startDate}`);
  }
  if (endDate) {
    baseQuery = baseQuery.where(sql`${customerOrderTable.orderDate} <= ${endDate}`);
  }
  if (search) {
    baseQuery = baseQuery.where(sql`${customerTable.name} ILIKE ${`%${search}%`}`);
  }

  // Sorting
  if (sort && Object.keys(sort).length > 0) {
    const [sortKey, sortDir] = Object.entries(sort)[0];
    const columnMap: Record<string, any> = {
      orderDate: customerOrderTable.orderDate,
      status: customerOrderTable.status,
    };
    const column = columnMap[sortKey];
    if (column) {
      baseQuery = baseQuery.orderBy(sortDir === "asc" ? column : sql`${column} DESC`);
    } else {
      baseQuery = baseQuery.orderBy(sql`${customerOrderTable.createdAt} DESC`);
    }
  } else {
    baseQuery = baseQuery.orderBy(sql`${customerOrderTable.createdAt} DESC`);
  }

  const offset = (page - 1) * pageSize;
  const data = await baseQuery.limit(pageSize).offset(offset);
  return data;
};

export const getCustomerOrdersCountRepository = async (queryParams: TIndexCustomerOrderQuery) => {
  const { search, customerId, status, startDate, endDate } = queryParams;

  let baseQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(customerOrderTable)
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id));

  if (customerId) baseQuery = baseQuery.where(eq(customerOrderTable.customerId, customerId));

  if (status) {
    if (typeof status === 'string' && status.includes(',')) {
      const statuses = status.split(',');
      baseQuery = baseQuery.where(sql`${customerOrderTable.status} IN (${statuses.join(',')})`);
    } else {
      baseQuery = baseQuery.where(eq(customerOrderTable.status, status as any));
    }
  }

  if (startDate) baseQuery = baseQuery.where(sql`${customerOrderTable.orderDate} >= ${startDate}`);
  if (endDate) baseQuery = baseQuery.where(sql`${customerOrderTable.orderDate} <= ${endDate}`);
  if (search) baseQuery = baseQuery.where(sql`${customerTable.name} ILIKE ${`%${search}%`}`);

  const result = await baseQuery;
  return result[0]?.count ?? 0;
};

export const updateCustomerOrderStatusRepository = async (id: number, status: string) => {
  try {
    const result = await db
      .update(customerOrderTable)
      .set({
        status: status as any,
        updatedAt: new Date()
      })
      .where(eq(customerOrderTable.id, id))
      .returning();

    console.log("Update status result:", result);
    return result;
  } catch (error) {
    console.error("Error in updateCustomerOrderStatusRepository:", error);
    throw error;
  }
};

export const deleteCustomerOrderRepository = async (id: number) => {
  return await db.transaction(async (tx) => {
    await tx
      .delete(customerOrderItemTable)
      .where(eq(customerOrderItemTable.customerOrderId, id));

    const [deleted] = await tx
      .delete(customerOrderTable)
      .where(eq(customerOrderTable.id, id))
      .returning();

    if (!deleted) throw new Error(`Order ${id} tidak ditemukan`);
    return [deleted];
  });
};

export const getCustomerOrderStatusRepository = async (id: number) => {
  const order = await db.query.customerOrderTable.findFirst({
    where: eq(customerOrderTable.id, id),
    columns: { status: true },
  });
  return order?.status;
};