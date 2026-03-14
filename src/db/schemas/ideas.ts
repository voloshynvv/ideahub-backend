import { pgTable, text } from "drizzle-orm/pg-core";
import { id, timestamps } from "@/db/schema-helpers.ts";
import { user } from "./auth.ts";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import type z from "zod";

export const ideas = pgTable("ideas", {
  id,
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),

  ...timestamps,
});

export const insertIdeaSchema = createInsertSchema(ideas).pick({
  content: true,
  description: true,
  title: true,
  userId: true,
});

export const updateIdeaSchema = createUpdateSchema(ideas)
  .pick({
    content: true,
    description: true,
    title: true,
  })
  .partial();

export type InsertIdeaData = z.infer<typeof insertIdeaSchema>;
export type UpdateIdeaData = z.infer<typeof updateIdeaSchema>;
