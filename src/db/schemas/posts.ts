import { pgTable, text } from "drizzle-orm/pg-core";
import { id, timestamps } from "@/db/schema-helpers.ts";
import { user } from "./auth.ts";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import type z from "zod";

export const posts = pgTable("posts", {
  id,
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  content: text("content").notNull(),
  tag: text("tag"),

  ...timestamps,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  content: true,
  title: true,
  tag: true,
});

export const updatePostSchema = createUpdateSchema(posts)
  .pick({
    content: true,
    title: true,
    tag: true,
  })
  .partial();

export type InsertPostData = z.infer<typeof insertPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
