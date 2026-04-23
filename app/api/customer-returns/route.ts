import {
  createCustomerReturnController,
  getCustomerReturnListController,
} from "@/server/customer-returns/customer-return.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return await createCustomerReturnController(req);
};

export const GET = async (req: NextRequest) => {
  return await getCustomerReturnListController(req);
};