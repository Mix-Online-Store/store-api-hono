import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { products } from "@/db/schema";

export const selectProductSchema = createSelectSchema(products);
export const insertProductSchema = createInsertSchema(products, {
  name: (schema) => schema.name.min(1),
  description: (schema) => schema.description.min(1),
})
  .required({
    categoryId: true,
    subCategoryId: true,
    brandId: true,
    quantity: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    updateCounter: true,
    deletedAt: true,
  });
export const updateProductSchema = createInsertSchema(products).partial();
