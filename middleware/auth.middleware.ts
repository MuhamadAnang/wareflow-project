"use server";

import { TMiddlewareResponse } from "@/lib/request";
import { NextRequest, NextResponse } from "next/server";
import { clerkService } from "@/server/clerk/clerk.service";

export type TAuthMiddlewareData = {
  clerkUserId: string;
  sessionId: string;
};

export const authMiddleware = async (
  req: NextRequest,
): Promise<TMiddlewareResponse<TAuthMiddlewareData>> => {
  try {
    const authData = await clerkService.authenticateRequest(req);

    if (!authData) {
      return {
        pass: false,
        response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
      };
    }

    const { sessionId, userId } = authData;

    if (!userId) {
      return {
        pass: false,
        response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
      };
    }

    return {
      pass: true,
      data: { clerkUserId: userId, sessionId },
      response: NextResponse.json({ message: "Authorized" }, { status: 200 }),
    };
  } catch {
    return {
      pass: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
};