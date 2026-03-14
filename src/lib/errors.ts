import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

type HTTPExceptionOptions = {
  res?: Response;
  message?: string;
  cause?: unknown;
};

export class CustomHttpException extends HTTPException {
  code: string;
  details?: Record<string, unknown>;

  constructor(
    status: ContentfulStatusCode,
    code: string,
    options?: HTTPExceptionOptions,
    details?: Record<string, unknown>,
  ) {
    super(status, options);
    this.name = "CustomHttpError";
    this.code = code;
    this.details = details;
  }
}

export class NotFoundException extends CustomHttpException {
  constructor(resource: string, options?: HTTPExceptionOptions) {
    super(404, "NOT_FOUND", {
      message: `Resource '${resource}' not found`,
      ...options,
    });

    this.name = "NotFoundError";
  }
}

export type ValidationErrors = Record<string, string[]>;

export class ValidationException extends CustomHttpException {
  constructor(errors: ValidationErrors, options?: HTTPExceptionOptions) {
    super(
      400,
      "VALIDATION_ERROR",
      {
        message: "Validation failed",
        ...options,
      },
      { errors },
    );

    this.name = "ValidationError";
  }
}
