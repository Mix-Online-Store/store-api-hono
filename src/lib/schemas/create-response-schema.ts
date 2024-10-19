import { z } from "@hono/zod-openapi";

import type { ZodSchema } from "../types";

export default function createResponseSchema<T extends ZodSchema>(
  schema?: T,
  message: string = "Operation success."
) {
  if (!schema) {
    return z.object({
      success: z.boolean().openapi({
        example: false,
      }),
      message: z.string().openapi({
        example: message,
      }),
    });
  }

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
    data: z.array(schema),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    totalPage: z.coerce.number().optional(),
    metaData: z.optional(z.null() ?? z.object({})),
  });
}
