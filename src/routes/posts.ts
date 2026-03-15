import { Hono } from "hono";
import z, { uuid } from "zod";
import { insertPostSchema, updatePostSchema } from "@/db/schemas/posts.ts";
import { NotFoundException } from "@/lib/errors.ts";
import { zValidator } from "@/lib/validator-wrapper.ts";
import { authenticate } from "@/middlewares/auth.ts";
import { postsRepository } from "@/repositories/posts.repository.ts";
import { insertCommentSchema } from "@/db/schemas/comments.ts";
import { commentsRepository } from "@/repositories/comments.repository.ts";

export const postsRoute = new Hono();

postsRoute.get("/", async (c) => {
  const posts = await postsRepository.findAll();
  return c.json(posts);
});

postsRoute.get(
  "/:id",
  zValidator("param", z.object({ id: uuid() })),
  async (c) => {
    const { id } = c.req.param();
    const post = await postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException("Post");
    }
    return c.json(post);
  },
);

postsRoute.post(
  "/",
  authenticate,
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

postsRoute.delete(
  "/:id",
  authenticate,
  zValidator("param", z.object({ id: uuid() })),
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

postsRoute.patch(
  "/:id",
  authenticate,
  zValidator("param", z.object({ id: uuid() })),
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

postsRoute.put(
  "/:id/like",
  authenticate,
  zValidator("param", z.object({ id: uuid() })),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");
    const post = await postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException("Post");
    }
    const [like] = await postsRepository.likePost(id, user.id);
    console.log(like);
    return c.body(null, 204);
  },
);

postsRoute.delete(
  "/:id/like",
  authenticate,
  zValidator("param", z.object({ id: uuid() })),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");
    const post = await postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException("Post");
    }
    await postsRepository.unlikePost(id, user.id);
    return c.body(null, 204);
  },
);

postsRoute.post(
  "/:id/comments",
  authenticate,
  zValidator("param", z.object({ id: uuid() })),
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

postsRoute.delete(
  "/:postId/comments/:commentId",
  authenticate,
  zValidator("param", z.object({ postId: uuid(), commentId: uuid() })),
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
