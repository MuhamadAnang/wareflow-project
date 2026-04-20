import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { CreateOrUpdateCustomerSchema, IndexCustomerQuerySchema } from "@/schemas/customer.schema";
import { NextRequest } from "next/server";
import {
  createCustomerService,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomersWithPaginationService,
  updateCustomerService,
} from "./customer.service";
import { responseFormatter } from "@/lib/response-formatter";
import { parseSortParams } from "@/lib/query-param";
import { TCustomer } from "@/types/database";

export const createCustomerController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateOrUpdateCustomerSchema, body);
    const newCustomer = await createCustomerService(body); // pastikan service mengembalikan data
    
    return responseFormatter.created({ 
      data: newCustomer[0], // mengembalikan data customer
      message: "Customer created successfully" 
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getCustomersWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      status: searchParams.get("status") || undefined,
    };

    const result = parseQueryParams(IndexCustomerQuerySchema, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;

    const { data, meta } = await getCustomersWithPaginationService(queryParams);

    return responseFormatter.successWithPagination<TCustomer>({
      data,
      meta,
      message: "Roles retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getCustomerByIdController = async (id: number) => {
  try {
    const customer = await getCustomerByIdService(id);

    return responseFormatter.successWithData<TCustomer>({
      data: customer,
      message: "Customer retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteCustomerController = async (id: number) => {
  try {
    await deleteCustomerService(id);

    return responseFormatter.success({ message: "Customer deleted successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const updateCustomerController = async (id: number, req: NextRequest) => {
  try {
    const body = await req.json();

    validateSchema(CreateOrUpdateCustomerSchema, body);

    const updatedCustomer = await updateCustomerService(id, body);

    return responseFormatter.successWithData<TCustomer>({
      data: updatedCustomer,
      message: "Customer updated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
