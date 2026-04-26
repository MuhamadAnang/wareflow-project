import { handleAuthenticatedRequest } from "@/lib/request";
import {
    createSupplierController,
    getSuppliersWithPaginationController,
  } from "@/server/suppliers/supplier.controller";
  import { NextRequest } from "next/server";
  
  export const POST = async (req: NextRequest) => {
    return await handleAuthenticatedRequest({
      request: req,
      callback: () => createSupplierController(req),
    });
  };

  export const GET = async (req: NextRequest) => {
    return await handleAuthenticatedRequest({
      request: req,
      callback: () => getSuppliersWithPaginationController(req),
    });
  };