import { and, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "@/db/index.js";
import {
  posts,
  type InsertPostData,
  type UpdatePostData,
} from "@/db/schemas/posts.js";
import { reactionsRepository } from "./reactions.repository.js";

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
    const whereFilter = q ? ilike(posts.title, `%${q}%`) : undefined;

    const countQuery = db
      .select({ total: count() })
      .from(posts)
      .where(whereFilter);

    const [rows, countResult] = await Promise.all([
      db.query.posts.findMany({
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
        where: whereFilter,
        orderBy: desc(posts.createdAt),
        limit: limit,
        offset: (page - 1) * limit,
      }),
      countQuery,
    ]);

    const postIds = rows.map((row) => row.id);
    const reactionsByPostId = await reactionsRepository.getPostsReactions(
      postIds,
      userId,
    );

    const items = rows.map((post) => ({
      ...post,
      reactions: reactionsByPostId[post.id] ?? [],
    }));

    return { posts: items, total: countResult[0].total };
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

  async create(data: InsertPostData & { userId: string }) {
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
