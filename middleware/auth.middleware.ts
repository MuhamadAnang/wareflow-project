"use server";

import { TMiddlewareResponse } from "@/lib/request";
import { NextRequest, NextResponse } from "next/server";
import { clerkAuthenticateRequestService } from "@/server/clerk/clerk.service";
import { clerkClient } from "@clerk/nextjs/server";

export type TAuthMiddlewareData = {
  clerkUserId: string;
  sessionId: string;
};

export const authMiddleware = async (
  req: NextRequest,
): Promise<TMiddlewareResponse<TAuthMiddlewareData>> => {
  try {
    const authData = await clerkAuthenticateRequestService(req);

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

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isAllowed = user.publicMetadata?.isAllowed === true;

    if (!isAllowed) {
      return {
        pass: false,
        response: NextResponse.json(
          { message: "Akun sedang menunggu persetujuan admin." },
          { status: 403 },
        ),
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
