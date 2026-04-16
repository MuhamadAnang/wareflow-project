import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { parseSortParams } from "@/lib/query-param";
import { responseFormatter } from "@/lib/response-formatter";
import { CreateGoodsOutSchema, IndexGoodsOutQuerySchema } from "@/schemas/goods-out.schema";
import { TGoodsOutDetail, TGoodsOutListItem } from "@/types/database";
import { NextRequest } from "next/server";
import {
  createGoodsOutService,
  getGoodsOutByIdService,
  getGoodsOutListService,
} from "./goods-out.service";

export const createGoodsOutController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateGoodsOutSchema, body);
    const goodsOut = await createGoodsOutService(body);
    return responseFormatter.created({
      data: goodsOut,
      message: "Goods out created successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getGoodsOutListController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      customerOrderId: searchParams.get("customerOrderId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    const result = parseQueryParams(IndexGoodsOutQuerySchema, rawQueryParams);
    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;
    const { data, meta } = await getGoodsOutListService(queryParams);
    
    return responseFormatter.successWithPagination<TGoodsOutListItem>({
      data,
      meta,
      message: "Goods out retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getGoodsOutByIdController = async (id: number) => {
  try {
    const goodsOut = await getGoodsOutByIdService(id);
    return responseFormatter.successWithData<TGoodsOutDetail>({
      data: goodsOut,
      message: "Goods out retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};