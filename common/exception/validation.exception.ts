import { ValidationErrorDetail } from "@/types/response";
import { BaseException } from "./base.exception";
import { ZodError } from "zod";

export class ValidationException extends BaseException {
  public readonly errors: ZodError | ValidationErrorDetail[];

  constructor(message: string, errors: ZodError | ValidationErrorDetail[]) {
    super(message, 422);
    this.errors = errors;
  }
}
