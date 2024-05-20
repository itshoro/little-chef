import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: "./src/drizzle",
  schema: "./src/drizzle/schema.ts",
  verbose: true,
  strict: true,
});
