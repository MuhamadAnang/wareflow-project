import { handleAuthenticatedRequest } from "@/lib/request";
import {
    createGoodsOutController,
    getGoodsOutListController,
  } from "@/server/goods-out/goods-out.controller";
  import { NextRequest } from "next/server";
  
  export const POST = async (req: NextRequest) => {
    return await handleAuthenticatedRequest({
      request: req,
      callback: () => createGoodsOutController(req),
    });
  };

  export const GET = async (req: NextRequest) => {
    return await handleAuthenticatedRequest({
      request: req,
      callback: () => getGoodsOutListController(req),
    });
  };