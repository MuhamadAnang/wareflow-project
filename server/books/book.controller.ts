import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { CreateOrUpdateBookSchema, IndexBookQuerySchema } from "@/schemas/book.schema";
import { NextRequest } from "next/server";
import {
  createBookService,
  deleteBookService,
  getBookByIdService,
  getBooksWithPaginationService,
  updateBookService,
} from "./book.service";
import { responseFormatter } from "@/lib/response-formatter";
import { parseSortParams } from "@/lib/query-param";
import { TBookListItem } from "@/types/database";

export const createBookController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateOrUpdateBookSchema, body);

    await createBookService(body);

    return responseFormatter.created({ message: "Buku berhasil ditambahkan" });
  } catch (error) {
    return handleException(error);
  }
};

export const getBooksWithPaginationController = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const raw = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      subjectId: searchParams.get("subjectId") || undefined,
      grade: searchParams.get("grade") || undefined,
      level: searchParams.get("level") || undefined,
      curriculum: searchParams.get("curriculum") || undefined,
      semester: searchParams.get("semester") || undefined,
      percetakanId: searchParams.get("percetakanId") || undefined,
    };

    const parsed = parseQueryParams(IndexBookQuerySchema, raw);
    if (!parsed.success) {
      return responseFormatter.validationError({
        error: parsed.error,
        message: "Invalid query parameters",
      });
    }

    const { data, meta } = await getBooksWithPaginationService(parsed.data);

    return responseFormatter.successWithPagination<TBookListItem>({
      data,
      meta,
      message: "Daftar buku berhasil diambil",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getBookByIdController = async (id: number) => {
  try {
    const book = await getBookByIdService(id);
    return responseFormatter.successWithData<TBookListItem>({
      data: book,
      message: "Data buku berhasil diambil",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const updateBookController = async (id: number, req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateOrUpdateBookSchema, body);

    const updated = await updateBookService(id, body);
    return responseFormatter.successWithData<TBookListItem>({
      data: updated,
      message: "Buku berhasil diperbarui",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteBookController = async (id: number) => {
  try {
    await deleteBookService(id);
    return responseFormatter.success({ message: "Buku berhasil dihapus" });
  } catch (error) {
    return handleException(error);
  }
};