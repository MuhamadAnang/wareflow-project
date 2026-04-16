import { db } from "@/lib/db";
import { goodsReceiptTable, goodsReceiptItemTable, purchaseOrderTable, supplierTable } from "@/drizzle/schema";
import { asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { TCreateGoodsReceipt,TGoodsReceiptDetail, TNewGoodsReceipt, TNewGoodsReceiptItem } from "@/types/database";
import { bookTable, bookTitleTable, subjectTable } from "@/drizzle/schema";

export const createGoodsReceiptRepository = async (
    data: TCreateGoodsReceipt,
    userId?: number
  ) => {
    return await db.transaction(async (tx) => {
      // Insert header
      const [newReceipt] = await tx
        .insert(goodsReceiptTable)
        .values({
          purchaseOrderId: data.purchaseOrderId,
          receivedDate: new Date(data.receivedDate),
          note: data.note,
        })
        .returning();
  
      // Insert items
      if (data.items.length > 0) {
        await tx.insert(goodsReceiptItemTable).values(
          data.items.map((item) => ({
            goodsReceiptId: newReceipt.id,
            bookId: item.bookId,
            quantity: item.quantity,
          }))
        );
      }
  
      // TODO: nanti kita tambahkan stock movement (IN_PURCHASE)
  
      return newReceipt;
    });
  };

  export const getGoodsReceiptsRepository = async () => {
    return db
      .select({
        id: goodsReceiptTable.id,
        purchaseOrderId: goodsReceiptTable.purchaseOrderId,
        receivedDate: goodsReceiptTable.receivedDate,
        note: goodsReceiptTable.note,
        createdAt: goodsReceiptTable.createdAt,
        supplierName: supplierTable.name,
      })
      .from(goodsReceiptTable)
      .leftJoin(purchaseOrderTable, eq(goodsReceiptTable.purchaseOrderId, purchaseOrderTable.id))
      .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id))
      .orderBy(desc(goodsReceiptTable.createdAt));
  };

export const getGoodsReceiptsWithPaginationRepository = async (queryParams: TIndexGoodsReceiptQuery) => {
  const { page = 1, pageSize = 20, search, sort } = queryParams;

  let query = db
    .select({
      id: goodsReceiptTable.id,
      purchaseOrderId: goodsReceiptTable.purchaseOrderId,
      receivedDate: goodsReceiptTable.receivedDate,
      note: goodsReceiptTable.note,
      createdAt: goodsReceiptTable.createdAt,
      supplierName: supplierTable.name,
    })
    .from(goodsReceiptTable)
    .leftJoin(purchaseOrderTable, eq(goodsReceiptTable.purchaseOrderId, purchaseOrderTable.id))
    .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id));

  if (search) {
    query = query.where(
      or(
        ilike(supplierTable.name, `%${search}%`),
        ilike(goodsReceiptTable.note, `%${search}%`)
      )
    );
  }

  if (sort?.field && sort?.direction) {
    const orderBy = sort.direction === "asc" ? asc : desc;
    const column = sort.field === "supplierName" ? supplierTable.name : goodsReceiptTable.receivedDate;
    if (column) query = query.orderBy(orderBy(column));
  } else {
    query = query.orderBy(desc(goodsReceiptTable.createdAt));
  }

  const offset = (page - 1) * pageSize;
  const data = await query.offset(offset).limit(pageSize);

  // Count total
  let countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(goodsReceiptTable)
    .leftJoin(purchaseOrderTable, eq(goodsReceiptTable.purchaseOrderId, purchaseOrderTable.id))
    .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id));
  if (search) {
    countQuery = countQuery.where(
      or(
        ilike(supplierTable.name, `%${search}%`),
        ilike(goodsReceiptTable.note, `%${search}%`)
      )
    );
  }
  const totalResult = await countQuery;
  const total = Number(totalResult[0]?.count) || 0;

  return { data, total };
};


export const getGoodsReceiptByIdRepository = async (id: number): Promise<TGoodsReceiptDetail | null> => {
  const receiptResult = await db
    .select({
      id: goodsReceiptTable.id,
      purchaseOrderId: goodsReceiptTable.purchaseOrderId,
      receivedDate: goodsReceiptTable.receivedDate,
      note: goodsReceiptTable.note,
      createdAt: goodsReceiptTable.createdAt,
      supplierName: supplierTable.name,
    })
    .from(goodsReceiptTable)
    .leftJoin(purchaseOrderTable, eq(goodsReceiptTable.purchaseOrderId, purchaseOrderTable.id))
    .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id))
    .where(eq(goodsReceiptTable.id, id))
    .limit(1);

  if (receiptResult.length === 0) return null;
  const receipt = receiptResult[0];

  const itemsRaw = await db
    .select({
      id: goodsReceiptItemTable.id,
      goodsReceiptId: goodsReceiptItemTable.goodsReceiptId,
      bookId: goodsReceiptItemTable.bookId,
      quantity: goodsReceiptItemTable.quantity,
      bookCode: bookTable.code,
      subjectName: subjectTable.name,
      grade: bookTitleTable.grade,
      level: bookTitleTable.level,
      curriculum: bookTitleTable.curriculum,
    })
    .from(goodsReceiptItemTable)
    .innerJoin(bookTable, eq(goodsReceiptItemTable.bookId, bookTable.id))
    .innerJoin(bookTitleTable, eq(bookTable.bookTitleId, bookTitleTable.id))
    .innerJoin(subjectTable, eq(bookTitleTable.subjectId, subjectTable.id))
    .where(eq(goodsReceiptItemTable.goodsReceiptId, id));

  const items = itemsRaw.map((item) => ({
    id: item.id,
    goodsReceiptId: item.goodsReceiptId,
    bookId: item.bookId,
    quantity: item.quantity,
    bookCode: item.bookCode,
    displayTitle: `${item.subjectName} Kelas ${item.grade} ${item.level} ${item.curriculum.replace('_', ' ')}`,
  }));

  return { ...receipt, items };
};

export const deleteGoodsReceiptByIdRepository = async (id: number) => {
  return await db.transaction(async (tx) => {
    await tx.delete(goodsReceiptItemTable).where(eq(goodsReceiptItemTable.goodsReceiptId, id));
    const deleted = await tx.delete(goodsReceiptTable).where(eq(goodsReceiptTable.id, id)).returning();
    return deleted[0];
  });
};

export const updateGoodsReceiptByIdRepository = async (id: number, updateData: Partial<TNewGoodsReceipt>) => {
  return await db
    .update(goodsReceiptTable)
    .set(updateData)
    .where(eq(goodsReceiptTable.id, id))
    .returning();
};

export const replaceGoodsReceiptItemsRepository = async (
  goodsReceiptId: number,
  items: Omit<TNewGoodsReceiptItem, "goodsReceiptId">[]
) => {
  await db.transaction(async (tx) => {
    // Hapus semua item lama
    await tx.delete(goodsReceiptItemTable).where(eq(goodsReceiptItemTable.goodsReceiptId, goodsReceiptId));
    // Insert item baru
    if (items.length) {
      const newItems = items.map(item => ({
        goodsReceiptId,
        bookId: item.bookId,
        quantity: item.quantity,
      }));
      await tx.insert(goodsReceiptItemTable).values(newItems);
    }
  });
};

export const updateGoodsReceiptHeaderRepository = async (
  id: number,
  updateData: Partial<TNewGoodsReceipt>
) => {
  return await db
    .update(goodsReceiptTable)
    .set(updateData)
    .where(eq(goodsReceiptTable.id, id))
    .returning();
};