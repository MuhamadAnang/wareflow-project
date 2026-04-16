import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { CreateOrUpdateSubjectSchema, IndexSubjectQuerySchema } from "@/schemas/subject.schema";
import { NextRequest } from "next/server";
import {
  createSubjectService,
  deleteSubjectService,
  getSubjectByIdService,
  getSubjectsWithPaginationService,
  updateSubjectService,
} from "./subject.service";
import { responseFormatter } from "@/lib/response-formatter";
import { parseSortParams } from "@/lib/query-param";
import { TSubject } from "@/types/database";

export const createSubjectController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateOrUpdateSubjectSchema, body);

    await createSubjectService(body);

    return responseFormatter.created({ message: "Mata pelajaran berhasil dibuat" });
  } catch (error) {
    return handleException(error);
  }
};

export const getSubjectsWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
    };

    const result = parseQueryParams(IndexSubjectQuerySchema, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Parameter query tidak valid",
      });
    }

    const queryParams = result.data;

    const { data, meta } = await getSubjectsWithPaginationService(queryParams);

    return responseFormatter.successWithPagination<TSubject>({
      data,
      meta,
      message: "Daftar mata pelajaran berhasil diambil",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getSubjectByIdController = async (id: number) => {
  try {
    const subject = await getSubjectByIdService(id);
    return responseFormatter.successWithData<TSubject>({
      data: subject,
      message: "Mata pelajaran berhasil diambil",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const updateSubjectController = async (id: number, req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateOrUpdateSubjectSchema, body);

    const updated = await updateSubjectService(id, body);

    return responseFormatter.successWithData<TSubject>({
      data: updated,
      message: "Mata pelajaran berhasil diperbarui",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteSubjectController = async (id: number) => {
  try {
    await deleteSubjectService(id);
    return responseFormatter.success({ message: "Mata pelajaran berhasil dihapus" });
  } catch (error) {
    return handleException(error);
  }
};