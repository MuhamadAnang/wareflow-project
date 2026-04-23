import { db } from "@/lib/db";
import { stockMovementTable, bookTable, stockMovementTypeEnum, schema } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";


export type StockMovementType = typeof stockMovementTypeEnum.enumValues[number];

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
  tx?: NodePgDatabase<typeof schema>
) => {
  const { bookId, type, quantity, referenceType, referenceId, note } = params;

  if (quantity <= 0) throw new Error("Quantity harus lebih dari 0");

  // Gunakan tx yang diterima, atau db jika tidak ada
  const executor = tx || db;

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
  tx: NodePgDatabase<typeof schema>,
  params: {
    bookId: number;
    type: StockMovementType;
    quantity: number;
    referenceType: string;
    referenceId: number;
    note?: string;
  }
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
    console.error("=== ERROR IN STOCK SERVICE ===", err);
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

/**
 * ✅ CREATE: Wrapper umum untuk IN/OUT/RETURN (standalone)
 * ⚠️ quantity = JUMLAH ABSOLUT (selalu positif)
 * ⚠️ Jika dipanggil dari dalam transaction lain, gunakan processStockMovement langsung + tx
 */
// export const createStockMovementService = async (params: {
//   bookId: number;
//   type: StockMovementType;
//   referenceType: string;
//   referenceId: number;
//   quantity: number;
//   note?: string;
// }) => {
//   return await processStockMovement(params); // Tidak ada tx = standalone transaction
// };

interface CreateStockMovementParams {
  bookId: number;
  type: "IN_PURCHASE" | "OUT_SALES" | "RETURN_CUSTOMER" | "RETURN_SUPPLIER" | "ADJUSTMENT";
  referenceType: string;
  referenceId: number;
  quantity: number;
  note?: string;
}

export const createStockMovementService = async (params: CreateStockMovementParams) => {
  const { bookId, type, referenceType, referenceId, quantity, note } = params;
  
  // Gunakan query builder biasa, bukan db.query (yang butuh relations)
  const book = await db
    .select({ currentStock: bookTable.currentStock })
    .from(bookTable)
    .where(eq(bookTable.id, bookId))
    .limit(1);

  if (!book || book.length === 0) {
    throw new Error(`Book with ID ${bookId} not found`);
  }

  const currentStock = book[0].currentStock;
  const newStock = currentStock + quantity;
  
  if (newStock < 0) {
    throw new Error(`Insufficient stock for book ID ${bookId}. Current stock: ${currentStock}`);
  }

  // Gunakan transaction agar semua operasi berjalan atomic
  await db.transaction(async (tx) => {
    // Insert stock movement
    await tx.insert(stockMovementTable).values({
      bookId,
      type,
      referenceType,
      referenceId,
      quantity,
      note: note || null,
    });

    // Update current stock
    await tx
      .update(bookTable)
      .set({ currentStock: newStock })
      .where(eq(bookTable.id, bookId));
  });
};