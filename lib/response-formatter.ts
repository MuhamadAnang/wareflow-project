import {
  ValidationErrorDetail,
  HTTP_STATUS,
  TBaseApiResponse,
  TApiResponseWithRedirect,
  TApiSuccessResponseWithData,
  TApiSuccessResponseWithPagination,
  TApiErrorResponseWithDetails,
  TApiValidationErrorResponse,
} from "@/types/response";
import type { TPaginationMeta } from "@/types/meta";
import type { ZodError } from "zod";
import { NextResponse } from "next/server";

export const responseFormatter = {
  success: ({
    message,
    status = HTTP_STATUS.OK,
  }: {
    message?: string;
    status?: number;
  }): NextResponse => {
    const body: TBaseApiResponse = {
      success: true,
      message: message || "Request successful",
    };

    return NextResponse.json(body, { status });
  },

  successWithRedirect: ({
    redirectUrl,
    message,
    status = HTTP_STATUS.OK,
  }: {
    redirectUrl: string;
    message?: string;
    status?: number;
  }): NextResponse => {
    const body: TApiResponseWithRedirect = {
      success: true,
      message: message || "Request successful",
      redirectUrl,
    };

    return NextResponse.json(body, { status });
  },

  successWithData: <T>({
    data,
    message,
    status = HTTP_STATUS.OK,
  }: {
    data: T;
    message?: string;
    status?: number;
  }): NextResponse => {
    const body: TApiSuccessResponseWithData<T> = {
      success: true,
      message: message || "Request successful",
      data,
    };

    return NextResponse.json(body, { status });
  },

  successWithPagination: <T>({
    data,
    meta,
    message,
    status = HTTP_STATUS.OK,
    ...rest
  }: {
    data: T[];
    meta: TPaginationMeta;
    message?: string;
    status?: number;
    [key: string]: unknown;
  }): NextResponse => {
    const body: TApiSuccessResponseWithPagination<T> = {
      success: true,
      message: message || "Request successful",
      data,
      meta,
      ...rest,
    };

    return NextResponse.json(body, { status });
  },

  error: ({
    message,
    status = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  }: {
    message?: string;
    status?: number;
  }): NextResponse => {
    const body: TBaseApiResponse = {
      success: false,
      message: message || "An error occurred",
    };

    return NextResponse.json(body, { status });
  },

  errorWithDetails: <T = Record<string, string>>({
    details,
    message,
    status = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  }: {
    details: T;
    message?: string;
    status?: number;
  }): NextResponse => {
    const body: TApiErrorResponseWithDetails<T> = {
      success: false,
      message: message || "An error occurred",
      errors: details,
    };

    return NextResponse.json(body, { status });
  },

  validationError: ({
    error,
    message,
    status = HTTP_STATUS.UNPROCESSABLE_ENTITY,
  }: {
    error: ZodError | ValidationErrorDetail[];
    message?: string;
    status?: number;
  }): NextResponse => {
    let errors: ValidationErrorDetail[] = [];

    if (Array.isArray(error)) {
      errors = error;
    } else if (error instanceof Error && "issues" in error) {
      errors = (error as ZodError).issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      }));
    }

    const body: TApiValidationErrorResponse = {
      success: false,
      message: message || "Validation failed",
      errors,
    };

    return NextResponse.json(body, { status });
  },

  created: <T>({ data, message }: { data?: T; message?: string }): NextResponse => {
    if (data) {
      return responseFormatter.successWithData({ data, message, status: HTTP_STATUS.CREATED });
    }
    return responseFormatter.success({ message, status: HTTP_STATUS.CREATED });
  },

  badRequest: ({
    message,
    details,
  }: {
    message?: string;
    details?: Record<string, string>;
  }): NextResponse => {
    if (details) {
      return responseFormatter.errorWithDetails({
        details,
        message,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }
    return responseFormatter.error({ message, status: HTTP_STATUS.BAD_REQUEST });
  },

  unauthorized: (message?: string): NextResponse => {
    return responseFormatter.error({ message, status: HTTP_STATUS.UNAUTHORIZED });
  },

  forbidden: (message?: string): NextResponse => {
    return responseFormatter.error({ message, status: HTTP_STATUS.FORBIDDEN });
  },

  notFound: (message?: string): NextResponse => {
    return responseFormatter.error({ message, status: HTTP_STATUS.NOT_FOUND });
  },

  conflict: (message?: string): NextResponse => {
    return responseFormatter.error({ message, status: HTTP_STATUS.CONFLICT });
  },
};
