import {
  deletePercetakanController,
  getPercetakanByIdController,
  updatePercetakanController,
} from "@/server/percetakans/percetakan.controller";
import { NextRequest } from "next/server";

export const GET = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;

  return await getPercetakanByIdController(id);
};

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;

  return await updatePercetakanController(id, req);
};

export const DELETE = async (_: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;

  return await deletePercetakanController(id);
};
