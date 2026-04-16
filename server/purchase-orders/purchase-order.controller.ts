import { handleException } from "@/common/exception/helper";
import { NextRequest } from "next/server";
import { responseFormatter } from "@/lib/response-formatter";
import {
  createPurchaseOrderService,
  deletePurchaseOrderService,
  getPurchaseOrderByIdService,
  getPurchaseOrdersWithPaginationService,
  updatePurchaseOrderService,
} from "./purchase-order.service";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { CreatePurchaseOrderSchema, IndexPurchaseOrderQuerySchema, UpdatePurchaseOrderSchema } from "@/schemas/purchase-order.schema";
import { TPurchaseOrderDetail, TPurchaseOrderWithSupplier } from "@/types/database";
import { parseSortParams } from "@/lib/query-param";

export const createPurchaseOrderController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreatePurchaseOrderSchema, body);
    await createPurchaseOrderService(body);
    return responseFormatter.created({ message: "Purchase Order created successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const getPurchaseOrdersWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      supplierId: searchParams.get("supplierId") || undefined,
    };

    const result = parseQueryParams(IndexPurchaseOrderQuerySchema, rawQueryParams);
    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;
    const { data, meta } = await getPurchaseOrdersWithPaginationService(queryParams);

    return responseFormatter.successWithPagination<TPurchaseOrderWithSupplier>({
      data,
      meta,
      message: "Purchase orders retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getPurchaseOrderByIdController = async (id: number) => {
  try {
    const purchaseOrder = await getPurchaseOrderByIdService(id);
    return responseFormatter.successWithData<TPurchaseOrderDetail>({
      data: purchaseOrder,
      message: "Purchase order retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deletePurchaseOrderController = async (id: number) => {
  try {
    await deletePurchaseOrderService(id);
    return responseFormatter.success({ message: "Purchase Order deleted successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const updatePurchaseOrderController = async (id: number, req: NextRequest) => {
  try {
    console.log(`🔄 Updating PO ID: ${id}`);
    const body = await req.json();
    console.log("📦 Request body:", body);
    
    validateSchema(UpdatePurchaseOrderSchema, body);
    
    const updated = await updatePurchaseOrderService(id, body);
    console.log("✅ Update successful, returning:", updated);
    
    return responseFormatter.successWithData<TPurchaseOrderDetail>({
      data: updated,
      message: "Purchase order updated successfully",
    });
  } catch (error) {
    console.error("❌ Update controller error:", error);
    return handleException(error);
  }
};