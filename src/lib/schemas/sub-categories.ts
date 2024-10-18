import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { subCategories } from "@/db/schema";

export const selectSubCategorySchema = createSelectSchema(subCategories);
export const insertSubCategorySchema = createInsertSchema(subCategories, {
  name: (schema) => schema.name.min(1).max(255),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
  deletedAt: true,
});
export const updateSubCategorySchema =
  createInsertSchema(subCategories).partial();

export const SubCategoryIdParamsSchema = z.object({
  subCategoryId: z.string().openapi({
    param: {
      name: "subCategoryId",
      in: "path",
    },
    required: ["subCategoryId"],
    example: "1c388e4b-dd52-4d09-aeab-1d3a6f0ae721",
  }),
});
