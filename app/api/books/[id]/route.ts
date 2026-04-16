import {
    deleteBookController,
    getBookByIdController,
    updateBookController,
  } from "@/server/books/book.controller";
  import { NextRequest } from "next/server";
  
  export const GET = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return getBookByIdController(Number(id));
  };
  
  export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return updateBookController(Number(id), req);
  };
  
  export const DELETE = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return deleteBookController(Number(id));
  };