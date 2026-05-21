import { db } from "@/lib/db";
import { goodsReceiptTable, goodsReceiptItemTable, purchaseOrderTable, supplierTable } from "@/drizzle/schema";
import { asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { TIndexGoodsReceiptQuery } from "@/schemas/goods-receipt.schema";
import {
  TCreateGoodsReceipt,
  TGoodsReceiptDetail,
  TGoodsReceiptItem,
  TNewGoodsReceipt,
  TNewGoodsReceiptItem,
} from "@/types/database";
import { bookTable, subjectTable } from "@/drizzle/schema";

type OnReceiptCreatedCallback = (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  receipt: typeof goodsReceiptTable.$inferSelect,
  items: Array<{ bookId: number; quantity: number }>
) => Promise<void>;

type GoodsReceiptHeaderUpdate = Omit<Partial<TNewGoodsReceipt>, "receivedDate"> & {
  receivedDate?: string | Date;
};

const toDateOnlyString = (date: string | Date) => {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return date;
};

const buildGoodsReceiptSearchCondition = (search?: string): SQL | undefined => {
  if (!search) return undefined;

  return or(
    ilike(supplierTable.name, `%${search}%`),
    ilike(goodsReceiptTable.note, `%${search}%`),
  );
};

const normalizeGoodsReceiptUpdate = (data: GoodsReceiptHeaderUpdate): Partial<TNewGoodsReceipt> => ({
  ...data,
  receivedDate: data.receivedDate ? toDateOnlyString(data.receivedDate) : undefined,
});

export const createGoodsReceiptRepository = async (
  data: TCreateGoodsReceipt,
  onCreated?: OnReceiptCreatedCallback
) => {
  return await db.transaction(async (tx) => {
    // 1. Insert header
    const [receipt] = await tx
      .insert(goodsReceiptTable)
      .values({
        purchaseOrderId: data.purchaseOrderId,
        receivedDate: data.receivedDate,
        note: data.note || null,
      })
      .returning();

    // 2. Insert items
    const itemsToInsert = data.items.map((item) => ({
      goodsReceiptId: receipt.id,
      bookId: item.bookId,
      quantity: item.quantity,
    }));
    
    await tx.insert(goodsReceiptItemTable).values(itemsToInsert);

    // 3. Panggil callback dengan tx
    if (onCreated) {
      await onCreated(tx, receipt, data.items);
    }

    return receipt;
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
  const whereClause = buildGoodsReceiptSearchCondition(search);

  const query = db
    .select({
      id: goodsReceiptTable.id,
      purchaseOrderId: goodsReceiptTable.purchaseOrderId,
      receivedDate: goodsReceiptTable.receivedDate,
      note: goodsReceiptTable.note,
      createdAt: goodsReceiptTable.createdAt,
      supplierName: sql<string>`COALESCE(${supplierTable.name}, '')`,
      items: sql<TGoodsReceiptItem[]>`'[]'::json`,
    })
    .from(goodsReceiptTable)
    .leftJoin(purchaseOrderTable, eq(goodsReceiptTable.purchaseOrderId, purchaseOrderTable.id))
    .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id))
    .where(whereClause);

  const offset = (page - 1) * pageSize;
  const [activeSort] = sort ?? [];
  const data =
    activeSort?.key === "supplierName"
      ? await query
          .orderBy(activeSort.direction === "asc" ? asc(supplierTable.name) : desc(supplierTable.name))
          .offset(offset)
          .limit(pageSize)
      : activeSort?.key === "receivedDate"
        ? await query
            .orderBy(
              activeSort.direction === "asc" ? asc(goodsReceiptTable.receivedDate) : desc(goodsReceiptTable.receivedDate),
            )
            .offset(offset)
            .limit(pageSize)
        : await query.orderBy(desc(goodsReceiptTable.createdAt)).offset(offset).limit(pageSize);

  // Count total
  const totalResult = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(goodsReceiptTable)
    .leftJoin(purchaseOrderTable, eq(goodsReceiptTable.purchaseOrderId, purchaseOrderTable.id))
    .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id))
    .where(whereClause);
  const total = totalResult[0]?.count ?? 0;

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
      supplierName: sql<string>`COALESCE(${supplierTable.name}, '')`,
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
      grade: bookTable.grade,           // ✅ langsung dari bookTable
      level: bookTable.level,           // ✅ langsung dari bookTable
      curriculum: bookTable.curriculum, // ✅ langsung dari bookTable
      semester: bookTable.semester,     // ✅ tambah semester
    })
    .from(goodsReceiptItemTable)
    .innerJoin(bookTable, eq(goodsReceiptItemTable.bookId, bookTable.id))       // ✅ satu join
    .innerJoin(subjectTable, eq(bookTable.subjectId, subjectTable.id))          // ✅ subject dari bookTable
    .where(eq(goodsReceiptItemTable.goodsReceiptId, id));

  const items = itemsRaw.map((item) => ({
    id: item.id,
    goodsReceiptId: item.goodsReceiptId,
    bookId: item.bookId,
    quantity: item.quantity,
    bookCode: item.bookCode,
    bookName: `${item.subjectName} Kelas ${item.grade} ${item.level} ${item.curriculum.replace(/_/g, " ")} ${item.semester}`,
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

export const updateGoodsReceiptByIdRepository = async (id: number, updateData: GoodsReceiptHeaderUpdate) => {
  return await db
    .update(goodsReceiptTable)
    .set(normalizeGoodsReceiptUpdate(updateData))
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
  updateData: GoodsReceiptHeaderUpdate
) => {
  return await db
    .update(goodsReceiptTable)
    .set(normalizeGoodsReceiptUpdate(updateData))
    .where(eq(goodsReceiptTable.id, id))
    .returning();
};
