import { authenticate } from "@/middlewares/auth.ts";
import { Hono } from "hono";

export const ideasRoute = new Hono();

ideasRoute.get("/", authenticate, (c) => {
  return c.text("Hello Ideas!");
});
