import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "@/db/schema-helpers.ts";
import { posts } from "./posts.ts";
import { user } from "./auth.ts";

export const likes = pgTable(
  "likes",
  {
    id,
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [unique().on(t.postId, t.userId)],
);
