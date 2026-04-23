import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { parseSortParams } from "@/lib/query-param";
import { responseFormatter } from "@/lib/response-formatter";
import { CreateCustomerReturnSchema, IndexCustomerReturnQuerySchema } from "@/schemas/customer-return.schema";
import { NextRequest } from "next/server";
import {
  createCustomerReturnService,
  getCustomerReturnByIdService,
  getCustomerReturnListService,
} from "./customer-return.service";
import { TCustomerReturnDetail, TCustomerReturnListItem } from "@/types/database";

export const createCustomerReturnController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateCustomerReturnSchema, body);
    const customerReturn = await createCustomerReturnService(body);
    return responseFormatter.created({
      data: customerReturn,
      message: "Customer return created successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getCustomerReturnListController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      customerId: searchParams.get("customerId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    const result = parseQueryParams(IndexCustomerReturnQuerySchema, rawQueryParams);
    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;
    const { data, meta } = await getCustomerReturnListService(queryParams);
    
    return responseFormatter.successWithPagination<TCustomerReturnListItem>({
      data,
      meta,
      message: "Customer returns retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getCustomerReturnByIdController = async (id: number) => {
  try {
    const customerReturn = await getCustomerReturnByIdService(id);
    return responseFormatter.successWithData<TCustomerReturnDetail>({
      data: customerReturn,
      message: "Customer return retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};