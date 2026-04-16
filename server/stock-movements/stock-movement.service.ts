import { db } from "@/lib/db";
import { stockMovementTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
// import { TStockMovement } from "@/app/(authenticated)/books/[id]/__hooks/use-get-movements.query";

export const getStockMovementsByBookIdService = async (bookId: number) => {
  try {
    const result = await db
      .select()
      .from(stockMovementTable)
      .where(eq(stockMovementTable.bookId, bookId))
      .orderBy(desc(stockMovementTable.createdAt));

    console.log(`[Stock Service] Found ${result.length} movements for bookId ${bookId}`);
    return result;
  } catch (err) {
    console.error("=== ERROR IN STOCK SERVICE ===");
    console.error("BookId:", bookId);
    console.error(err);
    throw err;   // penting: throw lagi supaya controller tangkap
  }
};

export const adjustStockService = async (data: {
  bookId: number;
  quantity: number;
  note?: string;
}) => {
  const { bookId, quantity, note } = data;

  const [movement] = await db
    .insert(stockMovementTable)
    .values({
      bookId,
      type: "ADJUSTMENT",
      referenceType: "MANUAL_ADJUSTMENT",
      referenceId: 0,                    // karena manual
      quantity,
      note: note || null,
    })
    .returning();

  return movement;
};
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
  
  console.log("Creating stock movement:", { bookId, type, referenceType, referenceId, quantity });
  
  await db.insert(stockMovementTable).values({
    bookId,
    type,
    referenceType,
    referenceId,
    quantity,
    note: note || null,
  });
};