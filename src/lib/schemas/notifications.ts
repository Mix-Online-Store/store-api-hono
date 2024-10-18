import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { notifications } from "@/db/schema";

export const selectNotificationSchema = createSelectSchema(notifications);
export const insertNotificationSchema = createInsertSchema(notifications, {
  name: (schema) => schema.name.min(1),
}).omit({
  id: true,
  notificationId: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
  deletedAt: true,
});
export const updateNotificationSchema =
  createInsertSchema(notifications).partial();

export const NotificationIdParamsSchema = z.object({
  notificationId: z.string().openapi({
    param: {
      name: "notificationId",
      in: "path",
    },
    required: ["notificationId"],
  }),
});
