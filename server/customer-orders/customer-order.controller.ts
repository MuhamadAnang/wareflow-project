import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import {
  CreateCustomerOrderFormSchema,
  IndexCustomerOrderQuerySchema,
  UpdateCustomerOrderStatusSchema,
} from "@/schemas/customer-order.schema";
import { NextRequest } from "next/server";
import {
  createCustomerOrderService,
  deleteCustomerOrderService,
  getCustomerOrderByIdService,
  getCustomerOrdersWithPaginationService,
  updateCustomerOrderStatusService,
  cancelCustomerOrderService,
  getAvailableOrdersService,
} from "./customer-order.service";
import { responseFormatter } from "@/lib/response-formatter";
import { parseSortParams } from "@/lib/query-param";
import { TCustomerOrderDetail, TCustomerOrderListItem } from "@/types/database";

export const createCustomerOrderController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateCustomerOrderFormSchema, body);
    const order = await createCustomerOrderService(body);
    return responseFormatter.created({ data: order, message: "Customer order created successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const getCustomerOrdersWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      customerId: searchParams.get("customerId") || undefined,
      status: searchParams.get("status") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    const result = parseQueryParams(IndexCustomerOrderQuerySchema, rawQueryParams);
    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;
    const { data, meta } = await getCustomerOrdersWithPaginationService(queryParams);
    return responseFormatter.successWithPagination<TCustomerOrderListItem>({
      data,
      meta,
      message: "Customer orders retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getCustomerOrderByIdController = async (id: number) => {
  try {
    const order = await getCustomerOrderByIdService(id);
    return responseFormatter.successWithData<TCustomerOrderDetail>({
      data: order,
      message: "Customer order retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

// File: server/customer-orders/customer-order.controller.ts

export const updateCustomerOrderStatusController = async (id: number, req: NextRequest) => {
  try {
    const body = await req.json();
    console.log("Update status request body:", body);
    
    validateSchema(UpdateCustomerOrderStatusSchema, body);
    
    const updated = await updateCustomerOrderStatusService(id, body.status);
    
    return responseFormatter.successWithData({
      data: updated,
      message: "Customer order status updated successfully",
    });
  } catch (error) {
    console.error("Error in updateCustomerOrderStatusController:", error);
    return handleException(error);
  }
};

export const cancelCustomerOrderController = async (id: number) => {
  try {
    const cancelled = await cancelCustomerOrderService(id);
    return responseFormatter.successWithData({
      data: cancelled,
      message: "Customer order cancelled successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteCustomerOrderController = async (id: number) => {
  try {
    await deleteCustomerOrderService(id);
    return responseFormatter.success({ message: "Customer order deleted successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const getAvailableOrdersController = async (request: NextRequest) => {
  try {
    const orders = await getAvailableOrdersService();
    return responseFormatter.successWithData({
      data: orders,
      message: "Available orders retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};