import { handleAuthenticatedRequest } from "@/lib/request";
import {
  createClerkUserController,
  getClerkUsersController,
} from "@/server/clerk/clerk.controller";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getClerkUsersController(request);
    },
  });
};

export const POST = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await createClerkUserController(request);
    },
  });
};
