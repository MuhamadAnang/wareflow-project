import { getGoodsOutByIdController } from "@/server/goods-out/goods-out.controller";
import { NextRequest } from "next/server";

export const GET = async (_: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  return await getGoodsOutByIdController(Number(id));
};