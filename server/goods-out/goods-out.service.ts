import { NotFoundException } from "@/common/exception/not-found.exception";
import { paginationResponseMapper } from "@/lib/pagination";
import { TCreateGoodsOut, TIndexGoodsOutQuery } from "@/schemas/goods-out.schema";
import { TGoodsOutDetail, TGoodsOutListItem } from "@/types/database";
import {
  createGoodsOutRepository,
  getGoodsOutByIdRepository,
  getGoodsOutCountRepository,
  getGoodsOutListRepository,
  getGoodsOutByOrderIdRepository,
} from "./goods-out.repository";
import { getCustomerOrderByIdService, updateCustomerOrderStatusService } from "../customer-orders/customer-order.service";
import { createStockMovementService, processStockMovement } from "../stock-movements/stock-movement.service";
import { goodsOutItemTable, goodsOutTable } from "@/drizzle/schema";
import { db } from "@/lib/db";

// ==================== CREATE ====================


export const createGoodsOutService = async (data: TCreateGoodsOut) => {
  const { customerOrderId, shippedDate, note, items } = data;

  console.log("Creating goods out for order:", customerOrderId);

  // 1. Validasi order
  const order = await getCustomerOrderByIdService(customerOrderId);
  if (!order) {
    throw new NotFoundException(`Customer order with ID ${customerOrderId} not found`);
  }
  
  // 2. Validasi status
  const allowedStatuses = ["CONFIRMED", "PARTIALLY_SHIPPED"];
  if (!allowedStatuses.includes(order.status)) {
    throw new Error(`Order status must be CONFIRMED or PARTIALLY_SHIPPED. Current: ${order.status}`);
  }

  // 3. Hitung sisa quantity
  const existingGoodsOut = await getGoodsOutByOrderIdRepository(customerOrderId);
  const shippedMap = new Map<number, number>();
  for (const goodsOut of existingGoodsOut) {
    for (const item of goodsOut.items) {
      const current = shippedMap.get(item.bookId) || 0;
      shippedMap.set(item.bookId, current + item.quantity);
    }
  }
  
  for (const item of items) {
    const ordered = order.items.find(i => i.bookId === item.bookId)?.quantity || 0;
    const shipped = shippedMap.get(item.bookId) || 0;
    const remaining = ordered - shipped;
    
    if (item.quantity > remaining) {
      throw new Error(`Quantity for book ID ${item.bookId} exceeds remaining (${remaining})`);
    }
  }

  // 4. Create goods out + stock movements dalam 1 transaction
  // 👇 Kita bungkus manual agar bisa pass tx ke processStockMovement
  return await db.transaction(async (tx) => {
    const goodsOutData = {
      customerOrderId,
      shippedDate: shippedDate as any,
      note: note || null,
    };

    const goodsOutItems = items.map((item) => ({
      bookId: item.bookId,
      quantity: item.quantity,
    }));

    // Insert goods out dengan tx
    const [goodsOut] = await tx
      .insert(goodsOutTable) // Pastikan import goodsOutTable
      .values(goodsOutData)
      .returning();

    await tx.insert(goodsOutItemTable).values(
      goodsOutItems.map(item => ({ ...item, goodsOutId: goodsOut.id }))
    );

    console.log("Goods out created with ID:", goodsOut.id);

    // 5. 🚀 Create stock movements dengan tx yang sama
    for (const item of items) {
      await processStockMovement({
        bookId: item.bookId,
        type: "OUT_SALES",
        referenceType: "goods_out",
        referenceId: goodsOut.id,
        quantity: item.quantity,
        note: `Pengiriman untuk customer order #${customerOrderId}`,
      }, tx); // 👈 PASS TX
    }
    console.log("Stock movements created");

    // 6. Update total shipped & status order
    for (const item of items) {
      const current = shippedMap.get(item.bookId) || 0;
      shippedMap.set(item.bookId, current + item.quantity);
    }

    let allCompleted = true;
    let anyShipped = false;

    for (const orderItem of order.items) {
      const shipped = shippedMap.get(orderItem.bookId) || 0;
      const remaining = orderItem.quantity - shipped;
      
      if (remaining > 0) allCompleted = false;
      if (shipped > 0) anyShipped = true;
    }

    let newStatus: string;
    if (allCompleted && anyShipped) {
      newStatus = "SHIPPED";
    } else if (anyShipped) {
      newStatus = "PARTIALLY_SHIPPED";
    } else {
      newStatus = order.status;
    }

    if (newStatus !== order.status) {
      await updateCustomerOrderStatusService(customerOrderId, newStatus);
    }

    return goodsOut;
  });
};

// ==================== GET BY ID ====================

export const getGoodsOutByIdService = async (id: number): Promise<TGoodsOutDetail> => {
  const goodsOut = await getGoodsOutByIdRepository(id);
  if (!goodsOut) {
    throw new NotFoundException(`Goods out with ID ${id} not found`);
  }
  return goodsOut as TGoodsOutDetail;
};

// ==================== GET LIST ====================

export const getGoodsOutListService = async (queryParams: TIndexGoodsOutQuery) => {
  const [entries, total] = await Promise.all([
    getGoodsOutListRepository(queryParams),
    getGoodsOutCountRepository(queryParams),
  ]);

  const mappedEntries: TGoodsOutListItem[] = entries.map((entry) => ({
    id: entry.id,
    customerOrderId: entry.customerOrderId,
    customerName: entry.customerName,
    customerAddress: entry.customerAddress,
    customerInstitution: entry.customerInstitution,
    shippedDate: entry.shippedDate,
    note: entry.note,
    totalItems: entry.totalItems,
    totalQuantity: entry.totalQuantity,
    createdAt: entry.createdAt,
  }));

  return paginationResponseMapper<TGoodsOutListItem>(mappedEntries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};