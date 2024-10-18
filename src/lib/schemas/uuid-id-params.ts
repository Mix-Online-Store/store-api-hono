import { z } from "@hono/zod-openapi";

const UUIDIdParamsSchema = z.object({
  id: z
    .string()
    .uuid({ message: "Invalid Id" })
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      required: ["id"],
      example: "1c388e4b-dd52-4d09-aeab-1d3a6f0ae721",
    }),
});

export default UUIDIdParamsSchema;
