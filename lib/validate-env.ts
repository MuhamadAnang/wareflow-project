import { validateEnv } from "@/common/config/environtment";

let validated = false;

export const ensureEnvValidated = (): void => {
  if (validated) return;
  validateEnv();
  validated = true;
};
