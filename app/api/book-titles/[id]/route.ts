import { getBookTitleByIdController, updateBookTitleController, deleteBookTitleController } from "@/server/book-titles/book-title.controller";
import { NextRequest } from "next/server";

export const GET = async (_: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return new Response("Invalid ID", { status: 400 });

  return await getBookTitleByIdController(numericId);
};

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return new Response("Invalid ID", { status: 400 });

  return await updateBookTitleController(numericId, req);
};

export const DELETE = async (_: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return new Response("Invalid ID", { status: 400 });

  return await deleteBookTitleController(numericId);
};