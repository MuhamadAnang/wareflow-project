import { NextRequest } from "next/server";
import { getStockMovementsByBookIdService, adjustStockService } from "./stock-movement.service";
import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import { BadRequestException } from "@/common/exception/bad-request.exception";

export const getStockMovementsController = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      throw new BadRequestException("bookId query parameter is required");
    }

    const movements = await getStockMovementsByBookIdService(Number(bookId));
    return responseFormatter.successWithData({
      data: movements,
      message: "Stock movements retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const adjustStockController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { bookId, quantity, note } = body;

    if (!bookId || quantity === undefined) {
      throw new BadRequestException("bookId and quantity (target stock) are required");
    }

    const result = await adjustStockService({
      bookId: Number(bookId),
      quantity: Number(quantity), // ⚠️ ini adalah STOK AKHIR
      note,
    });

    return responseFormatter.successWithData({
      data: result,
      message: "Stock adjusted successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
