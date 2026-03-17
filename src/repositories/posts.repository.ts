import { and, or, desc, eq, ilike } from "drizzle-orm";
import { db } from "@/db/index.ts";
import {
  posts,
  type InsertPostData,
  type UpdatePostData,
} from "@/db/schemas/posts.ts";
import { reactionsRepository } from "./reactions.repository.ts";

export const postsRepository = {
  async findAll({
    q,
    page,
    limit,
    userId,
  }: {
    q?: string;
    page: number;
    limit: number;
    userId?: string;
  }) {
    const rows = await db.query.posts.findMany({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        reactions: true,
      },
      where: q
        ? or(ilike(posts.title, `%${q}%`), ilike(posts.description, `%${q}%`))
        : undefined,
      orderBy: desc(posts.createdAt),
      limit: limit,
      offset: (page - 1) * limit,
    });

    const postIds = rows.map((row) => row.id);
    const reactionsByPostId = await reactionsRepository.getPostsReactions(
      postIds,
      userId,
    );

    return rows.map((post) => ({
      ...post,
      reactions: reactionsByPostId[post.id] ?? [],
    }));
  },

  async findById(postId: string, userId?: string) {
    const post = await db.query.posts.findFirst({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        reactions: true,
      },
      where: eq(posts.id, postId),
    });

    if (!post) {
      return null;
    }

    const reactions = await reactionsRepository.getPostsReactions(
      [postId],
      userId,
    );

    return {
      ...post,
      reactions: reactions[postId] ?? [],
    };
  },

  async create(data: InsertPostData) {
    return db.insert(posts).values(data).returning();
  },

  async delete(postId: string, userId: string) {
    return db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();
  },

  async update(postId: string, userId: string, data: UpdatePostData) {
    return db
      .update(posts)
      .set(data)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();
  },
};
