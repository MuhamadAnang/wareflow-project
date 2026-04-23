import {
  createSupplierReturnController,
  getSupplierReturnListController,
} from "@/server/supplier-returns/supplier-return.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return await createSupplierReturnController(req);
};

export const GET = async (req: NextRequest) => {
  return await getSupplierReturnListController(req);
};