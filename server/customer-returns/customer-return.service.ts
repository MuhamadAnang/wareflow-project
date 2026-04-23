import { NotFoundException } from "@/common/exception/not-found.exception";
import { paginationResponseMapper } from "@/lib/pagination";
import { TCreateCustomerReturn, TIndexCustomerReturnQuery } from "@/schemas/customer-return.schema";
import { TCustomerReturnDetail, TCustomerReturnListItem } from "@/types/database";

import { getCustomerByIdService } from "../customers/customer.service";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { bookTable, customerOrderTable, customerReturnItemTable, customerReturnTable, goodsOutItemTable, goodsOutTable, stockMovementTable } from "@/drizzle/schema";
import { getCustomerReturnByIdRepository, getCustomerReturnCountRepository, getCustomerReturnListRepository } from "./customer-return.repository";

// Helper: Get shipped quantities for a customer
const getCustomerShippedQuantities = async (customerId: number) => {
  // Ambil semua customer order untuk customer ini
  const orders = await db
    .select({
      orderId: customerOrderTable.id,
      orderDate: customerOrderTable.orderDate,
      status: customerOrderTable.status,
    })
    .from(customerOrderTable)
    .where(
      sql`${customerOrderTable.customerId} = ${customerId} AND ${customerOrderTable.status} IN ('CONFIRMED', 'PARTIALLY_SHIPPED', 'SHIPPED')`
    )
    .orderBy(sql`${customerOrderTable.createdAt} DESC`);

  // Untuk setiap order, ambil items yang sudah dikirim dari goods_out
  const shippedItems: Array<{ bookId: number; shippedQuantity: number; orderId: number }> = [];

  for (const order of orders) {
    // Ambil goods_out untuk order ini
    const goodsOuts = await db
      .select({ id: goodsOutTable.id })
      .from(goodsOutTable)
      .where(eq(goodsOutTable.customerOrderId, order.orderId));

    for (const goodsOut of goodsOuts) {
      const goodsOutItems = await db
        .select({
          bookId: goodsOutItemTable.bookId,
          quantity: goodsOutItemTable.quantity,
        })
        .from(goodsOutItemTable)
        .where(eq(goodsOutItemTable.goodsOutId, goodsOut.id));

      for (const item of goodsOutItems) {
        shippedItems.push({
          bookId: item.bookId,
          shippedQuantity: item.quantity,
          orderId: order.orderId,
        });
      }
    }
  }

  return shippedItems;
};

export const createCustomerReturnService = async (data: TCreateCustomerReturn) => {
  const { customerId, returnDate, reason, items } = data;

  // 1. Validasi: cek apakah customer exists
  const customer = await getCustomerByIdService(customerId);
  if (!customer) {
    throw new NotFoundException(`Customer with ID ${customerId} not found`);
  }

  // 2. Validasi: cek apakah quantity retur tidak melebihi quantity yang sudah dikirim
  const shippedItems = await getCustomerShippedQuantities(customerId);
  const shippedMap = new Map<number, number>();
  for (const item of shippedItems) {
    const current = shippedMap.get(item.bookId) || 0;
    shippedMap.set(item.bookId, current + item.shippedQuantity);
  }

  for (const item of items) {
    const shipped = shippedMap.get(item.bookId) || 0;
    if (item.quantity > shipped) {
      throw new Error(`Quantity retur untuk buku ID ${item.bookId} melebihi jumlah yang sudah dikirim (${shipped})`);
    }
  }

  // 3. Create customer return (dengan transaction)
  const returnData = {
    customerId,
    returnDate: returnDate as any,
    reason: reason || null,
  };

  const returnItems = items.map((item) => ({
    bookId: item.bookId,
    quantity: item.quantity,
  }));

  // Gunakan transaction agar semua operasi berjalan atomic
  const customerReturn = await db.transaction(async (tx) => {
    // Create customer return
    const [createdReturn] = await tx.insert(customerReturnTable).values(returnData).returning();
    if (!createdReturn) throw new Error("Failed to create customer return");

    // Create return items
    const returnItemsData = returnItems.map((item) => ({
      ...item,
      customerReturnId: createdReturn.id,
    }));
    await tx.insert(customerReturnItemTable).values(returnItemsData);

    // Create stock movements (RETURN_CUSTOMER) - tambah stok
    for (const item of items) {
      // Get current stock
      const book = await tx
        .select({ currentStock: bookTable.currentStock })
        .from(bookTable)
        .where(eq(bookTable.id, item.bookId))
        .limit(1);

      if (!book || book.length === 0) {
        throw new Error(`Book with ID ${item.bookId} not found`);
      }

      const newStock = book[0].currentStock + item.quantity;

      // Insert stock movement
      await tx.insert(stockMovementTable).values({
        bookId: item.bookId,
        type: "RETURN_CUSTOMER",
        referenceType: "CustomerReturn",
        referenceId: createdReturn.id,
        quantity: item.quantity,
        note: `Retur dari customer ${customer.name} - ${reason || "Tidak ada alasan"}`,
      });

      // Update stock
      await tx
        .update(bookTable)
        .set({ currentStock: newStock })
        .where(eq(bookTable.id, item.bookId));
    }

    return createdReturn;
  });

  return customerReturn;
};

export const getCustomerReturnListService = async (queryParams: TIndexCustomerReturnQuery) => {
  const [entries, total] = await Promise.all([
    getCustomerReturnListRepository(queryParams),
    getCustomerReturnCountRepository(queryParams),
  ]);

  const mappedEntries: TCustomerReturnListItem[] = entries.map((entry) => ({
    id: entry.id,
    customerName: entry.customerName,
    returnDate: entry.returnDate,
    reason: entry.reason,
    totalItems: entry.totalItems,
    totalQuantity: entry.totalQuantity,
    createdAt: entry.createdAt,
  }));

  return paginationResponseMapper<TCustomerReturnListItem>(mappedEntries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getCustomerReturnByIdService = async (id: number): Promise<TCustomerReturnDetail> => {
  const customerReturn = await getCustomerReturnByIdRepository(id);
  if (!customerReturn) {
    throw new NotFoundException(`Customer return with ID ${id} not found`);
  }
  return customerReturn as TCustomerReturnDetail;
};