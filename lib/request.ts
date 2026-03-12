import { authMiddleware, TAuthMiddlewareData } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";

interface IMiddlewareResponseBase {
  pass: boolean;
  response: NextResponse;
}

export interface IMiddlewareResponseWithData<T> extends IMiddlewareResponseBase {
  pass: true;
  data: T;
}

export interface IMiddlewareResponseWithoutData extends IMiddlewareResponseBase {
  pass: false;
}

export type TMiddlewareResponse<T> =
  | IMiddlewareResponseWithData<T>
  | IMiddlewareResponseWithoutData;

type TRequestCallback<T> = T extends undefined
  ? (req: NextRequest) => Promise<NextResponse>
  : (req: NextRequest, context: T) => Promise<NextResponse>;

type TMiddlewareFunction<T = unknown> = (req: NextRequest) => Promise<TMiddlewareResponse<T>>;

interface IMiddlewareRequest<T = undefined> {
  request: NextRequest;
  callback: TRequestCallback<T>;
  middleware?: TMiddlewareFunction<unknown>[];
}

export const handleAuthenticatedRequest = async ({
  request,
  callback,
  middleware = [],
}: IMiddlewareRequest<TAuthMiddlewareData>): Promise<NextResponse> => {
  const authResult = await authMiddleware(request);

  if (!authResult.pass) {
    return authResult.response;
  }

  const authData = authResult.data;

  if (middleware.length > 0) {
    for (const middlewareFunction of middleware) {
      const result = await middlewareFunction(request);
      if (!result.pass) {
        return result.response;
      }
    }
  }

  return callback(request, authData);
};
