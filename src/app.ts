import { createApp } from "./lib/create-app.js";
import { authRoutes } from "./routes/auth.js";
import { postRoutes } from "./routes/posts.js";

export const app = createApp().basePath("/api");
app.route("/auth", authRoutes);
app.route("/posts", postRoutes);
