import { and, eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import {
  reactions,
  type InsertReactionValues,
} from "@/db/schemas/reactions.ts";

export const reactionsRepository = {
  async add(values: InsertReactionValues) {
    return db
      .insert(reactions)
      .values(values)
      .onConflictDoNothing()
      .returning();
  },

  async remove(userId: string, reactionId: string) {
    return db
      .delete(reactions)
      .where(and(eq(reactions.userId, userId), eq(reactions.id, reactionId)))
      .returning();
  },
};
