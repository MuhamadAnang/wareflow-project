import { bookTable, customerOrderItemTable, customerOrderStatusEnum, customerOrderTable, customerTable, customerPaymentTable, goodsOutTable, goodsOutItemTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TIndexCustomerOrderQuery } from "@/schemas/customer-order.schema";
import { TNewCustomerOrder, TNewCustomerOrderItem } from "@/types/database";
import { and, asc, desc, eq, ilike, inArray, sql, type SQL } from "drizzle-orm";

type CustomerOrderStatus = (typeof customerOrderStatusEnum.enumValues)[number];

const customerOrderStatuses = new Set<string>(customerOrderStatusEnum.enumValues);

const toDateOnlyString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStatusFilterValues = (status?: string): CustomerOrderStatus[] => {
  if (!status) return [];

  return status
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is CustomerOrderStatus => customerOrderStatuses.has(value));
};

const buildCustomerOrderWhereConditions = ({
  search,
  customerId,
  status,
  startDate,
  endDate,
}: Pick<
  TIndexCustomerOrderQuery,
  "search" | "customerId" | "status" | "startDate" | "endDate"
>) => {
  const conditions: SQL[] = [];

  if (customerId) {
    conditions.push(eq(customerOrderTable.customerId, customerId));
  }

  if (status) {
    const statuses = getStatusFilterValues(status);

    if (!statuses.length) {
      conditions.push(sql`false`);
    } else if (statuses.length === 1) {
      conditions.push(eq(customerOrderTable.status, statuses[0]));
    } else {
      conditions.push(inArray(customerOrderTable.status, statuses));
    }
  }

  if (startDate) {
    conditions.push(sql`${customerOrderTable.orderDate} >= ${toDateOnlyString(startDate)}`);
  }

  if (endDate) {
    conditions.push(sql`${customerOrderTable.orderDate} <= ${toDateOnlyString(endDate)}`);
  }

  if (search) {
    conditions.push(ilike(customerTable.name, `%${search}%`));
  }

  return conditions.length ? and(...conditions) : undefined;
};

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
      currentStock: bookTable.currentStock,
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

export const getCustomerOrdersWithPaginationRepository = async (
  queryParams: TIndexCustomerOrderQuery
) => {
  const { page, pageSize, sort, search, customerId, status, startDate, endDate } = queryParams;
  const whereClause = buildCustomerOrderWhereConditions({
    search,
    customerId,
    status,
    startDate,
    endDate,
  });

  const baseQuery = db
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
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .where(whereClause);

  // Sorting
  const offset = (page - 1) * pageSize;

  if (sort && Object.keys(sort).length > 0) {
    const [sortKey, sortDir] = Object.entries(sort)[0];
    if (sortKey === "orderDate") {
      return await baseQuery
        .orderBy(sortDir === "asc" ? asc(customerOrderTable.orderDate) : desc(customerOrderTable.orderDate))
        .limit(pageSize)
        .offset(offset);
    } else if (sortKey === "status") {
      return await baseQuery
        .orderBy(sortDir === "asc" ? asc(customerOrderTable.status) : desc(customerOrderTable.status))
        .limit(pageSize)
        .offset(offset);
    }
  }

  return await baseQuery
    .orderBy(desc(customerOrderTable.createdAt))
    .limit(pageSize)
    .offset(offset);
};

export const getCustomerOrdersCountRepository = async (queryParams: TIndexCustomerOrderQuery) => {
  const { search, customerId, status, startDate, endDate } = queryParams;
  const whereClause = buildCustomerOrderWhereConditions({
    search,
    customerId,
    status,
    startDate,
    endDate,
  });

  const result = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(customerOrderTable)
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .where(whereClause);

  return result[0]?.count ?? 0;
};

export const updateCustomerOrderStatusRepository = async (id: number, status: string) => {
  try {
    const result = await db
      .update(customerOrderTable)
      .set({
        status: status as CustomerOrderStatus,
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
    const goodsOutRecords = await tx
      .select({ id: goodsOutTable.id })
      .from(goodsOutTable)
      .where(eq(goodsOutTable.customerOrderId, id));

    const goodsOutIds = goodsOutRecords.map((record) => record.id);

    if (goodsOutIds.length > 0) {
      await tx
        .delete(goodsOutItemTable)
        .where(inArray(goodsOutItemTable.goodsOutId, goodsOutIds));

      await tx
        .delete(goodsOutTable)
        .where(inArray(goodsOutTable.id, goodsOutIds));
    }

    await tx
      .delete(customerOrderItemTable)
      .where(eq(customerOrderItemTable.customerOrderId, id));

    await tx
      .delete(customerPaymentTable)
      .where(eq(customerPaymentTable.customerOrderId, id));

    const [deleted] = await tx
      .delete(customerOrderTable)
      .where(eq(customerOrderTable.id, id))
      .returning();

    if (!deleted) throw new Error(`Order ${id} tidak ditemukan`);
    return [deleted];
  });
};

export const getCustomerOrderStatusRepository = async (id: number) => {
  const [order] = await db
    .select({ status: customerOrderTable.status })
    .from(customerOrderTable)
    .where(eq(customerOrderTable.id, id))
    .limit(1);

  return order?.status;
};
