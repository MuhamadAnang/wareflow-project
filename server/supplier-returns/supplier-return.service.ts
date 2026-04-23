import { NotFoundException } from "@/common/exception/not-found.exception";
import { paginationResponseMapper } from "@/lib/pagination";
import { TCreateSupplierReturn, TIndexSupplierReturnQuery } from "@/schemas/supplier-return.schema";
import { TSupplierReturnDetail, TSupplierReturnListItem } from "@/types/database";
import {
  getSupplierReturnByIdRepository,
  getSupplierReturnCountRepository,
  getSupplierReturnListRepository,
} from "./supplier-return.repository";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { bookTable, stockMovementTable, supplierReturnItemTable, supplierReturnTable } from "@/drizzle/schema";
import { getSupplierByIdService } from "../suppliers/supplier.service";

export const createSupplierReturnService = async (data: TCreateSupplierReturn) => {
  const { supplierId, returnDate, reason, items } = data;

  // 1. Validasi: cek apakah supplier exists
  const supplier = await getSupplierByIdService(supplierId);
  if (!supplier) {
    throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
  }

  // 2. Validasi: cek apakah quantity retur tidak melebihi current stock
  for (const item of items) {
    const book = await db
      .select({ currentStock: bookTable.currentStock })
      .from(bookTable)
      .where(eq(bookTable.id, item.bookId))
      .limit(1);

    if (!book || book.length === 0) {
      throw new NotFoundException(`Book with ID ${item.bookId} not found`);
    }

    if (item.quantity > book[0].currentStock) {
      throw new Error(`Quantity retur untuk buku ID ${item.bookId} melebihi stok yang tersedia (${book[0].currentStock})`);
    }
  }

  // 3. Siapkan data untuk insert
  const returnData = {
    supplierId,
    returnDate: returnDate as any,
    reason: reason || null,
  };

  const returnItemsData = items.map((item) => ({
    bookId: item.bookId,
    quantity: item.quantity,
  }));

  // 4. Gunakan transaction
  const supplierReturn = await db.transaction(async (tx) => {
    // Create supplier return
    const [createdReturn] = await tx.insert(supplierReturnTable).values(returnData).returning();
    if (!createdReturn) {
      throw new Error("Failed to create supplier return");
    }

    // Create return items
    const itemsWithId = returnItemsData.map((item) => ({
      ...item,
      supplierReturnId: createdReturn.id,
    }));
    await tx.insert(supplierReturnItemTable).values(itemsWithId);

    // Update stock (kurangi) dan buat stock movement
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

      const newStock = book[0].currentStock - item.quantity;

      // Insert stock movement
      await tx.insert(stockMovementTable).values({
        bookId: item.bookId,
        type: "RETURN_SUPPLIER",
        referenceType: "SupplierReturn",
        referenceId: createdReturn.id,
        quantity: -item.quantity,
        note: `Retur ke supplier ${supplier.name} - ${reason || "Tidak ada alasan"}`,
      });

      // Update stock
      await tx
        .update(bookTable)
        .set({ currentStock: newStock })
        .where(eq(bookTable.id, item.bookId));
    }

    return createdReturn;
  });

  return supplierReturn;
};

export const getSupplierReturnListService = async (queryParams: TIndexSupplierReturnQuery) => {
  const [entries, total] = await Promise.all([
    getSupplierReturnListRepository(queryParams),
    getSupplierReturnCountRepository(queryParams),
  ]);

  const mappedEntries: TSupplierReturnListItem[] = entries.map((entry) => ({
    id: entry.id,
    supplierName: entry.supplierName,
    returnDate: entry.returnDate,
    reason: entry.reason,
    totalItems: entry.totalItems,
    totalQuantity: entry.totalQuantity,
    createdAt: entry.createdAt,
  }));

  return paginationResponseMapper<TSupplierReturnListItem>(mappedEntries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getSupplierReturnByIdService = async (id: number): Promise<TSupplierReturnDetail> => {
  const supplierReturn = await getSupplierReturnByIdRepository(id);
  if (!supplierReturn) {
    throw new NotFoundException(`Supplier return with ID ${id} not found`);
  }
  return supplierReturn as TSupplierReturnDetail;
};