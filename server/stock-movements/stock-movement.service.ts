import { db } from "@/lib/db";
import { stockMovementTable, bookTable, stockMovementTypeEnum } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export type StockMovementType = (typeof stockMovementTypeEnum.enumValues)[number];
type StockMovementTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const STOCK_DIRECTION: Record<Exclude<StockMovementType, "ADJUSTMENT">, 1 | -1> = {
  IN_PURCHASE: 1,
  RETURN_CUSTOMER: 1,
  RETURN_SUPPLIER: 1,
  OUT_SALES: -1,
};

/**
 * 🔒 CORE FUNCTION: Proses stok secara atomik
 * @param tx - Optional transaction object. Jika ada, gunakan tx ini. Jika tidak, buat transaction baru.
 */

export const processStockMovement = async (
  params: {
    bookId: number;
    type: StockMovementType;
    quantity: number;
    referenceType: string;
    referenceId: number;
    note?: string;
  },
  tx?: StockMovementTransaction,
) => {
  if (params.quantity <= 0) throw new Error("Quantity harus lebih dari 0");

  // Jika tidak ada tx, bungkus dengan transaction. Jika ada, langsung execute.
  if (!tx) {
    return await db.transaction(async (innerTx) => {
      return executeStockLogic(innerTx, params);
    });
  } else {
    return executeStockLogic(tx, params);
  }
};

/**
 * 🔐 Logic eksekusi stok (dipisah agar reusable)
 */
const executeStockLogic = async (
  tx: StockMovementTransaction,
  params: {
    bookId: number;
    type: StockMovementType;
    quantity: number;
    referenceType: string;
    referenceId: number;
    note?: string;
  },
) => {
  const { bookId, type, quantity, referenceType, referenceId, note } = params;

  // 1. Lock row buku (Mencegah race condition)
  const [book] = await tx
    .select()
    .from(bookTable)
    .where(eq(bookTable.id, bookId))
    .limit(1)
    .for("update");

  if (!book) throw new Error(`Buku dengan ID ${bookId} tidak ditemukan`);

  // 2. Hitung perubahan stok
  let signedQty: number;
  if (type === "ADJUSTMENT") {
    signedQty = quantity - book.currentStock;
  } else {
    signedQty = STOCK_DIRECTION[type as Exclude<StockMovementType, "ADJUSTMENT">] * quantity;
  }

  // 3. Validasi stok tidak minus
  const newStock = book.currentStock + signedQty;
  if (newStock < 0) {
    throw new Error(`Stok tidak mencukupi! Saat ini: ${book.currentStock}, diminta: ${quantity}`);
  }

  // 4. Insert riwayat movement
  await tx.insert(stockMovementTable).values({
    bookId,
    type,
    quantity,
    referenceType,
    referenceId,
    note: note || `${type} stock`,
    createdAt: new Date(),
  });

  // 5. Update stok buku
  await tx
    .update(bookTable)
    .set({
      currentStock: newStock,
      updatedAt: new Date(),
    })
    .where(eq(bookTable.id, bookId));

  return { success: true, currentStock: newStock };
};

/**
 * ✅ GET: Ambil riwayat pergerakan stok
 */
export const getStockMovementsByBookIdService = async (bookId: number) => {
  try {
    const result = await db
      .select()
      .from(stockMovementTable)
      .where(eq(stockMovementTable.bookId, bookId))
      .orderBy(desc(stockMovementTable.createdAt));
    return result;
  } catch (err) {
    throw err;
  }
};

/**
 * ✅ ADJUSTMENT: Wrapper untuk manual adjustment
 * ⚠️ quantity = STOK AKHIR yang diinginkan
 */
export const adjustStockService = async (data: {
  bookId: number;
  quantity: number;
  note?: string;
}) => {
  return await processStockMovement({
    bookId: data.bookId,
    type: "ADJUSTMENT",
    quantity: data.quantity,
    referenceType: "MANUAL_ADJUSTMENT",
    referenceId: 0,
    note: data.note || `Manual adjustment to ${data.quantity}`,
  });
};
