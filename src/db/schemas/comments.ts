import { z } from "zod";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "../schema-helpers.ts";
import { posts } from "./posts.ts";
import { user } from "./auth.ts";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const comments = pgTable("comments", {
  id,
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  ...timestamps,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  content: true,
});

export type InsertCommentValues = z.infer<typeof insertCommentSchema> & {
  postId: string;
  userId: string;
};

export const updateCommentSchema = createUpdateSchema(comments)
  .pick({
    content: true,
  })
  .partial();

export type UpdateCommentValues = z.infer<typeof updateCommentSchema>;
