import { db } from "@/db/index.ts";
import {
  comments,
  type InsertCommentValues,
  type UpdateCommentValues,
} from "@/db/schemas/comments.ts";
import { and, eq } from "drizzle-orm";

export const commentsRepository = {
  async create(values: InsertCommentValues) {
    return db.insert(comments).values(values).returning();
  },
  async delete(commentId: string, userId: string) {
    return db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
      .returning();
  },
  async update(commentId: string, userId: string, values: UpdateCommentValues) {
    return db
      .update(comments)
      .set(values)
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
      .returning();
  },
};
