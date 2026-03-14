import { Hono } from "hono";
import notFound from "./middlewares/not-found.js";
import { HTTPException } from "hono/http-exception";
import { errorHandler } from "./middlewares/error-handler.js";

export const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.notFound(notFound);
app.onError(errorHandler);
