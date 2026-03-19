import { z } from "zod";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";
import { ValidationException } from "./errors.js";

export const zValidator = <
  T extends z.ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      throw new ValidationException(fieldErrors);
    }
  });
