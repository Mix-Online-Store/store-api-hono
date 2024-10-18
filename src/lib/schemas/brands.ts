import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { brands } from "@/db/schema";

export const selectBrandSchema = createSelectSchema(brands);
export const insertBrandSchema = createInsertSchema(brands, {
  name: (schema) => schema.name.min(1).max(255),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
  deletedAt: true,
});
export const updateBrandSchema = createInsertSchema(brands).partial();
