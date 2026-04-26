import "server-only";

import env from "@/common/config/environtment";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const clerkService = {
    authenticateRequest: async (req: NextRequest) => {
        const client = await clerkClient();

        const { toAuth } = await client.authenticateRequest(req, {
            jwtKey: env.CLERK_JWT_KEY,
        });

        return toAuth();
    },
};