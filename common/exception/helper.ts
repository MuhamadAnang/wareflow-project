import { responseFormatter } from "@/lib/response-formatter";
import { NotFoundException } from "./not-found.exception";
import { ValidationException } from "./validation.exception";
import { BadRequestException } from "./bad-request.exception";
import { ConflictException } from "./conflict.exception";

export const handleException = (error: unknown) => {
  console.log("Error:", error);

  console.log("Error instance of NotFoundException:", JSON.stringify(error, null, 2));

  if (error instanceof NotFoundException) {
    return responseFormatter.notFound(error.message);
  } else if (error instanceof ValidationException) {
    return responseFormatter.validationError({
      error: error.errors,
      message: error.message,
    });
  } else if (error instanceof BadRequestException) {
    return responseFormatter.badRequest({ message: error.message });
  } else if (error instanceof ConflictException) {
    return responseFormatter.conflict(error.message);
  }

  return responseFormatter.error({ message: "An unexpected error occurred" });
};
