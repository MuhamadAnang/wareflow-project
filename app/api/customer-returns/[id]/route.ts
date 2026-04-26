import { handleAuthenticatedRequest } from "@/lib/request";
import { getCustomerReturnByIdController } from "@/server/customer-returns/customer-return.controller";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

const parseId = (id: string) => {
  const num = Number(id);
  if (isNaN(num)) throw new Error("Invalid ID");
  return num;
};

export const GET = async (req: NextRequest, { params }: Params) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: async () => {
      const { id } = await params; 
      const parsedId = parseId(id);
      return getCustomerReturnByIdController(parsedId);
    },
  });
};