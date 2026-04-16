import { NextRequest } from "next/server";
import {
  createPurchaseOrderController,
  getPurchaseOrdersWithPaginationController,
} from "@/server/purchase-orders/purchase-order.controller";

export const GET = async (req: NextRequest) => {
  return await getPurchaseOrdersWithPaginationController(req);
};

export const POST = async (req: NextRequest) => {
  return await createPurchaseOrderController(req);
};