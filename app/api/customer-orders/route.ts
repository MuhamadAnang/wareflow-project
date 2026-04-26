import { handleAuthenticatedRequest } from "@/lib/request";
import {
  createCustomerOrderController,
  getCustomerOrdersWithPaginationController,
} from "@/server/customer-orders/customer-order.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: () => createCustomerOrderController(req),
  });
};

export const GET = async (req: NextRequest) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: () => getCustomerOrdersWithPaginationController(req),
  });
};