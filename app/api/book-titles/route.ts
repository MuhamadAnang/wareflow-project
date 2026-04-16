import { createBookTitleController, getBookTitlesWithPaginationController } from "@/server/book-titles/book-title.controller";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return await getBookTitlesWithPaginationController(req);
};

export const POST = async (req: NextRequest) => {
  return await createBookTitleController(req);
};