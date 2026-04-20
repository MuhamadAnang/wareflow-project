import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { CreateOrUpdatePercetakanSchema, IndexPercetakanQuerySchema } from "@/schemas/percetakan.schema";
import { NextRequest } from "next/server";
import {
  createPercetakanService,
  deletePercetakanService,
  getPercetakanByIdService,
  getPercetakansWithPaginationService,
  updatePercetakanService,
} from "./percetakan.service";
import { responseFormatter } from "@/lib/response-formatter";
import { parseSortParams } from "@/lib/query-param";
import { TPercetakan } from "@/types/database";

export const createPercetakanController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateOrUpdatePercetakanSchema, body);
    const newPercetakan = await createPercetakanService(body); // pastikan service mengembalikan data

    return responseFormatter.created({
      data: newPercetakan[0], // mengembalikan data percetakan
      message: "percetakan created successfully"
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getPercetakansWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      status: searchParams.get("status") || undefined,
    };

    const result = parseQueryParams(IndexPercetakanQuerySchema, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;

    const { data, meta } = await getPercetakansWithPaginationService(queryParams);

    return responseFormatter.successWithPagination<TPercetakan>({
      data,
      meta,
      message: "Roles retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getPercetakanByIdController = async (id: number) => {
  try {
    const percetakan = await getPercetakanByIdService(id);

    return responseFormatter.successWithData<TPercetakan>({
      data: percetakan,
      message: "percetakan retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deletePercetakanController = async (id: number) => {
  try {
    await deletePercetakanService(id);

    return responseFormatter.success({ message: "percetakan deleted successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const updatePercetakanController = async (id: number, req: NextRequest) => {
  try {
    const body = await req.json();

    validateSchema(CreateOrUpdatePercetakanSchema, body);

    const updatedPercetakan = await updatePercetakanService(id, body);

    return responseFormatter.successWithData<TPercetakan>({
      data: updatedPercetakan,
      message: "percetakan updated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
