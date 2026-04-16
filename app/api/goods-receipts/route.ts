import { NextRequest } from "next/server";
import { createGoodsReceiptController, getGoodsReceiptsWithPaginationController } from "@/server/goods-receipts/goods-receipt.controller";

export const POST = async (req: NextRequest) => createGoodsReceiptController(req);
export const GET = async (req: NextRequest) => getGoodsReceiptsWithPaginationController(req);