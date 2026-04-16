import { handleException } from "@/common/exception/helper";
import { NextRequest } from "next/server";
import { responseFormatter } from "@/lib/response-formatter";
import { adjustStockService, getStockMovementsByBookIdService } from "./stock-movement.service";
import z from "zod";
import { validateSchema } from "@/lib/validation";

const AdjustStockSchema = z.object({
  bookId: z.number().int().positive(),
  quantity: z.number().int(),           // bisa positif atau negatif
  note: z.string().optional(),
});

export const getStockMovementsController = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const bookIdStr = searchParams.get("bookId");

    if (!bookIdStr || isNaN(Number(bookIdStr))) {
      return responseFormatter.badRequest({ message: "bookId wajib dan harus number" });
    }

    const bookId = Number(bookIdStr);

    console.log(`[Stock Movement] Fetching for bookId: ${bookId}`);   // ← tambah ini

    const movements = await getStockMovementsByBookIdService(bookId);

    return responseFormatter.successWithData({
      data: movements,
      message: "Riwayat stok berhasil diambil",
    });
  } catch (error) {
    console.error("=== ERROR STOCK MOVEMENTS ===");   // ← TAMBAH INI
    console.error(error);                              // ← TAMBAH INI
    return handleException(error);
  }
};


export const adjustStockController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(AdjustStockSchema, body);

    const result = await adjustStockService(body);

    return responseFormatter.successWithData({
      data: result,
      message: "Penyesuaian stok berhasil dilakukan",
    });
  } catch (error) {
    return handleException(error);
  }
};