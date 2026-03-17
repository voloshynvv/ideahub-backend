import { createApp } from "./lib/create-app.ts";
import { authRoutes } from "./routes/auth.ts";
import { postRoutes } from "./routes/posts.ts";

export const app = createApp().basePath("/api");
app.route("/auth", authRoutes);
app.route("/posts", postRoutes);
