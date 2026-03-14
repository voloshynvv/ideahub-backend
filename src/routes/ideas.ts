import { Hono } from "hono";
import z, { uuid } from "zod";
import { insertIdeaSchema, updateIdeaSchema } from "@/db/schemas/ideas.ts";
import { NotFoundException } from "@/lib/errors.ts";
import { zValidator } from "@/lib/validator-wrapper.ts";
import { authenticate } from "@/middlewares/auth.ts";
import { ideasRepository } from "@/repositories/ideas.repository.ts";

export const ideasRoute = new Hono();

ideasRoute.get("/", async (c) => {
  const ideas = await ideasRepository.findAll();
  return c.json(ideas);
});

ideasRoute.get(
  "/:id",
  zValidator("param", z.object({ id: uuid() })),
  async (c) => {
    const { id } = c.req.param();
    const idea = await ideasRepository.findById(id);

    if (!idea) {
      throw new NotFoundException("Idea");
    }

    return c.json(idea);
  },
);

ideasRoute.post(
  "/",
  authenticate,
  zValidator("json", insertIdeaSchema),
  async (c) => {
    const data = c.req.valid("json");
    const user = c.get("user");
    const [newIdea] = await ideasRepository.create({
      ...data,
      userId: user.id,
    });
    return c.json({ id: newIdea.id }, 201);
  },
);

ideasRoute.delete(
  "/:id",
  authenticate,
  zValidator("param", z.object({ id: uuid() })),
  async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");

    const [deletedIdea] = await ideasRepository.delete(id, user.id);

    if (!deletedIdea) {
      throw new NotFoundException("Idea");
    }

    return c.body(null, 204);
  },
);

ideasRoute.patch(
  "/:id",
  authenticate,
  zValidator("param", z.object({ id: uuid() })),
  zValidator("json", updateIdeaSchema),
  async (c) => {
    const { id } = c.req.param();
    const data = c.req.valid("json");
    const user = c.get("user");

    const [updatedIdea] = await ideasRepository.update(id, user.id, data);

    if (!updatedIdea) {
      throw new NotFoundException("Idea");
    }

    return c.body(null, 204);
  },
);
