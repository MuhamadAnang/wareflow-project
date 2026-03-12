import type { TPaginationMeta, TPaginationResponse } from "./meta";

export type TBaseApiResponse = {
  success: boolean;
  message: string;
};

export type TApiResponseWithRedirect = TBaseApiResponse & {
  redirectUrl: string;
};

export type TApiSuccessResponseWithData<T> = TBaseApiResponse & {
  data: T;
};

export type TApiErrorResponseWithDetails<T = Record<string, string>> = TBaseApiResponse & {
  errors: T;
};

export type TApiSuccessResponseWithPagination<T> = TBaseApiResponse & {
  data: T[];
  meta: TPaginationMeta;
};

export type ValidationErrorDetail = {
  path: (string | number)[];
  message: string;
  code: string;
};

export type TApiValidationErrorResponse = TBaseApiResponse & {
  errors: ValidationErrorDetail[];
};

export type TApiListResponse<T> = TBaseApiResponse & TPaginationResponse<T>;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
