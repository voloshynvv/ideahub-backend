import { openAPI } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.ts";
import { env } from "@/config.ts";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.FRONTEND_URL],
  plugins: [openAPI()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
