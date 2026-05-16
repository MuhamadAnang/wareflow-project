import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import { calculateDistributionPriority, getPendingOrdersForPriority } from "./priority.service";
import { NextRequest } from "next/server";

const parseOrderIds = (request: NextRequest): number[] | undefined => {
  const { searchParams } = new URL(request.url);
  const rawOrderIds = searchParams.get("orderIds");

  if (!rawOrderIds) return undefined;

  const orderIds = rawOrderIds
    .split(",")
    .map((orderId) => Number(orderId.trim()))
    .filter((orderId) => Number.isInteger(orderId) && orderId > 0);

  return orderIds.length > 0 ? [...new Set(orderIds)] : undefined;
};

export const getPriorityDistributionController = async (request: NextRequest) => {
  try {
    const orderIds = parseOrderIds(request);
    const priorities = await calculateDistributionPriority(orderIds);
    
    return responseFormatter.successWithData({
      data: {
        priorities,
        totalOrders: priorities.length,
        selectedOrderIds: orderIds || [],
        calculatedAt: new Date().toISOString(),
      },
      message: "Prioritas distribusi berhasil dihitung",
    });
  } catch (error) {
    console.error("Error in getPriorityDistributionController:", error);
    return handleException(error);
  }
};

export const getPendingOrdersController = async (_request: NextRequest) => {
  try {
    const pendingOrders = await getPendingOrdersForPriority();
    
    return responseFormatter.successWithData({
      data: pendingOrders,
      message: "Daftar order pending berhasil diambil",
    });
  } catch (error) {
    console.error("Error in getPendingOrdersController:", error);
    return handleException(error);
  }
};
