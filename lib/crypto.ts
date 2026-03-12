import { createHash } from "crypto";

export const generateSHA256Hash = (data: string): string => {
  return createHash("sha256").update(data).digest("hex");
};
