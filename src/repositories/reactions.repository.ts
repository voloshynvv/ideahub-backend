import { and, eq, inArray, count, asc, sql, min } from "drizzle-orm";
import { db } from "@/db/index.ts";
import {
  reactions,
  type InsertReactionValues,
} from "@/db/schemas/reactions.ts";

type Reaction = {
  name: string;
  count: number;
  hasReacted: boolean;
};

const mapPostsReactions = (
  data: { postId: string; name: string; count: number; hasReacted: boolean }[],
) => {
  const result: Record<string, Reaction[]> = {};

  for (const reaction of data) {
    if (!result[reaction.postId]) {
      result[reaction.postId] = [];
    }

    result[reaction.postId].push({
      name: reaction.name,
      count: reaction.count,
      hasReacted: reaction.hasReacted,
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

  async getPostsReactions(postIds: string[], userId?: string) {
    const firstReactionAt = min(reactions.createdAt);
    const hasReactedExpression = userId
      ? sql<boolean>`bool_or(${reactions.userId} = ${userId})`
      : sql<boolean>`false`;

    const rows = await db
      .select({
        postId: reactions.postId,
        name: reactions.name,
        count: count(reactions.name),
        hasReacted: hasReactedExpression,
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
