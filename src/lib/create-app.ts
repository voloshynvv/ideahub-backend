import { Hono } from "hono";
import type { Session, User } from "./auth.ts";
import notFound from "@/middlewares/not-found.ts";
import { errorHandler } from "@/middlewares/error-handler.ts";
import { getAuth } from "@/middlewares/auth.ts";

export type AppBindings = {
  Variables: {
    test: boolean;
    user: User | null;
    session: Session | null;
  };
};

export const createRouter = () => {
  return new Hono<AppBindings>({
    strict: false,
  });
};

export const createApp = () => {
  const app = createRouter();
  app.use(getAuth);
  app.notFound(notFound);
  app.onError(errorHandler);
  return app;
};

const demoApp = createRouter();

demoApp.get("/", (c) => {
  const user = c.var.user;
  const session = c.var.session;
  return c.json({ user, session });
});
