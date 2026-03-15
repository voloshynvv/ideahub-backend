import { and, desc, getTableColumns, eq, sql, count } from "drizzle-orm";
import { db } from "@/db/index.ts";
import {
  posts,
  type InsertPostData,
  type UpdatePostData,
} from "@/db/schemas/posts.ts";
import { comments } from "@/db/schemas/comments.ts";
import { user } from "@/db/schemas/auth.ts";

export const postsRepository = {
  async findAll() {
    // omit userId from postColumns
    const { userId, ...postColumns } = getTableColumns(posts);

    return db
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
      .orderBy(desc(posts.createdAt));
  },

  async findById(postId: string) {
    const { userId, ...postColumns } = getTableColumns(posts);

    const post = await db
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

    return post;
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
