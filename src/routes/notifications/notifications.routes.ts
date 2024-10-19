import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";
import jsonContentRequired from "stoker/openapi/helpers/json-content-required";
import { createErrorSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";

import {
  notFoundResponseSchema,
  unauthorizedResponseSchema,
} from "@/lib/constants";
import createResponseSchema from "@/lib/schemas/create-response-schema";
import {
  insertNotificationSchema,
  NotificationIdParamsSchema,
  selectNotificationSchema,
} from "@/lib/schemas/notifications";
import { authorizePermissions, isAuth } from "@/middlewares/auth";

const tags = ["Notifications"];

export const sendNotification = createRoute({
  tags,
  path: "/notifications/send",
  method: "post",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    body: jsonContentRequired(
      insertNotificationSchema,
      "The notification to send."
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(),
      "The sent notification."
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createResponseSchema(),
      "Internal server occur."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertNotificationSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedResponseSchema,
      "Unauthorized request."
    ),
  },
});

export const trackNotification = createRoute({
  tags,
  path: "/notifications/track/{notificationId}",
  method: "get",
  request: {
    params: NotificationIdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertNotificationSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(
        z.object({
          platform: z.string(),
          success_delivery: z.optional(z.number()),
          failed_delivery: z.optional(z.number()),
          errored_delivery: z.optional(z.number()),
          opened_notification: z.optional(z.number()),
        })
      ),
      "The notification track success."
    ),
  },
});

export const allNotification = createRoute({
  tags,
  path: "/notifications/all",
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(z.array(selectNotificationSchema)),
      "The list of all notifications"
    ),
  },
  [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
    unauthorizedResponseSchema,
    "Unauthorized request."
  ),
});

export const deleteNotification = createRoute({
  tags,
  path: "/notifications/{id}",
  method: "delete",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(),
      "The notification is deleted successfully."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Notification not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedResponseSchema,
      "Unauthorized request."
    ),
  },
});

export type NotificationSendRoute = typeof sendNotification;
export type TrackNotificationRoute = typeof trackNotification;
export type AllNotificationRoute = typeof allNotification;
export type DeleteNotificationRoute = typeof deleteNotification;
