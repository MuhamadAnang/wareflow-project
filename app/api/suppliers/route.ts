import {
    createSupplierController,
    getSuppliersWithPaginationController,
  } from "@/server/suppliers/supplier.controller";
  import { NextRequest } from "next/server";
  
  export const POST = async (req: NextRequest) => {
    return await createSupplierController(req);
  };
  
  export const GET = async (req: NextRequest) => {
    return await getSuppliersWithPaginationController(req);
  };