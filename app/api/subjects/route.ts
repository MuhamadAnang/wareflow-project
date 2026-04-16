import { createSubjectController, getSubjectsWithPaginationController } from "@/server/subjects/subject.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return await createSubjectController(req);
};

export const GET = async (req: NextRequest) => {
  return await getSubjectsWithPaginationController(req);
};
  