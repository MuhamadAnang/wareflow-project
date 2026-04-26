type Env = {
  DATABASE_URL: string;
  NODE_ENV: "development" | "production" | "test";
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  NEXT_BASE_URL: string;
  CLERK_JWT_KEY: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_NODE_TZ: string;
  TZ: string;
};

const env: Env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  NEXT_BASE_URL: process.env.NEXT_BASE_URL || "http://localhost:3000",
  CLERK_JWT_KEY: process.env.CLERK_JWT_KEY!,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  NEXT_PUBLIC_NODE_TZ: process.env.NEXT_PUBLIC_NODE_TZ || "Asia/Jakarta",
  TZ: process.env.TZ || "Asia/Jakarta",
};

export const validateEnv = (): void => {
  const requiredVars: (keyof Env)[] = [
    "DATABASE_URL",
    "NODE_ENV",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "NEXT_BASE_URL",
    "CLERK_JWT_KEY",
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_NODE_TZ",
    "TZ",
  ];

  const missingVars = requiredVars.filter((key) => !env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map((v) => `  - ${v}`).join("\n")}`,
    );
  }
};

export default env;
