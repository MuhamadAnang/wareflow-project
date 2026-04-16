import { createBookController, getBooksWithPaginationController } from "@/server/books/book.controller";
import { NextRequest } from "next/server";

export const POST = (req: NextRequest) => createBookController(req);
export const GET = (req: NextRequest) => getBooksWithPaginationController(req);