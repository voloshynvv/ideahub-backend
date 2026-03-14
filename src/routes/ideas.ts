import { Hono } from "hono";

export const ideasRoute = new Hono();

ideasRoute.get("/", (c) => {
  return c.text("Hello Ideas!");
});
