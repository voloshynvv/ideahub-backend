import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "@/db/schema-helpers.ts";
import { ideas } from "./ideas.ts";
import { user } from "./auth.ts";

export const likes = pgTable(
  "likes",
  {
    id,
    ideaId: uuid("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [unique().on(t.ideaId, t.userId)],
);
