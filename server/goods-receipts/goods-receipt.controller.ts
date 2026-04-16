import { handleException } from "@/common/exception/helper";
import { NextRequest } from "next/server";
import { responseFormatter } from "@/lib/response-formatter";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { CreateGoodsReceiptSchema, IndexGoodsReceiptQuerySchema, UpdateGoodsReceiptSchema } from "@/schemas/goods-receipt.schema";
import { createGoodsReceiptService, getGoodsReceiptsWithPaginationService, getGoodsReceiptByIdService, updateGoodsReceiptService, deleteGoodsReceiptService } from "./goods-receipt.service";
import { parseSortParams } from "@/lib/query-param";
import { TGoodsReceiptDetail } from "@/types/database";

export const createGoodsReceiptController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateGoodsReceiptSchema, body);
    await createGoodsReceiptService(body);
    return responseFormatter.created({ message: "Goods Receipt created successfully" });
  } catch (error) {
    return handleException(error);
  }
};

export const getGoodsReceiptsWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
    };
    const result = parseQueryParams(IndexGoodsReceiptQuerySchema, rawQueryParams);
    if (!result.success) {
      return responseFormatter.validationError({ error: result.error, message: "Invalid query parameters" });
    }
    const queryParams = result.data;
    const { data, meta } = await getGoodsReceiptsWithPaginationService(queryParams);
    return responseFormatter.successWithPagination({ data, meta, message: "Goods receipts retrieved successfully" });
  } catch (error) {
    return handleException(error);
  }
};


// Tambahkan controller untuk getById, update, delete
export const getGoodsReceiptByIdController = async (id: number) => {
  try {
    const receipt = await getGoodsReceiptByIdService(id);
    return responseFormatter.successWithData<TGoodsReceiptDetail>({
      data: receipt,
      message: "Goods receipt retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const updateGoodsReceiptController = async (id: number, req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(UpdateGoodsReceiptSchema, body);
    const updated = await updateGoodsReceiptService(id, body);
    return responseFormatter.successWithData({
      data: updated,
      message: "Goods receipt updated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteGoodsReceiptController = async (id: number) => {
  try {
    await deleteGoodsReceiptService(id);
    return responseFormatter.success({ message: "Goods receipt deleted successfully" });
  } catch (error) {
    return handleException(error);
  }
};