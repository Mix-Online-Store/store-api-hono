import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { posters } from "@/db/schema";

export const selectPosterSchema = createSelectSchema(posters);
export const insertPosterSchema = createInsertSchema(posters, {
  name: (schema) => schema.name.min(1),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
  deletedAt: true,
});
export const updatePosterSchema = createInsertSchema(posters).partial();
