import type { ErrorHandler } from "hono";

export const errorHandler: ErrorHandler = async (error, c) => {
  console.error("Error:", error);

  return c.json(
    {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
    500,
  );
};
