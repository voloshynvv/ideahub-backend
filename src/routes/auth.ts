import { auth } from "@/lib/auth.js";
import { createRouter } from "@/lib/create-app.js";

export const authRoutes = createRouter();

authRoutes.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});
