import { handleAuthenticatedRequest } from "@/lib/request";
import { getPriorityDistributionController } from "@/server/mcdm/priority.controller";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: () => getPriorityDistributionController(req),
  });
};