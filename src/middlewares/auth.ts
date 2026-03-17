import { auth, type Session, type User } from "@/lib/auth.ts";
import type { AppBindings } from "@/lib/create-app.ts";
import { UnauthorizedException } from "@/lib/errors.ts";
import { createMiddleware } from "hono/factory";

export const getAuth = createMiddleware<AppBindings>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

type EnsureAuthBindings = AppBindings & {
  Variables: { user: User; session: Session };
};
export const ensureAuth = createMiddleware<EnsureAuthBindings>(
  async (c, next) => {
    const user = c.get("user");
    const session = c.get("session");

    if (!user || !session) {
      throw new UnauthorizedException();
    }

    c.set("user", user);
    c.set("session", session);

    await next();
  },
);
