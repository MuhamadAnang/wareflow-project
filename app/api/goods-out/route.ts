import {
    createGoodsOutController,
    getGoodsOutListController,
  } from "@/server/goods-out/goods-out.controller";
  import { NextRequest } from "next/server";
  
  export const POST = async (req: NextRequest) => {
    return await createGoodsOutController(req);
  };
  
  export const GET = async (req: NextRequest) => {
    return await getGoodsOutListController(req);
  };