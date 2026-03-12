import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import env from "./common/config/environtment";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL || "",
  },
});
