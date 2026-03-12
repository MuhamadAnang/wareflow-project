type Env = {
  DATABASE_URL: string;
  NODE_ENV: "development" | "production" | "test";
  NEXT_BASE_URL?: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
  CLERK_SECRET_KEY: string;
  CLERK_JWT_KEY: string;
  CLERK_API_URL: string;
  NEXT_PUBLIC_NODE_TZ: string;
};

const env: Env = {
  NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL!,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  CLERK_JWT_KEY: process.env.CLERK_JWT_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
  CLERK_API_URL: process.env.CLERK_API_URL || "https://api.clerk.com",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  NEXT_BASE_URL: process.env.NEXT_BASE_URL || "http://localhost:3000",
  NEXT_PUBLIC_NODE_TZ: process.env.NEXT_PUBLIC_NODE_TZ || "UTC",
};

export const validateEnv = (): void => {
  const requiredVars: (keyof Env)[] = [
    "NODE_ENV",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    "NEXT_PUBLIC_API_URL",
    "CLERK_JWT_KEY",
    "DATABASE_URL",
    "CLERK_API_URL",
    "CLERK_SECRET_KEY",
    "NEXT_BASE_URL"
  ];

  const missingVars = requiredVars.filter((key) => !env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map((v) => `  - ${v}`).join("\n")}`,
    );
  }
};

export default env;
