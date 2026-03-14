import { serve } from "@hono/node-server";
import { env } from "./config.ts";
import { app } from "./app.ts";

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
