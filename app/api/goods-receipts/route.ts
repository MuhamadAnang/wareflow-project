import { NextRequest } from "next/server";
import { createGoodsReceiptController, getGoodsReceiptsWithPaginationController } from "@/server/goods-receipts/goods-receipt.controller";
import { handleAuthenticatedRequest } from "@/lib/request";

export const POST = async (req: NextRequest) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: () => createGoodsReceiptController(req),
  });
};

export const GET = async (req: NextRequest) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: () => getGoodsReceiptsWithPaginationController(req),
  });
};