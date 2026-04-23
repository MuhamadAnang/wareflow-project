import { getSupplierReturnByIdController } from "@/server/supplier-returns/supplier-return.controller";
import { NextRequest } from "next/server";

export const GET = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;
  return await getSupplierReturnByIdController(id);
};