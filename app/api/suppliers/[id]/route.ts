import {
    deleteSupplierController,
    getSupplierByIdController,
    updateSupplierController,
  } from "@/server/suppliers/supplier.controller";
  import { NextRequest } from "next/server";
  
  export const GET = async (_: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return new Response(JSON.stringify({ error: "ID tidak valid" }), { status: 400 });
  
    return await getSupplierByIdController(id);
  };
  
  export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return new Response(JSON.stringify({ error: "ID tidak valid" }), { status: 400 });
  
    return await updateSupplierController(id, req);
  };
  
  export const DELETE = async (_: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return new Response(JSON.stringify({ error: "ID tidak valid" }), { status: 400 });
  
    return await deleteSupplierController(id);
  };