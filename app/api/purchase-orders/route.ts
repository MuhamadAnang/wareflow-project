import { NextRequest } from "next/server";
import {
  createPurchaseOrderController,
  getPurchaseOrdersWithPaginationController,
} from "@/server/purchase-orders/purchase-order.controller";
import { handleAuthenticatedRequest } from "@/lib/request";

export const GET = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: () => getPurchaseOrdersWithPaginationController(req),
  });
};

export const POST = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: () => createPurchaseOrderController(req),
  });
};