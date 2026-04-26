import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import { NextRequest } from "next/server";
import {
  getDashboardStats,
  getLowStockItems,
  getRecentOrders,
  getTopCustomers,
  getPriorityPreview,
} from "./dashboard.service";

export const getDashboardStatsController = async (request: NextRequest) => {
  try {
    const [stats, lowStock, recentOrders, topCustomers, priorityPreview] = await Promise.all([
      getDashboardStats(),
      getLowStockItems(10),
      getRecentOrders(5),
      getTopCustomers(5),
      getPriorityPreview(3),
    ]);

    return responseFormatter.successWithData({
      data: {
        stats,
        lowStock,
        recentOrders,
        topCustomers,
        priorityPreview,
      },
      message: "Dashboard data retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getDashboardStatsController:", error);
    return handleException(error);
  }
};