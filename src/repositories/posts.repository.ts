import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import {
  posts,
  type InsertPostData,
  type UpdatePostData,
} from "@/db/schemas/posts.ts";
import { likes } from "@/db/schemas/likes.ts";

const userColums = {
  id: true,
  name: true,
  image: true,
};

export const postsRepository = {
  async findAll() {
    return db.query.posts.findMany({
      with: {
        user: {
          columns: userColums,
        },
      },
      orderBy: [desc(posts.createdAt)],
    });
  },

  async findById(postId: string) {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: {
        user: {
          columns: userColums,
        },
      },
    });

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

  async likePost(postId: string, userId: string) {
    return db
      .insert(likes)
      .values({ postId, userId })
      .onConflictDoNothing()
      .returning();
  },

  async unlikePost(postId: string, userId: string) {
    return db
      .delete(likes)
      .where(and(eq(likes.id, postId), eq(likes.userId, userId)));
  },
};
