import { getStockMovementsController } from "@/server/stock-movements/stock-movement.controller";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return await getStockMovementsController(req);
};