import { getCustomerReturnByIdController } from "@/server/customer-returns/customer-return.controller";
import { NextRequest } from "next/server";

export const GET = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;
  return await getCustomerReturnByIdController(id);
};