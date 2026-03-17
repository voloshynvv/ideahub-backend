import { and, eq, inArray, count, asc, sql } from "drizzle-orm";
import { db } from "@/db/index.ts";
import {
  reactions,
  type InsertReactionValues,
} from "@/db/schemas/reactions.ts";

type Reaction = {
  name: string;
  count: number;
};

const mapPostsReactions = (
  data: { postId: string; name: string; count: number }[],
) => {
  const result: Record<string, Reaction[]> = {};

  for (const reaction of data) {
    if (!result[reaction.postId]) {
      result[reaction.postId] = [];
    }

    result[reaction.postId].push({
      name: reaction.name,
      count: reaction.count,
    });
  }

  return result;
};

export const reactionsRepository = {
  async add(values: InsertReactionValues) {
    return db
      .insert(reactions)
      .values(values)
      .onConflictDoNothing()
      .returning();
  },

  async remove(postId: string, reactionName: string, userId: string) {
    return db
      .delete(reactions)
      .where(
        and(
          eq(reactions.name, reactionName),
          eq(reactions.userId, userId),
          eq(reactions.postId, postId),
        ),
      )
      .returning();
  },

  async getPostsReactions(postIds: string[]) {
    const firstReactionAt = sql`min(${reactions.createdAt})`;

    const rows = await db
      .select({
        postId: reactions.postId,
        name: reactions.name,
        count: count(reactions.name),
      })
      .from(reactions)
      .where(inArray(reactions.postId, postIds))
      .groupBy(reactions.postId, reactions.name)
      .orderBy(
        asc(reactions.postId),
        asc(firstReactionAt),
        asc(reactions.name),
      );

    return mapPostsReactions(rows);
  },
};
