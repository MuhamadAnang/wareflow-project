import { handleAuthenticatedRequest } from "@/lib/request";
import { createSubjectController, getSubjectsWithPaginationController } from "@/server/subjects/subject.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: createSubjectController,
  });
};

export const GET = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: getSubjectsWithPaginationController,
  });
};
