import {
  deleteCustomerController,
  getCustomerByIdController,
  updateCustomerController,
} from "@/server/customers/customer.controller";
import { NextRequest } from "next/server";

export const GET = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;

  return await getCustomerByIdController(id);
};

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;

  return await updateCustomerController(id, req);
};

export const DELETE = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;

  return await deleteCustomerController(id);
};
