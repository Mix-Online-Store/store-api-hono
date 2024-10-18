import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { categories } from "@/db/schema";

export const selectCategorySchema = createSelectSchema(categories);
export const insertCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.name.min(1).max(255),
})
  .required({
    imageUrl: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    updateCounter: true,
    deletedAt: true,
  });
export const updateCategorySchema = createInsertSchema(categories).partial();

export const CategoryIdParamsSchema = z.object({
  categoryId: z.string().openapi({
    param: {
      name: "categoryId",
      in: "path",
    },
    required: ["categoryId"],
    example: "1c388e4b-dd52-4d09-aeab-1d3a6f0ae721",
  }),
});
