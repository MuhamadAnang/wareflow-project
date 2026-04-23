import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { parseSortParams } from "@/lib/query-param";
import { responseFormatter } from "@/lib/response-formatter";
import { CreateSupplierReturnSchema, IndexSupplierReturnQuerySchema } from "@/schemas/supplier-return.schema";
import { TSupplierReturnDetail, TSupplierReturnListItem } from "@/types/database";
import { NextRequest } from "next/server";
import {
  createSupplierReturnService,
  getSupplierReturnByIdService,
  getSupplierReturnListService,
} from "./supplier-return.service";

export const createSupplierReturnController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateSupplierReturnSchema, body);
    const supplierReturn = await createSupplierReturnService(body);
    return responseFormatter.created({
      data: supplierReturn,
      message: "Supplier return created successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getSupplierReturnListController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      supplierId: searchParams.get("supplierId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    const result = parseQueryParams(IndexSupplierReturnQuerySchema, rawQueryParams);
    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;
    const { data, meta } = await getSupplierReturnListService(queryParams);
    
    return responseFormatter.successWithPagination<TSupplierReturnListItem>({
      data,
      meta,
      message: "Supplier returns retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getSupplierReturnByIdController = async (id: number) => {
  try {
    const supplierReturn = await getSupplierReturnByIdService(id);
    return responseFormatter.successWithData<TSupplierReturnDetail>({
      data: supplierReturn,
      message: "Supplier return retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};