import { handleAuthenticatedRequest } from "@/lib/request";
import {
  createPercetakanController,
  getPercetakansWithPaginationController,
} from "@/server/percetakans/percetakan.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: () => createPercetakanController(req),
  });
};

export const GET = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: () => getPercetakansWithPaginationController(req),
  });
};
