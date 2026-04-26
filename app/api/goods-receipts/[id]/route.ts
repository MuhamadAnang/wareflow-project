import { handleAuthenticatedRequest } from "@/lib/request";
import {
  getGoodsReceiptByIdController,
  updateGoodsReceiptController,
  deleteGoodsReceiptController,
} from "@/server/goods-receipts/goods-receipt.controller";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

const parseId = (id: string) => {
  const num = Number(id);
  if (isNaN(num)) throw new Error("Invalid ID");
  return num;
};

export const GET = async (req: NextRequest, { params }: Params) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: async () => {
      const { id } = await params;
      return getGoodsReceiptByIdController(parseId(id));
    },
  });
};

export const PUT = async (req: NextRequest, { params }: Params) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: async () => {
      const { id } = await params;
      return updateGoodsReceiptController(parseId(id), req);
    },
  });
};

export const DELETE = async (req: NextRequest, { params }: Params) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: async () => {
      const { id } = await params;
      return deleteGoodsReceiptController(parseId(id));
    },
  });
};