import type { NotFoundHandler } from "hono";

const notFound: NotFoundHandler = (c) => {
  return c.json({ error: "Not found" }, 404);
};

export default notFound;
