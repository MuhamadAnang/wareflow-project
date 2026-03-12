import { responseFormatter } from "@/lib/response-formatter";
import { NotFoundException } from "./not-found.exception";
import { ValidationException } from "./validation.exception";
import { BadRequestException } from "./bad-request.exception";

export const handleException = (error: unknown) => {
  console.log("Error:", error);
  
  if (error instanceof NotFoundException) {
    return responseFormatter.notFound(error.message);
  } else if (error instanceof ValidationException) {
    return responseFormatter.validationError({
      error: error.errors,
      message: error.message,
    });
  } else if (error instanceof BadRequestException) {
    return responseFormatter.badRequest({ message: error.message });
  }

  return responseFormatter.error({ message: "An unexpected error occurred" });
};
