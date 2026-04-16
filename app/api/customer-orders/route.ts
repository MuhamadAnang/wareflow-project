import {
    createCustomerOrderController,
    getCustomerOrdersWithPaginationController,
  } from "@/server/customer-orders/customer-order.controller";
  import { NextRequest } from "next/server";
  
  export const POST = async (req: NextRequest) => {
    return await createCustomerOrderController(req);
  };
  
  export const GET = async (req: NextRequest) => {
    return await getCustomerOrdersWithPaginationController(req);
  };