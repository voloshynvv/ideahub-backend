import z from "zod";
import { insertPostSchema, updatePostSchema } from "@/db/schemas/posts.js";
import { NotFoundException } from "@/lib/errors.js";
import { zValidator } from "@/lib/validator-wrapper.js";
import { postsRepository } from "@/repositories/posts.repository.js";
import { insertCommentSchema } from "@/db/schemas/comments.js";
import { commentsRepository } from "@/repositories/comments.repository.js";
import { insertReactionSchema } from "@/db/schemas/reactions.js";
import { reactionsRepository } from "@/repositories/reactions.repository.js";
import { createRouter } from "@/lib/create-app.js";
import { ensureAuth } from "@/middlewares/auth.js";

export const postRoutes = createRouter();

postRoutes.get(
  "/",
  zValidator(
    "query",
    z.object({
      q: z.string().optional(),
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().default(10),
    }),
  ),
  async (c) => {
    const { q, page, limit } = c.req.valid("query");
    const user = c.get("user");
    const posts = await postsRepository.findAll({
      q,
      page,
      limit,
      userId: user?.id,
    });
    return c.json(posts);
  },
);

postRoutes.get(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() })),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.param();
    const post = await postsRepository.findById(id, user?.id);
    if (!post) {
      throw new NotFoundException("Post");
    }
    return c.json(post);
  },
);

postRoutes.post(
  "/",
  ensureAuth,
  zValidator("json", insertPostSchema),
  async (c) => {
    const data = c.req.valid("json");
    const user = c.get("user");
    const [newPost] = await postsRepository.create({
      ...data,
      userId: user.id,
    });
    return c.json({ id: newPost.id }, 201);
  },
);

postRoutes.delete(
  "/:id",
  ensureAuth,
  zValidator("param", z.object({ id: z.uuid() })),
  async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    const [deletedPost] = await postsRepository.delete(id, user.id);
    if (!deletedPost) {
      throw new NotFoundException("Post");
    }
    return c.body(null, 204);
  },
);

postRoutes.patch(
  "/:id",
  ensureAuth,
  zValidator("param", z.object({ id: z.uuid() })),
  zValidator("json", updatePostSchema),
  async (c) => {
    const { id } = c.req.param();
    const data = c.req.valid("json");
    const user = c.get("user");
    const [updatedPost] = await postsRepository.update(id, user.id, data);
    if (!updatedPost) {
      throw new NotFoundException("Post");
    }
    return c.body(null, 204);
  },
);

postRoutes.put(
  "/:id/reactions",
  ensureAuth,
  zValidator("param", z.object({ id: z.uuid() })),
  zValidator("json", insertReactionSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { name } = c.req.valid("json");
    const user = c.get("user");
    const post = await postsRepository.findById(id);

    if (!post) {
      throw new NotFoundException("Post");
    }

    await reactionsRepository.add({
      postId: id,
      userId: user.id,
      name,
    });

    return c.body(null, 204);
  },
);

postRoutes.delete(
  "/:postId/reactions/:reactionName",
  ensureAuth,
  zValidator("param", z.object({ postId: z.uuid(), reactionName: z.string() })),
  async (c) => {
    const { reactionName, postId } = c.req.valid("param");
    const user = c.get("user");
    const [deletedReaction] = await reactionsRepository.remove(
      postId,
      reactionName,
      user.id,
    );
    if (!deletedReaction) {
      throw new NotFoundException("Reaction");
    }
    return c.body(null, 204);
  },
);

postRoutes.post(
  "/:id/comments",
  ensureAuth,
  zValidator("param", z.object({ id: z.uuid() })),
  zValidator("json", insertCommentSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const user = c.get("user");
    const post = await postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException("Post");
    }
    const [comment] = await commentsRepository.create({
      postId: id,
      userId: user.id,
      ...data,
    });
    return c.json(comment, 201);
  },
);

postRoutes.delete(
  "/:postId/comments/:commentId",
  ensureAuth,
  zValidator("param", z.object({ postId: z.uuid(), commentId: z.uuid() })),
  async (c) => {
    const { commentId } = c.req.valid("param");
    const user = c.get("user");
    const [deletedComment] = await commentsRepository.delete(
      commentId,
      user.id,
    );
    if (!deletedComment) {
      throw new NotFoundException("Comment");
    }
    return c.body(null, 204);
  },
);
