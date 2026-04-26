import { handleAuthenticatedRequest } from "@/lib/request";
import { createBookController, getBooksWithPaginationController } from "@/server/books/book.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    return await handleAuthenticatedRequest({
        request: req,
        callback: createBookController,
    });
};

export const GET = async (req: NextRequest) => {
    return await handleAuthenticatedRequest({
        request: req,
        callback: getBooksWithPaginationController,
    });
};