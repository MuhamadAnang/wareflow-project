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
import { createStockMovementService } from "../stock-movements/stock-movement.service";

// ==================== CREATE ====================

export const createGoodsOutService = async (data: TCreateGoodsOut) => {
  const { customerOrderId, shippedDate, note, items } = data;

  console.log("Creating goods out for order:", customerOrderId);
  console.log("Items to ship:", items);

  // 1. Validasi: cek apakah order exists
  const order = await getCustomerOrderByIdService(customerOrderId);
  
  if (!order) {
    throw new NotFoundException(`Customer order with ID ${customerOrderId} not found`);
  }
  
  console.log("Order found:", order.id, "Status:", order.status);
  
  // 2. Validasi status order
  const allowedStatuses = ["CONFIRMED", "PARTIALLY_SHIPPED"];
  if (!allowedStatuses.includes(order.status)) {
    throw new Error(`Order status must be CONFIRMED or PARTIALLY_SHIPPED to create goods out. Current status: ${order.status}`);
  }

  // 3. Hitung sisa quantity yang belum dikirim
  const existingGoodsOut = await getGoodsOutByOrderIdRepository(customerOrderId);
  
  // Hitung total yang sudah dikirim sebelumnya
  const shippedMap = new Map<number, number>();
  for (const goodsOut of existingGoodsOut) {
    for (const item of goodsOut.items) {
      const current = shippedMap.get(item.bookId) || 0;
      shippedMap.set(item.bookId, current + item.quantity);
    }
  }
  
  // Validasi: cek apakah quantity yang dikirim tidak melebihi sisa
  for (const item of items) {
    const ordered = order.items.find(i => i.book.id === item.bookId)?.quantity || 0;
    const shipped = shippedMap.get(item.bookId) || 0;
    const remaining = ordered - shipped;
    
    if (item.quantity > remaining) {
      throw new Error(`Quantity for book ID ${item.bookId} exceeds remaining (${remaining})`);
    }
  }

  // 4. Create goods out
  const goodsOutData = {
    customerOrderId,
    shippedDate: shippedDate as any,
    note: note || null,
  };

  const goodsOutItems = items.map((item) => ({
    bookId: item.bookId,
    quantity: item.quantity,
  }));

  const goodsOut = await createGoodsOutRepository(goodsOutData, goodsOutItems);
  console.log("Goods out created with ID:", goodsOut.id);

  // 5. Create stock movements (OUT_SALES)
  for (const item of items) {
    await createStockMovementService({
      bookId: item.bookId,
      type: "OUT_SALES",
      referenceType: "GoodsOut",
      referenceId: goodsOut.id,
      quantity: item.quantity,
      note: `Pengiriman untuk customer order #${customerOrderId}`,
    });
  }
  console.log("Stock movements created");

  // 6. Update total shipped (termasuk pengiriman saat ini)
  for (const item of items) {
    const current = shippedMap.get(item.bookId) || 0;
    shippedMap.set(item.bookId, current + item.quantity);
  }

  // 7. Tentukan status baru berdasarkan apakah semua item sudah terkirim
  let allCompleted = true;
  let anyShipped = false;

  for (const orderItem of order.items) {
    const shipped = shippedMap.get(orderItem.book.id) || 0;
    const remaining = orderItem.quantity - shipped;
    
    console.log(`Book ${orderItem.book.id}: ordered=${orderItem.quantity}, shipped=${shipped}, remaining=${remaining}`);
    
    if (remaining > 0) {
      allCompleted = false;
    }
    if (shipped > 0) {
      anyShipped = true;
    }
  }

  let newStatus: string;
  if (allCompleted && anyShipped) {
    newStatus = "SHIPPED";
  } else if (anyShipped) {
    newStatus = "PARTIALLY_SHIPPED";
  } else {
    newStatus = order.status;
  }

  console.log("Updating order status from", order.status, "to", newStatus);

  if (newStatus !== order.status) {
    await updateCustomerOrderStatusService(customerOrderId, newStatus);
    console.log("Order status updated to", newStatus);
  }

  return goodsOut;
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