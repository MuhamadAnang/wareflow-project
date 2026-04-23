import { NotFoundException } from "@/common/exception/not-found.exception";
import { paginationResponseMapper } from "@/lib/pagination";
import { TCreateCustomerOrder, TIndexCustomerOrderQuery } from "@/schemas/customer-order.schema";
import { TCustomerOrder, TCustomerOrderDetail, TCustomerOrderListItem } from "@/types/database";
import {
  createCustomerOrderRepository,
  deleteCustomerOrderRepository,
  getCustomerOrderByIdRepository,
  getCustomerOrdersCountRepository,
  getCustomerOrdersWithPaginationRepository,
  updateCustomerOrderStatusRepository,
  getCustomerOrderStatusRepository,
} from "./customer-order.repository";
import { getGoodsOutByOrderIdRepository } from "../goods-out/goods-out.repository";
import { db } from "@/lib/db";
import { customerOrderItemTable, customerOrderTable, customerTable } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export const createCustomerOrderService = async (data: TCreateCustomerOrder) => {
  const { customerId, orderDate, note, items } = data;

  const orderData: TNewCustomerOrder = {
    customerId,
    orderDate: orderDate as any,
    note: note || null,
    status: "DRAFT" as const,
  };

  const orderItems = items.map((item) => ({
    bookId: item.bookId,
    quantity: item.quantity,
    price: item.price.toString(), // numeric field but stored as string in Drizzle
  }));

  const order = await createCustomerOrderRepository(orderData, orderItems);
  return order;
};

export const getCustomerOrdersWithPaginationService = async (queryParams: TIndexCustomerOrderQuery) => {
  const [entries, total] = await Promise.all([
    getCustomerOrdersWithPaginationRepository(queryParams),
    getCustomerOrdersCountRepository(queryParams),
  ]);

  const mappedEntries: TCustomerOrderListItem[] = entries.map((entry) => ({
    id: entry.id,
    customerId: entry.customerId,
    customerName: entry.customerName,
    orderDate: entry.orderDate,
    status: entry.status,
    note: entry.note,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  }));

  return paginationResponseMapper<TCustomerOrderListItem>(mappedEntries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};


export const getCustomerOrderByIdService = async (id: number): Promise<TCustomerOrderDetail> => {
  const order = await getCustomerOrderByIdRepository(id);
  if (!order) {
    throw new NotFoundException(`Customer order with ID ${id} not found`);
  }
  
  // Ambil semua goods out untuk order ini
  const goodsOutList = await getGoodsOutByOrderIdRepository(id);
  
  // Hitung total yang sudah dikirim per book
  const shippedMap = new Map<number, number>();
  for (const goodsOut of goodsOutList) {
    for (const item of goodsOut.items) {
      const current = shippedMap.get(item.bookId) || 0;
      shippedMap.set(item.bookId, current + item.quantity);
    }
  }
  
  // Tambahkan shippedQuantity ke setiap item
  const itemsWithShipped = order.items.map((item) => ({
  ...item,
  shippedQuantity: shippedMap.get(item.bookId) || 0,
  remainingQuantity: item.quantity - (shippedMap.get(item.bookId) || 0),
}));
  
  return {
    ...order,
    items: itemsWithShipped,
  };
};

export const updateCustomerOrderStatusService = async (id: number, status: string) => {
  // Cek apakah order exists
  const existingOrder = await getCustomerOrderByIdService(id);
  if (!existingOrder) {
    throw new NotFoundException(`Customer order with ID ${id} not found`);
  }

  // Validasi status transition
  const currentStatus = existingOrder.status;
  const allowedTransitions: Record<string, string[]> = {
    DRAFT: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PARTIALLY_SHIPPED", "SHIPPED", "CANCELLED"],
    PARTIALLY_SHIPPED: ["SHIPPED", "CANCELLED"],
    SHIPPED: [],
    CANCELLED: [],
  };

  // HAPUS validasi khusus SHIPPED ini
  // if (status === "SHIPPED") {
  //   throw new Error("Status SHIPPED can only be set automatically via Goods Out");
  // }

  if (!allowedTransitions[currentStatus]?.includes(status)) {
    throw new Error(`Cannot change status from ${currentStatus} to ${status}`);
  }

  // Update status
  const updated = await updateCustomerOrderStatusRepository(id, status);
  if (!updated || updated.length === 0) {
    throw new NotFoundException(`Order ${id} not found or update failed`);
  }
  
  return updated[0];
};

export const cancelCustomerOrderService = async (id: number) => {
  return await updateCustomerOrderStatusService(id, "CANCELLED");
};

export const deleteCustomerOrderService = async (id: number) => {
  // Soft delete
  const deleted = await deleteCustomerOrderRepository(id);
  if (!deleted.length) throw new NotFoundException(`Order ${id} not found`);
  return deleted[0];
};

export const getAvailableOrdersService = async () => {
  // Ambil semua order dengan status CONFIRMED atau PARTIALLY_SHIPPED
  const orders = await db
    .select({
      id: customerOrderTable.id,
      customerId: customerOrderTable.customerId,
      customerName: customerTable.name,
      orderDate: customerOrderTable.orderDate,
      status: customerOrderTable.status,
      note: customerOrderTable.note,
    })
    .from(customerOrderTable)
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .where(
      sql`${customerOrderTable.status} IN ('CONFIRMED', 'PARTIALLY_SHIPPED')`
    )
    .orderBy(sql`${customerOrderTable.createdAt} DESC`);
  
  // Filter: hanya order yang masih memiliki sisa quantity
  const availableOrders = [];
  
  for (const order of orders) {
    // Ambil semua goods out untuk order ini
    const goodsOutList = await getGoodsOutByOrderIdRepository(order.id);
    
    // Hitung total yang sudah dikirim per book
    const shippedMap = new Map<number, number>();
    for (const goodsOut of goodsOutList) {
      for (const item of goodsOut.items) {
        const current = shippedMap.get(item.bookId) || 0;
        shippedMap.set(item.bookId, current + item.quantity);
      }
    }
    
    // Ambil items dari order (perlu query terpisah)
    const orderItems = await db
      .select({
        bookId: customerOrderItemTable.bookId,
        quantity: customerOrderItemTable.quantity,
      })
      .from(customerOrderItemTable)
      .where(eq(customerOrderItemTable.customerOrderId, order.id));
    
    // Cek apakah masih ada sisa yang belum dikirim
    let hasRemaining = false;
    for (const item of orderItems) {
      const shipped = shippedMap.get(item.bookId) || 0;
      const remaining = item.quantity - shipped;
      if (remaining > 0) {
        hasRemaining = true;
        break;
      }
    }
    
    if (hasRemaining) {
      availableOrders.push(order);
    }
  }
  
  return availableOrders;
};