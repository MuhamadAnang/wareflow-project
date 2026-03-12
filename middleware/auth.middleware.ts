import { TMiddlewareResponse } from "@/lib/request";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export type TAuthMiddlewareData = {
  clerkUserId: string;
  sessionId: string;
};

export const authMiddleware = async (
  req: NextRequest,
): Promise<TMiddlewareResponse<TAuthMiddlewareData>> => {
  try {
    const {isAuthenticated, sessionId, userId } = getAuth(req);

    if (!isAuthenticated) {
      return {
        pass: false,
        response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
      };
    }

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
