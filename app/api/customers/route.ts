import { handleAuthenticatedRequest } from "@/lib/request";
import {
  createCustomerController,
  getCustomersWithPaginationController,
} from "@/server/customers/customer.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: () => createCustomerController(req),
  });
};

export const GET = async (req: NextRequest) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: () => getCustomersWithPaginationController(req),
  });
};
