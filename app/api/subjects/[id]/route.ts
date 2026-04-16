import {
  deleteSubjectController,
  getSubjectByIdController,
  updateSubjectController,
} from "@/server/subjects/subject.controller";
import { NextRequest } from "next/server";

export const GET = async (_: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  return await getSubjectByIdController(id);
};

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;

  return await updateSubjectController(id, req);
};

export const DELETE = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;

  return await deleteSubjectController(id);
};
