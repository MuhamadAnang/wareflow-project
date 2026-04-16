import { NextRequest } from "next/server";
import { getAvailableOrdersController } from "@/server/customer-orders/customer-order.controller";

export const GET = async (req: NextRequest) => {
  return await getAvailableOrdersController(req);
};