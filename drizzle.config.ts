import { defineConfig } from "drizzle-kit";
import { env } from "./src/config.ts";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
