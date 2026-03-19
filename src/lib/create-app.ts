import { Hono } from "hono";
import type { Session, User } from "./auth.js";
import notFound from "@/middlewares/not-found.js";
import { errorHandler } from "@/middlewares/error-handler.js";
import { getAuth } from "@/middlewares/auth.js";
import { cors } from "hono/cors";
import { env } from "@/config.js";

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
  app.use(
    "*",
    cors({
      origin: env.FRONTEND_URL,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  );
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
