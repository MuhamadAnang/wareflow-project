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
    const formData = await req.formData();
    const body: any = {};

    console.log("✅ FormData diterima, jumlah field:", formData.entries().length);

    for (const [key, value] of formData.entries()) {
      console.log(`Field: ${key} → tipe: ${value instanceof File ? "FILE" : typeof value}`);
      
      if (value instanceof File) {
        body[key] = value;
      } else {
        body[key] = value === "null" || value === "" ? null : value;
      }
    }

    // Convert ke number
    if (body.subjectId) body.subjectId = Number(body.subjectId);
    if (body.grade) body.grade = Number(body.grade);
    if (body.percetakanId) body.percetakanId = Number(body.percetakanId);
    if (body.pages) body.pages = body.pages ? Number(body.pages) : null;
    if (body.productionYear) body.productionYear = body.productionYear ? Number(body.productionYear) : null;

    console.log("Body setelah parsing:", {
      code: body.code,
      hasImage: body.image instanceof File,
      imageName: body.image?.name,
    });

    validateSchema(CreateOrUpdateBookSchema, body);

    await createBookService(body);

    return responseFormatter.created({ message: "Buku berhasil dibuat" });
  } catch (error: any) {
    console.error("❌ Create Book Error:", error);
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
    const body: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      console.log("🔄 Update FormData diterima");

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          body[key] = value;
        } else {
          body[key] = value === "null" || value === "" ? null : value;
        }
      }
    } else {
      // Fallback ke JSON
      const json = await req.json();
      Object.assign(body, json);
    }

    // Convert ke number
    if (body.subjectId) body.subjectId = Number(body.subjectId);
    if (body.grade) body.grade = Number(body.grade);
    if (body.percetakanId) body.percetakanId = Number(body.percetakanId);
    if (body.pages) body.pages = body.pages ? Number(body.pages) : null;
    if (body.productionYear) body.productionYear = body.productionYear ? Number(body.productionYear) : null;

    validateSchema(CreateOrUpdateBookSchema, body);
    const updated = await updateBookService(id, body);

    return responseFormatter.successWithData({
      data: updated,
      message: "Buku berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("❌ Update Book Error:", error);
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