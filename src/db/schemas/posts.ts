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
  description: text("description").notNull(),
  content: text("content").notNull(),

  ...timestamps,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  content: true,
  description: true,
  title: true,
  userId: true,
});

export const updatePostSchema = createUpdateSchema(posts)
  .pick({
    content: true,
    description: true,
    title: true,
  })
  .partial();

export type InsertPostData = z.infer<typeof insertPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
