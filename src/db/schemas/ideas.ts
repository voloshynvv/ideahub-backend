import { pgTable } from "drizzle-orm/pg-core";
import { id, timestamps } from "@/db/schema-helpers.ts";

export const ideas = pgTable("ideas", {
  id,
  ...timestamps,
});
