import { NextRequest } from "next/server";
import { getAvailableOrdersController } from "@/server/customer-orders/customer-order.controller";
import { handleAuthenticatedRequest } from "@/lib/request";

export const GET = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: getAvailableOrdersController,
  });
};