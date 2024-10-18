import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { orderItems } from "@/db/schema";

export const selectOrderItemSchema = createSelectSchema(orderItems);

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  orderId: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
  deletedAt: true,
});
export const updateOrderItemSchema = createInsertSchema(orderItems).partial();
