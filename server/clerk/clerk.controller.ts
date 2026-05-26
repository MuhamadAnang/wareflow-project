import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import { NextRequest } from "next/server";
import "server-only";
import { approveOrRejectClerkUserService, createClerkUserService, deleteClerkUserService, getClerkUserByIdService, getClerkUsersService, updateClerkUserService } from "./clerk.service";
import { responseFormatter } from "@/lib/response-formatter";
import { NotFoundException } from "@/common/exception/not-found.exception";
import { ActionApprovalUserSchema, CreateOrUpdateClerkUserSchema, TActionApprovalUser, TCreateOrUpdateClerkUserSchema } from "@/schemas/clerk.schema";

export const getClerkUsersController = async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);

        const queryParams = {
            page: searchParams.get("page") || 1,
            pageSize: searchParams.get("pageSize") || 10,
            sort: searchParams.get("sort") || undefined,
            search: searchParams.get("search") || undefined,
        }

        const { data: result } = parseQueryParams(IndexQueryParams, queryParams);

        const { data, meta } = await getClerkUsersService(result);

        return responseFormatter.successWithPagination({
            data,
            meta,
            message: "Successfully fetched users from Clerk"
        })

    } catch (error) {
        return handleException(error)
    }
}

export const getClerkUserByIdController = async (id: string) => {
    try {
        const user = await getClerkUserByIdService(id);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return responseFormatter.successWithData({
            data: user,
            message: "Successfully fetched user from Clerk"
        })
    } catch (error) {
        return handleException(error)
    }
}

export const approveOrRejectClerkUserController = async (request: NextRequest, id: string) => {
    try {
        const body = await request.json();

        const { data } = validateSchema<TActionApprovalUser>(ActionApprovalUserSchema, body)

        const result = await approveOrRejectClerkUserService(id, data);

        let message;

        switch (data.action) {
            case "approve":
                message = "User approved successfully";
                break;
            case "reject":
                message = "User rejected successfully";
                break;
            case "suspend":
                message = "User suspended successfully";
                break;
            case "unsuspend":
                message = "User unsuspended successfully";
                break;
        }

        return responseFormatter.successWithData({
            data: result,
            message
        })
    } catch (error) {
        return handleException(error)
    }
}

export const createClerkUserController = async (request: NextRequest) => {
    try {
        const body = await request.json()

        const { data } = validateSchema<TCreateOrUpdateClerkUserSchema>(CreateOrUpdateClerkUserSchema, body)


        const result = await createClerkUserService(data);


        return responseFormatter.successWithData({
            data: result,
            message: "User created successfully"
        })
    } catch (error) {
        return handleException(error)
    }
}

export const updateClerkUserController = async (request: NextRequest, id: string) => {
    try {
        const body = await request.json();

        const { data } = validateSchema<TCreateOrUpdateClerkUserSchema>(CreateOrUpdateClerkUserSchema, body)

        const result = await updateClerkUserService(id, data);

        return responseFormatter.successWithData({
            data: result,
            message: "User updated successfully"
        })
    } catch (error) {
        return handleException(error)
    }
}

export const deleteClerkUserController = async (id: string) => {
    try {
        const result = await deleteClerkUserService(id);

        return responseFormatter.successWithData({
            data: result,
            message: "User deleted successfully"
        })
    } catch (error) {
        return handleException(error)
    }
}