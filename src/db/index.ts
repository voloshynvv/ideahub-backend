import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/config.ts";
import * as schema from "./schemas/index.ts";

export const db = drizzle(env.DATABASE_URL, { schema });
