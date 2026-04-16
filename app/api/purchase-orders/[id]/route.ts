import {
    deletePurchaseOrderController,
    getPurchaseOrderByIdController,
    updatePurchaseOrderController,
  } from "@/server/purchase-orders/purchase-order.controller";
  import { NextRequest } from "next/server";
  
  export const GET = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
    const { id } = await context.params;
    return await getPurchaseOrderByIdController(id);
  };
  
  export const PUT = async (req: NextRequest, context: { params: Promise<{ id: number }> }) => {
    const { id } = await context.params;
    return await updatePurchaseOrderController(id, req);
  };
  
  export const DELETE = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
    const { id } = await context.params;
    return await deletePurchaseOrderController(id);
  };