import { and, desc, eq, SQL } from "drizzle-orm";
import { db } from "@/db/index.ts";
import {
  ideas,
  type InsertIdeaData,
  type UpdateIdeaData,
} from "@/db/schemas/ideas.ts";
import { likes } from "@/db/schemas/likes.ts";
import { user } from "@/db/schemas/auth.ts";

const userColums = {
  id: true,
  name: true,
  image: true,
};

export const ideasRepository = {
  async findAll() {
    return db.query.ideas.findMany({
      with: {
        user: {
          columns: userColums,
        },
      },
      orderBy: [desc(ideas.createdAt)],
    });
  },

  async findById(ideaId: string) {
    const idea = await db.query.ideas.findFirst({
      where: eq(ideas.id, ideaId),
      with: {
        user: {
          columns: userColums,
        },
      },
    });

    if (!idea) {
      return null;
    }

    return idea;
  },

  async create(data: InsertIdeaData) {
    return db.insert(ideas).values(data).returning();
  },

  async delete(ideaId: string, userId: string) {
    return db
      .delete(ideas)
      .where(and(eq(ideas.id, ideaId), eq(ideas.userId, userId)))
      .returning();
  },

  async update(ideaId: string, userId: string, data: UpdateIdeaData) {
    return db
      .update(ideas)
      .set(data)
      .where(and(eq(ideas.id, ideaId), eq(ideas.userId, userId)))
      .returning();
  },

  async likeIdea(ideaId: string, userId: string) {
    return db
      .insert(likes)
      .values({ ideaId, userId })
      .onConflictDoNothing()
      .returning();
  },

  async unlikeIdea(ideaId: string, userId: string) {
    return db
      .delete(likes)
      .where(and(eq(likes.id, ideaId), eq(likes.userId, userId)));
  },
};
