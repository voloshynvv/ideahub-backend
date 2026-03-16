import { and, or, desc, getTableColumns, eq, ilike } from "drizzle-orm";
import { db } from "@/db/index.ts";
import {
  posts,
  type InsertPostData,
  type UpdatePostData,
} from "@/db/schemas/posts.ts";
import { comments } from "@/db/schemas/comments.ts";
import { user } from "@/db/schemas/auth.ts";
import { reactionsRepository } from "./reactions.repository.ts";

export const postsRepository = {
  async findAll({
    q,
    page,
    limit,
  }: {
    q?: string;
    page: number;
    limit: number;
  }) {
    const { userId, ...postColumns } = getTableColumns(posts);
    const offset = (page - 1) * limit;
    const rows = await db
      .select({
        ...postColumns,
        commentsCount: db.$count(comments, eq(comments.postId, posts.id)),
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(posts)
      .innerJoin(user, eq(posts.userId, user.id))
      .where(
        q
          ? or(ilike(posts.title, `%${q}%`), ilike(posts.description, `%${q}%`))
          : undefined,
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    if (rows.length === 0) {
      return [];
    }

    const postIds = rows.map((row) => row.id);
    const reactionsByPostId =
      await reactionsRepository.getReactionsByPostIds(postIds);

    return rows.map((post) => ({
      ...post,
      reactions: reactionsByPostId[post.id] ?? {},
    }));
  },

  async findById(postId: string) {
    const { userId, ...postColumns } = getTableColumns(posts);
    const [post] = await db
      .select({
        ...postColumns,
        commentsCount: db.$count(comments, eq(comments.postId, posts.id)),
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(posts)
      .where(eq(posts.id, postId))
      .innerJoin(user, eq(posts.userId, user.id))
      .orderBy(desc(posts.createdAt));

    if (!post) {
      return null;
    }

    const reactions = await reactionsRepository.getReactionsByPostId(postId);
    return { ...post, reactions };
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
