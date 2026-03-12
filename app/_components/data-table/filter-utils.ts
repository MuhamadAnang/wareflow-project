/**
 * Shared filter utilities and constants
 */

export const EMPTY_VALUE = "";

/**
 * Validates if a value is a meaningful filter value
 * Returns false for undefined, null, or empty strings
 */
export const isValidFilterValue = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== EMPTY_VALUE;
