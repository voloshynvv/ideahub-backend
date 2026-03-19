import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "../schema-helpers.js";
import { posts } from "./posts.js";
import { user } from "./auth.js";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reactions = pgTable(
  "reactions",
  {
    id,
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    ...timestamps,
  },

  (t) => [unique().on(t.postId, t.userId, t.name)],
);

export const insertReactionSchema = createInsertSchema(reactions).pick({
  name: true,
});

export type InsertReactionValues = z.infer<typeof insertReactionSchema> & {
  postId: string;
  userId: string;
};
