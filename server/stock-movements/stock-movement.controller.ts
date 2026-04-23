// server/stock-movements/stock-movement.controller.ts
import { NextRequest, NextResponse } from "next/server";
import { 
  getStockMovementsByBookIdService, 
  adjustStockService,
  createStockMovementService,
  StockMovementType 
} from "./stock-movement.service";

export const getStockMovementsController = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "bookId is required" }, { status: 400 });
    }

    const movements = await getStockMovementsByBookIdService(Number(bookId));
    return NextResponse.json({ data: movements }, { status: 200 });
  } catch (error: any) {
    console.error("[STOCK_MOVEMENTS_GET_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to fetch stock movements" }, { status: 500 });
  }
};

export const adjustStockController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { bookId, quantity, note } = body;

    if (!bookId || quantity === undefined) {
      return NextResponse.json({ error: "bookId and quantity (target stock) are required" }, { status: 400 });
    }

    const result = await adjustStockService({
      bookId: Number(bookId),
      quantity: Number(quantity), // ⚠️ ini adalah STOK AKHIR
      note,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[ADJUST_STOCK_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to adjust stock" },
      { status: error.message?.includes("Stok tidak mencukupi") ? 400 : 500 }
    );
  }
};

export const createStockMovementController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { bookId, type, referenceType, referenceId, quantity, note } = body;

    if (!bookId || !type || !referenceType || referenceId === undefined || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await createStockMovementService({
      bookId: Number(bookId),
      type: type as StockMovementType,
      referenceType,
      referenceId: Number(referenceId),
      quantity: Number(quantity), // absolut
      note,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("[CREATE_STOCK_MOVEMENT_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create stock movement" },
      { status: error.message?.includes("Stok tidak mencukupi") ? 400 : 500 }
    );
  }
};