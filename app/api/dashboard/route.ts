import { handleAuthenticatedRequest } from "@/lib/request";
import { getDashboardStatsController } from "@/server/dashboard/dashboard.controller";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return await handleAuthenticatedRequest({
    request: req,
    callback: () => getDashboardStatsController(req),
  });
};