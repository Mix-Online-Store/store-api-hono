import { z } from "@hono/zod-openapi";

import type { ZodSchema } from "../types";

export default function createResponseSchema<T extends ZodSchema>(
  schema: T,
  message: string = "Operation success."
) {
  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    message: z.string().openapi({
      example: message,
    }),
    data: z.optional(schema),
  });
}

export function createPaginatedResponseSchema<T extends ZodSchema>(
  schema: T,
  message: string = "Operation success."
) {
  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    message: z.string().openapi({
      example: message,
    }),
    data: z.optional(schema),
    page: z.coerce.number().optional(),
    pages: z.coerce.number().optional(),
  });
}
