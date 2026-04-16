import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { CreateOrUpdateBookTitleSchema, IndexBookTitleQuerySchema } from "@/schemas/book-title.schema";
import { NextRequest } from "next/server";
import {
  createBookTitleService,
  deleteBookTitleService,
  getBookTitleByIdService,
  getBookTitlesWithPaginationService,
  updateBookTitleService,
} from "./book-title.service";
import { responseFormatter } from "@/lib/response-formatter";
import { parseSortParams } from "@/lib/query-param";
import { TBookTitle, TBookTitleDetail } from "@/types/database";

export const createBookTitleController = async (req: NextRequest) => {
  try {
    const body = await req.json();

    validateSchema(CreateOrUpdateBookTitleSchema, body);

    await createBookTitleService(body);

    return responseFormatter.created({ message: "BookTitle created successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const getBookTitlesWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      // limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined, // paksa Number di sini
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      subjectId: searchParams.get("subjectId") || undefined,
      level: searchParams.get("level") || undefined,
      curriculum: searchParams.get("curriculum") || undefined,
    };
    const result = parseQueryParams(IndexBookTitleQuerySchema, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;

    const effectiveParams = {
      ...queryParams,
      pageSize: queryParams.limit ?? queryParams.pageSize ?? 20,
    };

    const { data, meta } = await getBookTitlesWithPaginationService(effectiveParams);

    return responseFormatter.successWithPagination<TBookTitle>({
      data,
      meta,
      message: "Book titles retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getBookTitleByIdController = async (id: number) => {
  try {
    const bookTitle = await getBookTitleByIdService(id);

    return responseFormatter.successWithData<TBookTitleDetail>({
      data: bookTitle,
      message: "BookTitle retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteBookTitleController = async (id: number) => {
  try {
    await deleteBookTitleService(id);

    return responseFormatter.success({ message: "BookTitle deleted successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const updateBookTitleController = async (id: number, req: NextRequest) => {
  try {
    const body = await req.json();

    validateSchema(CreateOrUpdateBookTitleSchema, body);

    const updatedBookTitle = await updateBookTitleService(id, body);
    return responseFormatter.successWithData<TBookTitle>({
      data: updatedBookTitle,
      message: "BookTitle updated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
