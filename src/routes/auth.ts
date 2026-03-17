import { auth } from "@/lib/auth.ts";
import { createRouter } from "@/lib/create-app.ts";

export const authRoutes = createRouter();

authRoutes.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});
