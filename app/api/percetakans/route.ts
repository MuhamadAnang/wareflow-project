import {
  createPercetakanController,
  getPercetakansWithPaginationController,
} from "@/server/percetakans/percetakan.controller";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return await createPercetakanController(req);
};

export const GET = async (req: NextRequest) => {
  return await getPercetakansWithPaginationController(req);
};
