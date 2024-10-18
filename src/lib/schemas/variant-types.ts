import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { variantTypes } from "@/db/schema";

export const selectVariantTypeSchema = createSelectSchema(variantTypes);
export const insertVariantTypeSchema = createInsertSchema(variantTypes, {
  name: (schema) => schema.name.min(1).max(255),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
  deletedAt: true,
});
export const updateVariantTypeSchema =
  createInsertSchema(variantTypes).partial();
