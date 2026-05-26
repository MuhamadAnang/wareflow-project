import { handleAuthenticatedRequest } from "@/lib/request";
import { approveOrRejectClerkUserController, deleteClerkUserController, getClerkUserByIdController, updateClerkUserController } from "@/server/clerk/clerk.controller";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };


export const GET = async (request: NextRequest, { params }: Params) => {
    const { id } = await params;

    return await handleAuthenticatedRequest({
        request,
        callback: async () => {
            return await getClerkUserByIdController(id)
        }
    })
}

export const POST = async (request: NextRequest, { params }: Params) => {
    const { id } = await params;

    return await handleAuthenticatedRequest({
        request,
        callback: async () => {
            return await approveOrRejectClerkUserController(request, id)
        }
    })
}

export const PUT = async (request: NextRequest, { params }: Params) => {
    const { id } = await params;

    return await handleAuthenticatedRequest({
        request,
        callback: async () => {
            return await updateClerkUserController(request, id)
        }
    })
}

export const DELETE = async (request: NextRequest, { params }: Params) => {
    const { id } = await params;

    return await handleAuthenticatedRequest({
        request,
        callback: async () => {
            return await deleteClerkUserController(id);
        }
    })
}