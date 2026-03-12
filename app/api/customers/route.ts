import {
  createCustomerController,
  getCustomersWithPaginationController,
} from "@/server/customers/customer.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return await createCustomerController(req);
};

export const GET = async (req: NextRequest) => {
  return await getCustomersWithPaginationController(req);
};
