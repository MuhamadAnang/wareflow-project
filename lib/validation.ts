import { ValidationException } from "@/common/exception/validation.exception";
import { z, ZodSchema, ZodTypeAny } from "zod";

interface IValidationResult<T> {
  success: boolean;
  data: T;
  error?: z.ZodError;
}

/**
 * Validasi data menggunakan Zod schema
 * @param schema - Zod schema untuk validasi
 * @param data - Data yang akan divalidasi
 * @returns Hasil validasi dengan data atau error
 */
export function validateSchema<T>(schema: ZodSchema, data: unknown): IValidationResult<T> {
  try {
    const result = schema.safeParse(data);

    if (result.error && !result.data) {
      throw new ValidationException("Validation failed", result.error);
    }

    return {
      success: true,
      data: result.data as T,
    };
  } catch (error) {
    throw error;
  }
}

export function parseQueryParams<TSchema extends ZodTypeAny>(schema: TSchema, query: unknown) {
  return schema.safeParse(query);
}

export const createSortSchema = <T extends string>(allowedKeys: T[]) => {
  return z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;

      const sortArray = Array.isArray(val) ? val : val.split(",");

      const parsedSorts = sortArray
        .map((item) => {
          const parts = item.split(":");
          if (parts.length !== 2) return null;

          const [key, direction] = parts;

          if (direction !== "asc" && direction !== "desc") return null;

          if (!allowedKeys.includes(key as T)) return null;

          return { key: key as T, direction: direction as "asc" | "desc" };
        })
        .filter((item): item is { key: T; direction: "asc" | "desc" } => item !== null);

      return parsedSorts.length > 0 ? parsedSorts : undefined;
    });
};
