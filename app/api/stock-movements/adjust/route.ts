import { NextRequest } from "next/server";
import { adjustStockController } from "@/server/stock-movements/stock-movement.controller";
import { handleAuthenticatedRequest } from "@/lib/request";

export const POST = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: () => adjustStockController(req),
  });
};