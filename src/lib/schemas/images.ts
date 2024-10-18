import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { images } from "@/db/schema";

export const selectImageSchema = createSelectSchema(images);
export const insertImageSchema = createInsertSchema(images, {
  url: (schema) => schema.url.url(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
  deletedAt: true,
});
export const updateImageSchema = createInsertSchema(images).partial();

export const ProductIdParamsSchema = z.object({
  productId: z.string().openapi({
    param: {
      name: "productId",
      in: "path",
    },
    required: ["productId"],
    example: "1c388e4b-dd52-4d09-aeab-1d3a6f0ae721",
  }),
});
