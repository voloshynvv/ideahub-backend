import { openAPI } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.ts";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [openAPI()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
