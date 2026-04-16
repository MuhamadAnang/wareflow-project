import {
  deleteCustomerOrderController,
  getCustomerOrderByIdController,
  updateCustomerOrderStatusController,
} from "@/server/customer-orders/customer-order.controller";
import { NextRequest } from "next/server";

export const GET = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;
  return await getCustomerOrderByIdController(id);
};

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;
  return await updateCustomerOrderStatusController(id, req);
};

export const DELETE = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;
  return await deleteCustomerOrderController(id);
};