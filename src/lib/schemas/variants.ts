import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { variants } from "@/db/schema";

export const selectVariantSchema = createSelectSchema(variants);
export const insertVariantSchema = createInsertSchema(variants, {
  name: (schema) => schema.name.min(1).max(255),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
  deletedAt: true,
});
export const updateVariantSchema = createInsertSchema(variants).partial();
