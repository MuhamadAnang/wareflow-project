import { NextRequest } from "next/server";
import {
  getGoodsReceiptByIdController,
  updateGoodsReceiptController,
  deleteGoodsReceiptController,
} from "@/server/goods-receipts/goods-receipt.controller";

export const GET = async (_: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  return await getGoodsReceiptByIdController(Number(id));
};

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  return await updateGoodsReceiptController(Number(id), req);
};

export const DELETE = async (_: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  return await deleteGoodsReceiptController(Number(id));
};