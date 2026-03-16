import { and, eq, inArray, count } from "drizzle-orm";
import { db } from "@/db/index.ts";
import {
  reactions,
  type InsertReactionValues,
} from "@/db/schemas/reactions.ts";

export type Reactions = Record<string, number>;

export const reactionsRepository = {
  async add(values: InsertReactionValues) {
    return db
      .insert(reactions)
      .values(values)
      .onConflictDoNothing()
      .returning();
  },

  async remove(reactionName: string, userId: string) {
    return db
      .delete(reactions)
      .where(
        and(eq(reactions.name, reactionName), eq(reactions.userId, userId)),
      )
      .returning();
  },

  async getReactionsByPostId(postId: string) {
    const rows = await db
      .select({
        postId: reactions.postId,
        name: reactions.name,
        count: count(reactions.id),
      })
      .from(reactions)
      .where(eq(reactions.postId, postId))
      .groupBy(reactions.postId, reactions.name);

    const result: Reactions = {};
    for (const row of rows) {
      result[row.name] = row.count;
    }
    return result;
  },

  async getReactionsByPostIds(postIds: string[]) {
    const rows = await db
      .select({
        postId: reactions.postId,
        name: reactions.name,
        count: count(reactions.id),
      })
      .from(reactions)
      .where(inArray(reactions.postId, postIds))
      .groupBy(reactions.postId, reactions.name);

    const result: Record<string, Reactions> = {};

    for (const row of rows) {
      if (!result[row.postId]) {
        result[row.postId] = {};
      }
      result[row.postId][row.name] = row.count;
    }

    return result;
  },
};
