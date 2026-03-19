import { openAPI } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js";
import { env } from "@/config.js";

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

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
