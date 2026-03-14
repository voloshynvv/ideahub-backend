import { Hono } from "hono";
import notFound from "./middlewares/not-found.ts";
import { errorHandler } from "./middlewares/error-handler.ts";
import { authRoute } from "./routes/auth.ts";
import { ideasRoute } from "./routes/ideas.ts";

export const app = new Hono().basePath("/api");
app.route("/auth", authRoute);
app.route("/ideas", ideasRoute);

app.notFound(notFound);
app.onError(errorHandler);
