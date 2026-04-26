import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import { calculateDistributionPriority, getPendingOrdersForPriority } from "./priority.service";
import { NextRequest } from "next/server";

export const getPriorityDistributionController = async (request: NextRequest) => {
  try {
    const priorities = await calculateDistributionPriority();
    
    return responseFormatter.successWithData({
      data: {
        priorities,
        totalOrders: priorities.length,
        calculatedAt: new Date().toISOString(),
      },
      message: "Prioritas distribusi berhasil dihitung",
    });
  } catch (error) {
    console.error("Error in getPriorityDistributionController:", error);
    return handleException(error);
  }
};

export const getPendingOrdersController = async (request: NextRequest) => {
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