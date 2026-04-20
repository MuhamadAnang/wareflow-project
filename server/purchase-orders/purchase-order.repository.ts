import { db } from "@/lib/db";
import { 
  purchaseOrderTable, 
  purchaseOrderItemTable, 
  supplierTable, 
  bookTable, 
  subjectTable 
} from "@/drizzle/schema";
import { eq, desc, isNull, and, sql, ilike, asc, or } from "drizzle-orm";
import { TNewPurchaseOrder, TNewPurchaseOrderItem, TUpdatePurchaseOrder, TPurchaseOrderWithSupplier, TPurchaseOrderDetail } from "@/types/database";
import { TIndexPurchaseOrderQuery } from "@/schemas/purchase-order.schema";

// Create PO with items in transaction
export const createPurchaseOrderRepository = async (
  orderData: TNewPurchaseOrder,
  items: Omit<TNewPurchaseOrderItem, "purchaseOrderId">[]
) => {
  return db.transaction(async (tx) => {
    const [newOrder] = await tx.insert(purchaseOrderTable).values(orderData).returning();

    if (items.length) {
      const orderItems = items.map((item) => ({
        purchaseOrderId: newOrder.id,
        bookId: item.bookId,
        quantity: item.quantity,
      }));
      await tx.insert(purchaseOrderItemTable).values(orderItems);
    }

    return newOrder;
  });
};

// Get paginated list with supplier name and search/sort
export const getPurchaseOrdersWithPaginationRepository = async (
  queryParams: TIndexPurchaseOrderQuery
): Promise<{ data: TPurchaseOrderWithSupplier[]; total: number }> => {
  const { page = 1, pageSize = 20, search, sort, supplierId } = queryParams;

  let query = db
    .select({
      id: purchaseOrderTable.id,
      supplierId: purchaseOrderTable.supplierId,
      orderDate: purchaseOrderTable.orderDate,
      note: purchaseOrderTable.note,
      createdAt: purchaseOrderTable.createdAt,
      updatedAt: purchaseOrderTable.updatedAt,
      deletedAt: purchaseOrderTable.deletedAt,
      supplierName: supplierTable.name,
    })
    .from(purchaseOrderTable)
    .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id))
    .where(isNull(purchaseOrderTable.deletedAt));

  if (supplierId) {
    query = query.where(eq(purchaseOrderTable.supplierId, supplierId));
  }

  if (search) {
    query = query.where(
      or(
        ilike(supplierTable.name, `%${search}%`),
        ilike(purchaseOrderTable.note, `%${search}%`)
      )
    );
  }

  // Sorting
  if (sort?.field && sort?.direction) {
    const orderBy = sort.direction === "asc" ? asc : desc;
    let column: any;
    if (sort.field === "supplierName") column = supplierTable.name;
    else if (sort.field === "orderDate") column = purchaseOrderTable.orderDate;
    else column = purchaseOrderTable[sort.field as keyof typeof purchaseOrderTable];
    if (column) query = query.orderBy(orderBy(column));
  } else {
    query = query.orderBy(desc(purchaseOrderTable.createdAt));
  }

  // Count total
  let countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(purchaseOrderTable)
    .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id))
    .where(isNull(purchaseOrderTable.deletedAt));

  if (supplierId) countQuery = countQuery.where(eq(purchaseOrderTable.supplierId, supplierId));
  if (search) {
    countQuery = countQuery.where(
      or(
        ilike(supplierTable.name, `%${search}%`),
        ilike(purchaseOrderTable.note, `%${search}%`)
      )
    );
  }

  const totalResult = await countQuery;
  const total = Number(totalResult[0]?.count) || 0;

  const offset = (page - 1) * pageSize;
  const data = await query.offset(offset).limit(pageSize);

  return { data, total };
};

// Get single PO by ID with items and book details (displayTitle diformat di JS)
export const getPurchaseOrderByIdRepository = async (id: number): Promise<TPurchaseOrderDetail | null> => {
  // Get header with supplier name
  const orderResult = await db
    .select({
      id: purchaseOrderTable.id,
      supplierId: purchaseOrderTable.supplierId,
      orderDate: purchaseOrderTable.orderDate,
      note: purchaseOrderTable.note,
      createdAt: purchaseOrderTable.createdAt,
      updatedAt: purchaseOrderTable.updatedAt,
      deletedAt: purchaseOrderTable.deletedAt,
      supplierName: supplierTable.name,
    })
    .from(purchaseOrderTable)
    .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id))
    .where(and(eq(purchaseOrderTable.id, id), isNull(purchaseOrderTable.deletedAt)))
    .limit(1);

  if (orderResult.length === 0) return null;
  const order = orderResult[0];

  // Get items with book details (ambil data mentah, jangan format di SQL)
  const itemsRaw = await db
    .select({
      id: purchaseOrderItemTable.id,
      purchaseOrderId: purchaseOrderItemTable.purchaseOrderId,
      bookId: purchaseOrderItemTable.bookId,
      quantity: purchaseOrderItemTable.quantity,
      bookCode: bookTable.code,
      subjectName: subjectTable.name,
      grade: bookTable.grade,
      level: bookTable.level,
      curriculum: bookTable.curriculum,
    })
    .from(purchaseOrderItemTable)
    .innerJoin(bookTable, eq(purchaseOrderItemTable.bookId, bookTable.id))
    .innerJoin(bookTable, eq(bookTable.code, bookTable.id))
    .innerJoin(subjectTable, eq(bookTable.subjectId, subjectTable.id))
    .where(eq(purchaseOrderItemTable.purchaseOrderId, id));

  // Format displayTitle di JavaScript (sama persis dengan yang dipakai di Book Titles)
  const items = itemsRaw.map((item) => ({
    id: item.id,
    purchaseOrderId: item.purchaseOrderId,
    bookId: item.bookId,
    quantity: item.quantity,
    bookCode: item.bookCode,
    displayTitle: `${item.subjectName} Kelas ${item.grade} ${item.level} ${item.curriculum.replace('_', ' ')}`,
  }));

  return {
    ...order,
    items,
  };
};

// Soft delete PO
export const deletePurchaseOrderByIdRepository = async (id: number) => {
  return await db
    .update(purchaseOrderTable)
    .set({ deletedAt: new Date() })
    .where(eq(purchaseOrderTable.id, id))
    .returning();
};

// Update PO header only
export const updatePurchaseOrderHeaderRepository = async (
  id: number,
  updateData: TUpdatePurchaseOrder
) => {
  return await db
    .update(purchaseOrderTable)
    .set(updateData)
    .where(eq(purchaseOrderTable.id, id))
    .returning();
};

// Replace items for a PO
export const replacePurchaseOrderItemsRepository = async (
  purchaseOrderId: number,
  items: Omit<TNewPurchaseOrderItem, "purchaseOrderId">[]
) => {
  await db.transaction(async (tx) => {
    await tx.delete(purchaseOrderItemTable).where(eq(purchaseOrderItemTable.purchaseOrderId, purchaseOrderId));
    if (items.length) {
      const newItems = items.map(item => ({
        purchaseOrderId,
        bookId: item.bookId,
        quantity: item.quantity,
      }));
      await tx.insert(purchaseOrderItemTable).values(newItems);
    }
  });
};