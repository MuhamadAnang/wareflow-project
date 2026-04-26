import { handleAuthenticatedRequest } from "@/lib/request";
import {
  createSupplierReturnController,
  getSupplierReturnListController,
} from "@/server/supplier-returns/supplier-return.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: () => createSupplierReturnController(req),
  });
};

export const GET = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: () => getSupplierReturnListController(req),
  });
};