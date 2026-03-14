import { auth } from "@/lib/auth.ts";
import type { User } from "better-auth";
import { createMiddleware } from "hono/factory";

type AuthenticateMiddleware = {
  Variables: {
    user: User;
  };
};

export const authenticate = createMiddleware<AuthenticateMiddleware>(
  async (c, next) => {
    try {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      c.set("user", session.user);
      await next();
    } catch (e) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  },
);
