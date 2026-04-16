import { NextRequest } from "next/server";
import { adjustStockController } from "@/server/stock-movements/stock-movement.controller";

export const POST = async (req: NextRequest) => {
  return await adjustStockController(req);
};