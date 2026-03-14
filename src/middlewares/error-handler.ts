import type { ErrorHandler } from "hono";
import { CustomHttpException } from "@/lib/errors.ts";

export const errorHandler: ErrorHandler = async (error, c) => {
  console.error("[errorHandler]", error);

  if (error instanceof CustomHttpException) {
    const jsonResponseShape: {
      code: string;
      message: string | undefined;
      details?: Record<string, unknown>;
    } = {
      code: error.code,
      message: error.message,
      details: error.details,
    };

    if (!error.message) {
      jsonResponseShape.message = undefined;
    }

    return c.json(jsonResponseShape, error.status);
  }

  return c.json(
    {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
    500,
  );
};
