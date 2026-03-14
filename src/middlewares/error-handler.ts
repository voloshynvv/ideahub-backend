import type { ErrorHandler } from "hono";
import { CustomHttpException } from "@/lib/errors.ts";

export const errorHandler: ErrorHandler = async (error, c) => {
  console.error("[errorHandler]", error);

  if (error instanceof CustomHttpException) {
    return c.json(
      {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      error.status,
    );
  }

  return c.json(
    {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
    500,
  );
};
