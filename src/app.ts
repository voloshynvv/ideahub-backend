import { Hono } from "hono";
import notFound from "./middlewares/not-found.ts";
import { errorHandler } from "./middlewares/error-handler.ts";
import { authRoute } from "./routes/auth.ts";
import { postsRoute } from "./routes/posts.ts";

export const app = new Hono().basePath("/api");
app.route("/auth", authRoute);
app.route("/posts", postsRoute);

app.notFound(notFound);
app.onError(errorHandler);
